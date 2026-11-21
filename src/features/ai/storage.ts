import type { AvailableModelRecord } from './config';

/**
 * navigator.storage.estimate() describes the site's approximate quota, not
 * actual remaining disk space, and not GPU VRAM. It is only a preflight hint.
 */
export interface StorageSnapshot {
  usedMB: number;
  quotaMB: number;
  availableMB: number;
}

export async function inspectBrowserStorage(): Promise<StorageSnapshot | null> {
  if (typeof navigator === 'undefined' || !navigator.storage?.estimate) return null;
  try {
    const { usage, quota } = await navigator.storage.estimate();
    if (typeof usage !== 'number' || typeof quota !== 'number' ||
      !Number.isFinite(usage) || !Number.isFinite(quota) || quota <= 0) return null;
    const mb = 1024 * 1024;
    const usedMB = Math.max(0, usage / mb);
    const quotaMB = Math.max(0, quota / mb);
    return { usedMB, quotaMB, availableMB: Math.max(0, quotaMB - usedMB) };
  } catch {
    // Some browsers restrict or distort storage estimates. Do not block WebLLM.
    return null;
  }
}

export function formatMegabytes(value: number): string {
  return value >= 1024 ? (value / 1024).toFixed(1) + ' GB' : Math.round(value) + ' MB';
}

/**
 * Model VRAM requirements are NOT download sizes. Apply a conservative rough
 * proxy only when the browser reports a storage quota. A cached model needs no
 * new model-weight download. Unknown estimates never block an attempt.
 */
export function likelyFitsSiteQuota(
  model: AvailableModelRecord,
  freeMB: number | null,
  isCached: boolean,
): boolean {
  if (isCached || freeMB === null) return true;
  if (!Number.isFinite(freeMB) || freeMB < 256) return false;
  if (typeof model.vram_required_MB !== 'number' || model.vram_required_MB <= 0) return true;
  const proxyMB = model.vram_required_MB * 0.85 + 256;
  return freeMB >= proxyMB;
}

export interface StoragePlan {
  models: AvailableModelRecord[];
  skipped: number;
  cached: number;
}

/**
 * Keep strongest-first ranking among models that fit the estimated quota.
 * Only an already running engine is re-used at the front on subsequent turns.
 * Cached weights bypass the estimate because no new download is needed.
 */
export function planModelsForStorage(
  ranked: readonly AvailableModelRecord[],
  cachedIds: ReadonlySet<string>,
  storage: StorageSnapshot | null,
  loadedModelId?: string | null,
): StoragePlan {
  const models: AvailableModelRecord[] = [];
  let skipped = 0;
  let cached = 0;
  for (const model of ranked) {
    const stored = model.model_id === loadedModelId || cachedIds.has(model.model_id);
    if (stored) cached++;
    if (!likelyFitsSiteQuota(model, storage?.availableMB ?? null, stored)) {
      skipped++;
      continue;
    }
    models.push(model);
  }
  const loaded = loadedModelId ? models.find((item) => item.model_id === loadedModelId) : undefined;
  return {
    models: loaded ? [loaded, ...models.filter((item) => item !== loaded)] : models,
    skipped,
    cached,
  };
}
