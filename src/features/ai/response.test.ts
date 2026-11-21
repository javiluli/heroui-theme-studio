import { describe, expect, it } from 'vitest';
import { extractThemeJson, responseDiagnostic, ThemeResponseParseError } from './response';

const json = JSON.stringify({
  name: 'Bosque { profundo }',
  description: 'Vistas "suaves"',
  accent: '#45AA55',
  radius: 8,
});

describe('Qwen structured output parser', () => {
  it('accepts plain structured output', () => {
    expect(extractThemeJson(json)).toMatchObject({ name: 'Bosque { profundo }', radius: 8 });
  });

  it('strips Qwen3.5 empty thinking tags, even when enable_thinking=false', () => {
    expect(extractThemeJson('<think>\n\n</think>\n\n' + json)).toMatchObject({ accent: '#45AA55' });
  });

  it('ignores reasoning JSON and extracts only the final answer', () => {
    const answer = '<think>{"name":"WRONG","radius":7}</think>\n' + json;
    expect(extractThemeJson(answer)).toMatchObject({ name: 'Bosque { profundo }' });
  });

  it('accepts JSON in markdown and balanced braces inside quoted strings', () => {
    expect(extractThemeJson('Resultado:\n```json\n' + json + '\n```')).toMatchObject({ radius: 8 });
  });

  it('rejects incomplete thinking and incomplete JSON without guessing', () => {
    for (const output of ['<think>we should use {"name":"bad"}', '<think></think> {"name": ', '{"name":"unfinished"']) {
      expect(() => extractThemeJson(output)).toThrow(ThemeResponseParseError);
    }
  });

  it('rejects non JSON and corrupt strings', () => {
    expect(() => extractThemeJson('No puedo ayudarte')).toThrow(ThemeResponseParseError);
    expect(() => extractThemeJson('{"name":oops}')).toThrow(ThemeResponseParseError);
    expect(() => extractThemeJson('')).toThrow(ThemeResponseParseError);
  });

  it('reports short output metadata for diagnosing retries', () => {
    expect(responseDiagnostic('a'.repeat(500), 'length')).toMatchObject({
      length: 500, finishReason: 'length',
    });
    expect(responseDiagnostic('a'.repeat(500), 'length').prefix.length).toBeLessThan(200);
  });
});
