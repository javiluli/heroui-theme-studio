import { describe, expect, it } from 'vitest';
import { applyThemeProposal, AI_CORE_TOKENS, parseThemeDraft, parseThemeProposal } from './model';
import { createPreset } from '../theme/templates';
import { isThemeConfig } from '../theme/storage';

const colors = Object.fromEntries(AI_CORE_TOKENS.map((key) => [key, '#AABBCC']));
const proposal = { name: 'Ocean', description: 'Tema de prueba', radius: 12, light: colors, dark: colors };
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
  it('supports valid generated palette structures and applies native tokens', () => {
    const original = createPreset();
    const parsed = parseThemeProposal(JSON.stringify(proposal));
    const applied = applyThemeProposal(original, parsed);
    expect(applied.palettes.light.accent).toBe('#AABBCC');
    expect(applied.palettes.dark.background).toBe('#AABBCC');
    expect(applied.palettes.light['accent-foreground']).toMatch(/^#/);
    expect(applied.palettes.light.focus).toBe(applied.palettes.light.accent);
    expect(applied.palettes.light['field-placeholder']).toBe(applied.palettes.light.muted);
    expect(applied.palettes.dark['surface-secondary-foreground']).toBe(applied.palettes.dark.foreground);
    expect(original.palettes.light.accent).not.toBe(applied.palettes.light.accent);
    expect(isThemeConfig(applied)).toBe(true);
  });
});
