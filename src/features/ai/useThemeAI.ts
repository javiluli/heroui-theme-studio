import { useEffect, useRef, useState } from 'react';
import type { WebWorkerMLCEngine } from '@mlc-ai/web-llm';
import { AI_MAX_PROMPT_LENGTH, AI_MIN_PROMPT_LENGTH, rankLocalModels } from './config';
import { explainAIError, inspectWebGPU, aiErrorAdvice, isStorageExhaustionError, isWebLLMModuleImportError } from './diagnostics';
import { formatMegabytes, inspectBrowserStorage, likelyFitsSiteQuota, planModelsForStorage } from './storage';
import type { ThemeProposal } from './model';
import { generateThemeWithRecovery } from './generate-theme';
import { buildThemeRequest } from './request';

export type AIStatus = 'idle' | 'loading' | 'generating' | 'ready' | 'error';

export function getWebGPUWarning(): string | null {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'The assistant requires a browser.';
  if (!window.isSecureContext) return 'WebGPU requires HTTPS or localhost.';
  if (!('gpu' in navigator)) return 'WebGPU is unavailable in this browser.';
  if (typeof Worker === 'undefined') return 'This browser does not support Web Workers.';
  return null;
}

const LOAD_TIMEOUT_MS = 240_000;
const GENERATION_TIMEOUT_MS = 180_000;
const GPU_TIMEOUT_MS = 15_000;

function withTimeout<T>(work: Promise<T>, timeMs: number, stage: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const handle = window.setTimeout(() => reject(new Error('Timed out during ' + stage)), timeMs);
    work.then(
      (value) => { window.clearTimeout(handle); resolve(value); },
      (cause) => { window.clearTimeout(handle); reject(cause); },
    );
  });
}

/** One model per worker, so GPU state and failures are isolated. */
export function useThemeAI() {
  const [status, setStatus] = useState<AIStatus>('idle');
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [advice, setAdvice] = useState('');
  const [notice, setNotice] = useState('');
  const [activeModel, setActiveModel] = useState('');
  const [stage, setStage] = useState('');
  const [proposal, setProposal] = useState<ThemeProposal | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const engineRef = useRef<WebWorkerMLCEngine | null>(null);
  const workerFailureRef = useRef<Promise<never> | null>(null);
  const modelRef = useRef<string | null>(null);
  const mountedRef = useRef(true);
  const busyRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      workerRef.current?.terminate();
      workerRef.current = null;
      engineRef.current = null;
      workerFailureRef.current = null;
    };
  }, []);

  const resetEngine = () => {
    workerRef.current?.terminate();
    workerRef.current = null;
    workerFailureRef.current = null;
    engineRef.current = null;
    modelRef.current = null;
  };

  const generate = async (prompt: string, previous?: ThemeProposal) => {
    if (busyRef.current) return;
    const warning = getWebGPUWarning();
    if (warning) {
      setStatus('error');
      setError(warning);
      setStage('Compatibility');
      setAdvice(aiErrorAdvice(warning));
      return;
    }
    if (prompt.trim().length < AI_MIN_PROMPT_LENGTH || prompt.length > AI_MAX_PROMPT_LENGTH) {
      setStatus('error');
      setError('Describe the theme requirements (' + AI_MIN_PROMPT_LENGTH + '–' + AI_MAX_PROMPT_LENGTH + ' caracteres).');
      setStage('Validation');
      setAdvice('');
      return;
    }

    busyRef.current = true;
    setStatus('loading');
    setProgress('Preparing local AI…');
    setNotice('');
    setActiveModel('');
    setAdvice('');
    setError('');
    setProposal(null);

    let currentStage = 'Checking WebGPU';
    let currentModel = '';
    const failures: string[] = [];
    const updateStage = (value: string) => {
      currentStage = value;
      if (mountedRef.current) setStage(value);
    };

    try {
      const gpu = await withTimeout(inspectWebGPU(), GPU_TIMEOUT_MS, 'the WebGPU check');
      if (!mountedRef.current) return;
      updateStage('Loading WebLLM');
      // The ESM package is lazy-loaded only when generation is requested.
      // If this import fails, no model selection/download has happened yet.
      const { CreateWebWorkerMLCEngine, hasModelInCache, prebuiltAppConfig } = await import('@mlc-ai/web-llm');
      updateStage('Finding local models');
      if (!mountedRef.current) return;
      const candidates = rankLocalModels(prebuiltAppConfig.model_list, gpu.shaderF16);
      if (!candidates.length) throw new Error('The WebLLM catalog contains no compatible models for this browser.');

      // Avoid downloading every multi-GB model without checking site quota.
      // Estimate may be inaccurate: an actual NO_DEVICE_SPACE always stops retries.
      updateStage('Checking browser storage');
      const availableStorage = await inspectBrowserStorage();
      const cacheResults = await Promise.all(candidates.map(async (candidate) => {
        if (candidate.model_id === modelRef.current) return true;
        try { return await hasModelInCache(candidate.model_id); }
        catch { return false; }
      }));
      const cachedIds = new Set(candidates.filter((_, index) => cacheResults[index]).map((item) => item.model_id));
      const plan = planModelsForStorage(candidates, cachedIds, availableStorage, modelRef.current);
      if (!plan.models.length) {
        const free = availableStorage ? formatMegabytes(availableStorage.availableMB) : 'desconocido';
        throw new Error('The browser does not appear to have enough storage for a new model. ' +
          'Available according to the browser: ' + free + '. Free disk space or clear site data.');
      }
      if (plan.skipped) {
        console.info('[Theme Studio / WebLLM] Modelos omitidos por cuota aproximada:', {
          skipped: plan.skipped,
          availableMB: availableStorage?.availableMB,
          cached: plan.cached,
        });
      }

      for (const option of plan.models) {
        if (!mountedRef.current) return;
        currentModel = option.model_id;
        setActiveModel(currentModel);
        try {
          if (!engineRef.current || modelRef.current !== currentModel) {
            // Downloads from earlier failed attempts may have consumed more quota.
            const refreshedStorage = await inspectBrowserStorage();
            if (!mountedRef.current) return;
            const cached = cachedIds.has(currentModel);
            if (!likelyFitsSiteQuota(option, refreshedStorage?.availableMB ?? null, cached)) {
              console.info('[Theme Studio / WebLLM] Salto modelo por poco espacio estimado:', currentModel);
              continue;
            }
            resetEngine();
            updateStage('Loading local model');
            setStatus('loading');
            setProgress('Preparing the local model…');

            const worker = new Worker(new URL('./theme-ai.worker.ts', import.meta.url), { type: 'module' });
            workerRef.current = worker;
            let rejectWorker: (reason: Error) => void = () => {};
            const workerFailure = new Promise<never>((_, reject) => {
              rejectWorker = reject;
            });
            worker.addEventListener('error', (event) => {
              console.error('[Theme Studio / WebLLM] Fallo de Web Worker:', event);
              rejectWorker(new Error('Web Worker: ' + (event.message || 'error running the model')));
            });
            worker.addEventListener('messageerror', (event) => {
              console.error('[Theme Studio / WebLLM] Invalid message:', event);
              rejectWorker(new Error('Web Worker: no se pudo interpretar un mensaje'));
            });
            workerFailureRef.current = workerFailure;

            const load = Promise.race([
              CreateWebWorkerMLCEngine(worker, currentModel, {
                initProgressCallback: (report) => {
                  if (!mountedRef.current) return;
                  // Keep the chat as a single spinner and short text. No percent/large progress bar.
                  if (/download|fetch|cache|loading/i.test(report.text)) setProgress('Preparing the local model…');
                },
              }),
              workerFailure,
            ]);
            const engine = await withTimeout(load, LOAD_TIMEOUT_MS, 'model loading');
            if (!mountedRef.current) { worker.terminate(); return; }
            engineRef.current = engine;
            modelRef.current = currentModel;
          }

          if (!engineRef.current) throw new Error('Could not start the AI engine.');
          updateStage('Generating theme design');
          setStatus('generating');
          setProgress('Designing your theme…');
          const engine = engineRef.current;
          const generated = await generateThemeWithRecovery(
            async (attempt) => {
              updateStage(attempt === 0 ? 'Generating theme design' : 'Retrying JSON formatting');
              setProgress(attempt === 0 ? 'Designing your theme…' : 'Correcting the response format…');
              const job = engine.chat.completions.create(buildThemeRequest(prompt, previous, attempt));
              const result = await withTimeout(
                Promise.race([job, workerFailureRef.current ?? new Promise<never>(() => {})]),
                GENERATION_TIMEOUT_MS,
                'theme generation',
              );
              if (!mountedRef.current) throw new Error('Theme generation was canceled.');
              return {
                content: result.choices[0]?.message?.content,
                finishReason: result.choices[0]?.finish_reason,
              };
            },
            prompt,
            previous,
            (cause, attempt, diagnostic) => {
              console.warn('[Theme Studio / WebLLM] Invalid response format. Retrying with the same model:', {
                model: currentModel,
                attempt: attempt + 1,
                reason: explainAIError(cause),
                ...diagnostic,
              });
            },
          );
          if (!mountedRef.current) return;
          updateStage('Checking color consistency');
          setProposal(generated);
          setNotice(failures.length ? 'The assistant switched to a compatible model.' : '');
          setProgress('');
          setStatus('ready');
          return;
        } catch (cause) {
          const detail = explainAIError(cause);
          console.warn('[Theme Studio / WebLLM] Modelo descartado; probando alternativa:', {
            model: currentModel,
            stage: currentStage,
            detail,
            cause,
          });
          // A full Firefox cache/disk is not a model incompatibility.
          // Trying more models would only fill the browser with partial downloads.
          if (isStorageExhaustionError(detail)) {
            resetEngine();
            updateStage('Browser storage');
            throw new Error(detail);
          }
          failures.push(currentModel + ': ' + detail);
          resetEngine();
          if (mountedRef.current) {
            setStatus('loading');
            setProgress('Trying another local model…');
          }
        }
      }
      throw new Error('No available local model could generate a theme on this device. ' +
        (failures.length ? 'Last error: ' + failures[failures.length - 1] : 'No compatible models are available.'));
    } catch (cause) {
      if (!mountedRef.current) return;
      const detail = explainAIError(cause);
      console.error(isWebLLMModuleImportError(detail)
        ? '[Theme Studio / WebLLM] No se pudo importar la biblioteca JavaScript de WebLLM:'
        : '[Theme Studio / WebLLM] No disponible:', {
        stage: currentStage,
        lastModel: currentModel,
        attempted: failures.length,
        detail,
        cause,
      });
      setError(detail);
      setAdvice(aiErrorAdvice(detail));
      setStage(currentStage);
      setProgress('');
      setStatus('error');
    } finally {
      busyRef.current = false;
    }
  };

  return { status, progress, error, advice, notice, activeModel, stage, proposal, generate };
}
