import { describe, expect, it } from 'vitest';
import { AI_MODEL_PRIORITY, rankLocalModels } from './config';

const catalog = [
  { model_id: 'Qwen3.5-9B-q4f16_1-MLC', vram_required_MB: 6433, required_features: ['shader-f16'] },
  { model_id: 'Qwen3.5-9B-q4f32_1-MLC', vram_required_MB: 7544 },
  { model_id: 'Qwen3.5-4B-q4f16_1-MLC', vram_required_MB: 3867 },
  { model_id: 'Qwen2.5-0.5B-Instruct-q4f32_1-MLC', vram_required_MB: 1060 },
];

describe('WebLLM model fallback order', () => {
  it('includes many free local models with strongest first', () => {
    expect(AI_MODEL_PRIORITY.length).toBeGreaterThan(10);
    expect(AI_MODEL_PRIORITY[0]).toBe('Qwen3.5-9B');
  });
  it('selects high capacity first and skips unsupported precision', () => {
    expect(rankLocalModels(catalog, true).map((m) => m.model_id)).toEqual([
      'Qwen3.5-9B-q4f16_1-MLC',
      'Qwen3.5-9B-q4f32_1-MLC',
      'Qwen3.5-4B-q4f16_1-MLC',
      'Qwen2.5-0.5B-Instruct-q4f32_1-MLC',
    ]);
    expect(rankLocalModels(catalog, false)[0].model_id).toBe('Qwen3.5-9B-q4f32_1-MLC');
  });
  it('falls back to the available precision when the preferred build is absent', () => {
    expect(rankLocalModels(catalog.slice(1), true)[0].model_id).toBe('Qwen3.5-9B-q4f32_1-MLC');
  });
  it('does not invent models missing from the active WebLLM registry', () => {
    expect(rankLocalModels([], true)).toEqual([]);
  });
});
