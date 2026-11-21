import { describe, expect, it } from 'vitest';
import { likelyFitsSiteQuota, planModelsForStorage, formatMegabytes } from './storage';

const large = { model_id: 'big', vram_required_MB: 6400 };
const small = { model_id: 'small', vram_required_MB: 1000 };
const tiny = { model_id: 'tiny', vram_required_MB: 400 };

describe('browser storage-aware model planning', () => {
  it('filters likely oversized downloads without confusing browser quota with physical disk space', () => {
    expect(likelyFitsSiteQuota(large, 2000, false)).toBe(false);
    expect(likelyFitsSiteQuota(small, 2000, false)).toBe(true);
    expect(likelyFitsSiteQuota(large, null, false)).toBe(true);
  });

  it('keeps strongest-first order when storage permits and reuses a loaded engine', () => {
    const estimate = { usedMB: 200, quotaMB: 2300, availableMB: 2100 };
    const plan = planModelsForStorage([large, small, tiny], new Set(['tiny']), estimate);
    expect(plan.models.map((m) => m.model_id)).toEqual(['small', 'tiny']);
    expect(plan.skipped).toBe(1);
    expect(plan.cached).toBe(1);

    const reused = planModelsForStorage(
      [large, small, tiny], new Set(['tiny', 'small']), estimate, 'small',
    );
    expect(reused.models[0].model_id).toBe('small');
  });

  it('allows cached models even when remaining storage quota is very low', () => {
    const estimate = { usedMB: 1950, quotaMB: 2000, availableMB: 50 };
    const plan = planModelsForStorage([large, small], new Set(['small']), estimate);
    expect(plan.models.map((m) => m.model_id)).toEqual(['small']);
  });

  it('formats storage estimates legibly', () => {
    expect(formatMegabytes(2048)).toBe('2.0 GB');
    expect(formatMegabytes(350)).toBe('350 MB');
  });
});
