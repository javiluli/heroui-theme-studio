import { describe, expect, it } from 'vitest';
import { parseThemeDraft } from './model';

const seed = {
  name: 'Purple', description: 'Violet theme', accent: '#6633CC', neutral: '#7F7D83',
  contrast: 'balanced', darkStyle: 'tinted', radius: 9,
};

describe('local AI suggestions', () => {
  it('parses compact model seeds and preserves HEX colors', () => {
    const parsed = parseThemeDraft(JSON.stringify(seed));
    expect(parsed.accent).toBe('#6633CC');
    expect(parsed.neutral).toBe('#7F7D83');
    expect(parsed.radius).toBe(9);
  });
  it('rejects invalid model output before palette synthesis', () => {
    expect(() => parseThemeDraft('not json')).toThrow();
    expect(() => parseThemeDraft(JSON.stringify({ ...seed, accent: 'url(evil)' }))).toThrow();
    expect(() => parseThemeDraft(JSON.stringify({ ...seed, darkStyle: 'unknown' }))).toThrow();
    expect(() => parseThemeDraft(JSON.stringify({ ...seed, radius: 30 }))).toThrow();
  });
});
