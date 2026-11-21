import { WebWorkerMLCEngineHandler } from '@mlc-ai/web-llm';

// The actual WebGPU inference runs off the React UI thread.
const handler = new WebWorkerMLCEngineHandler();
self.onmessage = (event: MessageEvent) => handler.onmessage(event);
