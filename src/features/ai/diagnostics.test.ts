import { describe, expect, it } from 'vitest';
import { aiErrorAdvice, compatibleModelId, explainAIError, isStorageExhaustionError, isWebLLMModuleImportError } from './diagnostics';

describe('WebLLM diagnostics', () => {
  it('preserves plain string exceptions sent back by a Web Worker', () => {
    expect(explainAIError('ShaderF16SupportError: unsupported shader-f16')).toContain('shader-f16');
    expect(explainAIError(new Error('network failed'))).toBe('network failed');
    expect(explainAIError({ message: 'GPU device lost' })).toBe('GPU device lost');
    expect(explainAIError(null)).toContain('did not provide');
  });

  it('selects a q4f32 build when the GPU does not support shader-f16', () => {
    const model = 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC';
    expect(compatibleModelId(model, false)).toBe('Qwen2.5-0.5B-Instruct-q4f32_1-MLC');
    expect(compatibleModelId(model, true)).toBe(model);
    expect(compatibleModelId('Qwen2.5-0.5B-Instruct-q4f32_1-MLC', false)).toBe('Qwen2.5-0.5B-Instruct-q4f32_1-MLC');
  });

  it('recognizes Firefox disk/quota errors before misleading q4f16 model names', () => {
    const detail = '[Exception... "File error: No device space" nsresult: "0x80520010 (NS_ERROR_FILE_NO_DEVICE_SPACE)"]';
    expect(isStorageExhaustionError(detail)).toBe(true);
    expect(isStorageExhaustionError('QuotaExceededError: quota exceeded')).toBe(true);
    expect(isStorageExhaustionError('ShaderF16SupportError')).toBe(false);
    expect(aiErrorAdvice('SmolLM2-360M-Instruct-q4f16_1-MLC: ' + detail)).toContain('disk space');
    expect(aiErrorAdvice('SmolLM2-360M-Instruct-q4f16_1-MLC: ' + detail)).not.toContain('required precision');
  });
  it('distinguishes the local Vite WebLLM module import from network/model downloads', () => {
    const error = 'error loading dynamically imported module: http://localhost:5173/node_modules/.vite/deps/@mlc-ai_web-llm.js?v=9eecf58a';
    expect(isWebLLMModuleImportError(error)).toBe(true);
    expect(isWebLLMModuleImportError('Failed to fetch dynamically imported module')).toBe(true);
    expect(isWebLLMModuleImportError('Failed to fetch model weights from Hugging Face')).toBe(false);
    expect(isWebLLMModuleImportError('Failed to load module script in Worker')).toBe(false);
    expect(aiErrorAdvice(error)).toContain('npm run dev -- --force');
    expect(aiErrorAdvice(error)).not.toContain('Hugging Face');
  });

  it('shows actionable advice for GPU and network failures', () => {
    expect(aiErrorAdvice('ShaderF16SupportError')).toContain('q4f32');
    expect(aiErrorAdvice('Device was lost')).toContain('memory');
    expect(aiErrorAdvice('Failed to fetch')).toContain('connection');
    expect(aiErrorAdvice('Failed to load module script in Worker')).toContain('Web Worker');
  });
});
