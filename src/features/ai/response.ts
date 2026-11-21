/**
 * WebLLM/Qwen3.5 may prepend <think>...</think> even with
 * extra_body.enable_thinking=false. Never parse JSON from inside reasoning.
 * The response may also contain markdown fences or a trailing explanation.
 */
export class ThemeResponseParseError extends Error {
  constructor(
    message: string,
    public readonly reason: 'empty' | 'thinking' | 'missing-object' | 'incomplete' | 'malformed',
  ) {
    super(message);
    this.name = 'ThemeResponseParseError';
  }
}

function stripLeadingReasoning(source: string): string {
  let output = source.replace(/^\uFEFF/, '').trim();
  while (/^<think(?:\s[^>]*)?>/i.test(output)) {
    const end = output.search(/<\/think\s*>/i);
    if (end < 0) {
      throw new ThemeResponseParseError(
        'The response ended inside the model reasoning block (<think>).',
        'thinking',
      );
    }
    output = output.slice(end).replace(/^<\/think\s*>/i, '').trimStart();
  }
  return output;
}

function balancedObject(source: string): string | null {
  const start = source.indexOf('{');
  if (start < 0) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = start; index < source.length; index++) {
    const char = source[index];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
    } else if (char === '"') {
      inString = true;
    } else if (char === '{') {
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth === 0) return source.slice(start, index + 1);
      if (depth < 0) return null;
    }
  }
  return null;
}

export function extractThemeJson(output: string): unknown {
  const source = stripLeadingReasoning(output);
  if (!source) throw new ThemeResponseParseError('The model returned an empty response.', 'empty');
  if (/^<think(?:\s|>)/i.test(source)) {
    throw new ThemeResponseParseError('The response contains an unfinished reasoning block.', 'thinking');
  }

  const clean = source.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
  const start = clean.indexOf('{');
  if (start === -1) {
    throw new ThemeResponseParseError(
      'The model returned text instead of a theme JSON object.',
      'missing-object',
    );
  }

  // Never accept JSON that appears inside an unclosed reasoning segment.
  if (/<think(?:\s|>)/i.test(clean.slice(0, start))) {
    throw new ThemeResponseParseError(
      'The JSON appears inside an unclosed reasoning block.',
      'thinking',
    );
  }

  const json = balancedObject(clean);
  if (!json) {
    throw new ThemeResponseParseError(
      'The JSON response ended before the object was closed.',
      'incomplete',
    );
  }

  try {
    const parsed: unknown = JSON.parse(json);
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new ThemeResponseParseError('Expected a theme JSON object.', 'malformed');
    }
    return parsed;
  } catch (error) {
    if (error instanceof ThemeResponseParseError) throw error;
    throw new ThemeResponseParseError(
      'The response contains malformed JSON.',
      'malformed',
    );
  }
}

/** Reveal only a short sanitized prefix, not the entire (possibly private) model output. */
export function responseDiagnostic(output: string, finishReason: string | null | undefined) {
  return {
    finishReason: finishReason ?? 'unknown',
    length: output.length,
    prefix: JSON.stringify(output.slice(0, 180)),
  };
}
