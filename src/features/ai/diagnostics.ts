/** WebLLM forwards errors from its Worker as plain strings, not necessarily Error instances. */
export function explainAIError(cause: unknown): string {
  if (typeof cause === 'string' && cause.trim()) return cause.trim();
  if (cause instanceof Error) return cause.message || cause.name;
  if (cause && typeof cause === 'object') {
    const value = cause as { message?: unknown; error?: unknown; detail?: unknown };
    if (typeof value.message === 'string' && value.message.trim()) return value.message.trim();
    if (typeof value.error === 'string' && value.error.trim()) return value.error.trim();
    if (typeof value.detail === 'string' && value.detail.trim()) return value.detail.trim();
    try {
      const serialized = JSON.stringify(cause);
      if (serialized && serialized !== '{}') return serialized;
    } catch {
      // Circular errors cannot be JSON-serialized.
    }
  }
  return 'The engine did not provide any additional error details.';
}

/**
 * A browser storage/write failure is not an inference or WebGPU limitation.
 * In particular, Firefox's NS_ERROR_FILE_NO_DEVICE_SPACE must stop retries.
 */
export function isStorageExhaustionError(detail: string): boolean {
  return /NS_ERROR_FILE_NO_DEVICE_SPACE|NO_DEVICE_SPACE|no device space|ENOSPC|QuotaExceededError|quota.{0,25}(?:exceeded|full)|not enough (?:disk )?space|insufficient (?:storage|disk) space|no hay espacio estimado suficiente|no hay espacio disponible/i.test(detail);
}

/**
 * This is the browser failing to import the WebLLM JS module itself, before
 * any model/GPU initialization. Do not confuse it with model weight downloads.
 */
export function isWebLLMModuleImportError(detail: string): boolean {
  // Dynamic import of the WebLLM library failed before model discovery.
  // A module script failure from the inference Worker is a separate error.
  return /(?:error loading|failed to fetch|failed to load|importing a)\s+dynamically imported module/i.test(detail)
    || /@mlc-ai_web-llm\.js(?:\?|\b)/i.test(detail)
    || (/module script/i.test(detail) && /(?:@mlc-ai[\/_]web-llm|node_modules\/\.vite\/deps)/i.test(detail));
}

/** Models ending in q4f16 need shader-f16; use matching q4f32 build when unavailable. */
export function compatibleModelId(requested: string, shaderF16: boolean): string {
  return !shaderF16 ? requested.replace('-q4f16_1-MLC', '-q4f32_1-MLC') : requested;
}

export function aiErrorAdvice(detail: string): string {
  if (isWebLLMModuleImportError(detail)) {
    if (/node_modules\/\.vite\/deps/i.test(detail)) {
      return 'Reload the page. If the development server still fails, restart it with npm run dev -- --force.';
    }
    return 'Could not load the AI module. Check your connection, reload the page, and try again.';
  }
  if (isStorageExhaustionError(detail)) {
    return 'The browser cannot store more model files because disk space or the site quota is full. Free space on your browser profile drive. To clear site data in Firefox, open Settings → Privacy & Security → Cookies and Site Data → Manage Data. Export your theme CSS first because clearing site data also removes your saved theme. Changing model precision does not free storage.';
  }
  if (/GrammarMatcherInitError|compileJSONSchema|std::string/i.test(detail)) {
    return 'Could not initialize JSON response formatting. Check that the request includes a valid JSON schema.';
  }
  if (/shader-f16|ShaderF16SupportError|FeatureSupportError/i.test(detail)) {
    return 'The GPU or browser could not use the required precision. The assistant tries compatible alternatives such as q4f32 when available.';
  }
  if (/device.*lost|out of memory|allocation|GPUBuffer|mapAsync|VK_ERROR_DEVICE_LOST|buffer.*size/i.test(detail)) {
    return 'The GPU may be out of memory. Close other tabs or apps that use the GPU and try again.';
  }
  if (/fetch|network|download|http|CORS|not found|cache/i.test(detail)) {
    return 'Check your connection and content blockers, and make sure model files from Hugging Face and WebAssembly files can download.';
  }
  if (/worker|module script|import|mime|Content Security Policy|CSP/i.test(detail)) {
    return 'Could not start the Web Worker. Check network requests and the hosting content security policy.';
  }
  if (/GPUAdapter|WebGPU|adapter/i.test(detail)) {
    return 'Make sure hardware acceleration is enabled, then try again in a WebGPU-compatible browser.';
  }
  return 'Restore your prompt and try again. If the issue persists, open diagnostics.';
}

interface GPUAdapterLike {
  features: { has: (feature: string) => boolean };
}

interface GPUApiLike {
  requestAdapter: () => Promise<GPUAdapterLike | null>;
}

export async function inspectWebGPU(): Promise<{ shaderF16: boolean }> {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    throw new Error('Local generation requires a browser.');
  }
  if (!window.isSecureContext) {
    throw new Error('WebGPU requires HTTPS or localhost.');
  }
  const gpu = (navigator as Navigator & { gpu?: GPUApiLike }).gpu;
  if (!gpu) {
    throw new Error('WebGPU is unavailable in this browser. Try a WebGPU-compatible browser.');
  }
  const adapter = await gpu.requestAdapter();
  if (!adapter) {
    throw new Error('WebGPU is available, but no compatible GPU adapter was found.');
  }
  return { shaderF16: adapter.features.has('shader-f16') };
}
