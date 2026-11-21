/**
 * Theme AI tuning. Edit this file to change generation quality and fallback policy.
 *
 * Candidates are listed strongest-first (practical priority, not a benchmark).
 * Only models present in the installed WebLLM prebuiltAppConfig are considered.
 * GPU compatibility determines q4f16 vs q4f32; actual VRAM is not exposed reliably
 * by WebGPU, so failed model loads automatically fall through to the next candidate.
 *
 * IMPORTANT: Large models can require multi-GB downloads on first use.
 */
export const AI_MODEL_PRIORITY = [
  'Qwen3.5-9B',
  'Qwen3-8B',
  'Qwen2.5-7B-Instruct',
  'Qwen3.5-4B',
  'Qwen3-4B',
  'Phi-3.5-mini-instruct',
  'gemma-4-E2B-it',
  'Qwen2.5-3B-Instruct',
  'Llama-3.2-3B-Instruct',
  'Qwen3.5-2B',
  'Qwen3-1.7B',
  'SmolLM2-1.7B-Instruct',
  'Qwen2.5-1.5B-Instruct',
  'Qwen3.5-0.8B',
  'Llama-3.2-1B-Instruct',
  'Qwen2.5-0.5B-Instruct',
  'SmolLM2-360M-Instruct',
] as const;

/** Higher temperatures increase creativity but lower the reliability of small models. */
export const AI_TEMPERATURE = 0.45;
export const AI_NEW_THEME_TEMPERATURE = 0.65;
export const AI_MAX_TOKENS = 768;

/** Conservative boundaries for accidental freeform / unrelated requests. */
export const AI_MAX_PROMPT_LENGTH = 1000;
export const AI_MIN_PROMPT_LENGTH = 2;

export interface AvailableModelRecord {
  model_id: string;
  vram_required_MB?: number;
  required_features?: string[];
}

/** Rank compatible prebuilt models. Do not construct undocumented model URLs. */
export function rankLocalModels(
  available: readonly AvailableModelRecord[],
  shaderF16: boolean,
): AvailableModelRecord[] {
  const candidates: AvailableModelRecord[] = [];
  for (const family of AI_MODEL_PRIORITY) {
    const variants = shaderF16
      ? [`${family}-q4f16_1-MLC`, `${family}-q4f32_1-MLC`]
      : [`${family}-q4f32_1-MLC`];
    for (const id of variants) {
      const model = available.find((record) => record.model_id === id);
      if (model && (shaderF16 || !model.required_features?.includes('shader-f16'))) candidates.push(model);
    }
  }
  return candidates;
}
