import { describe, expect, it } from 'vitest';
import { composeThemeProposal, contrastRatio, hexToHsl, isBlackThemeRequest } from './palette';
import type { ThemeDraft } from './model';

const draft: ThemeDraft = {
  name: 'Tema', description: 'Test', accent: '#3B82F6', neutral: '#8591A1',
  contrast: 'balanced', darkStyle: 'tinted', radius: 8,
};

describe('deterministic harmonious palettes', () => {
  it('overrides repetitive LLM colors when users request different hues', () => {
    const purple = composeThemeProposal('Tema morado profundo', draft);
    const green = composeThemeProposal('Tema verde bosque', draft);
    expect(purple.light.accent).not.toBe(green.light.accent);
    expect(hexToHsl(purple.light.accent).hue).toBeGreaterThan(255);
    expect(hexToHsl(green.light.accent).hue).toBeGreaterThan(125);
    expect(purple.light.background).not.toBe(purple.dark.background);
  });
  it('makes black themes monochrome unless another accent is explicitly requested', () => {
    expect(isBlackThemeRequest('Quiero negro puro')).toBe(true);
    const black = composeThemeProposal('Tema negro puro', draft);
    expect(black.dark.background).toBe('#000000');
    expect(hexToHsl(black.light.accent).saturation).toBe(0);
    expect(hexToHsl(black.dark.accent).saturation).toBe(0);
    const purpleOnBlack = composeThemeProposal('Fondo negro con acento morado', draft);
    expect(purpleOnBlack.dark.background).toBe('#000000');
    expect(hexToHsl(purpleOnBlack.light.accent).hue).toBeGreaterThan(255);
  });
  it('produces readable surfaces and independent semantic colors', () => {
    const theme = composeThemeProposal('Tema violeta elegante', draft);
    for (const mode of ['light', 'dark'] as const) {
      const p = theme[mode];
      expect(contrastRatio(p.foreground, p.background)).toBeGreaterThanOrEqual(4.5);
      expect(new Set([p.accent, p.success, p.warning, p.danger]).size).toBe(4);
      expect(p.surface).not.toBe(p.background);
      for (const hex of Object.values(p)) expect(hex).toMatch(/^#[0-9A-F]{6}$/);
    }
  });
  it('uses Spotify green and charcoal surfaces instead of the preceding purple theme', () => {
    const purple = composeThemeProposal('Quiero un tema profesional violeta', draft);
    const repeatedPurpleFromLLM: ThemeDraft = {
      ...draft,
      name: 'Neon Spotify',
      accent: purple.light.accent,
      neutral: '#8357AA',
      darkStyle: 'tinted',
    };
    const spotify = composeThemeProposal('Genérame ahora un tema estilo spotify', repeatedPurpleFromLLM, purple);

    expect(spotify.light.accent).not.toBe(purple.light.accent);
    expect(spotify.dark.accent).toBe('#1ED760');
    expect(spotify.dark.background).toBe('#121212');
    expect(spotify.dark.surface).toBe('#1F1F1F');
    expect(contrastRatio(spotify.dark.foreground, spotify.dark.background)).toBeGreaterThan(4.5);
    expect(hexToHsl(spotify.light.accent).hue).toBeGreaterThan(125);
    expect(hexToHsl(spotify.light.accent).hue).toBeLessThan(160);
  });
  it('honors an explicit purple accent with Spotify-like dark surfaces', () => {
    const proposal = composeThemeProposal('Tema estilo Spotify pero con acento morado', draft);
    expect(proposal.dark.background).toBe('#121212');
    expect(proposal.dark.accent).not.toBe('#1ED760');
    expect(hexToHsl(proposal.dark.accent).hue).toBeGreaterThan(255);
  });
  it('uses the new model seed rather than an unrelated preceding theme', () => {
    const purple = composeThemeProposal('Tema morado', draft);
    const newSeed: ThemeDraft = { ...draft, accent: '#1DB954', name: 'Otro tema' };
    const fresh = composeThemeProposal('Quiero otro tema moderno', newSeed, purple);
    expect(hexToHsl(fresh.light.accent).hue).toBeGreaterThan(110);
    expect(hexToHsl(fresh.light.accent).hue).toBeLessThan(170);
  });

  it('preserves model-selected saturation and lightness instead of flattening every accent', () => {
    const pastel = composeThemeProposal('Tema editorial suave', {
      ...draft, accent: '#B58ABF', neutral: '#AFA39B', contrast: 'balanced',
    });
    const intense = composeThemeProposal('Tema editorial intenso', {
      ...draft, accent: '#7426A8', neutral: '#AFA39B', contrast: 'balanced',
    });
    const pastelAccent = hexToHsl(pastel.light.accent);
    const intenseAccent = hexToHsl(intense.light.accent);
    expect(pastelAccent.saturation).toBeLessThan(intenseAccent.saturation);
    expect(pastelAccent.lightness).toBeGreaterThan(intenseAccent.lightness);
    expect(pastel.dark.accent).not.toBe(intense.dark.accent);
  });
  it('uses the neutral seed to distinguish cold from warm surfaces', () => {
    const warm = composeThemeProposal('Tema editorial', { ...draft, neutral: '#A68B75' });
    const cool = composeThemeProposal('Tema editorial', { ...draft, neutral: '#758BA6' });
    expect(warm.light.background).not.toBe(cool.light.background);
    expect(warm.dark.surface).not.toBe(cool.dark.surface);
  });
  it('keeps named accents and background moods distinct even with the same model seed', () => {
    const editorial = composeThemeProposal('Tema editorial con acento terracota, fondos cálidos', draft);
    const technical = composeThemeProposal('Tema técnico con fondo grafito y acento turquesa', draft);
    expect(hexToHsl(editorial.light.accent).hue).toBeCloseTo(17, 0);
    expect(hexToHsl(technical.light.accent).hue).toBeCloseTo(182, 0);
    expect(editorial.light.background).not.toBe(technical.light.background);
    expect(technical.dark.background).not.toBe('#000000');
  });
  it('respects explicitly requested accent HEX in both modes', () => {
    const theme = composeThemeProposal('Tema con acento #C14E6A', draft);
    expect(theme.light.accent).toBe('#C14E6A');
    expect(theme.dark.accent).toBe('#C14E6A');
  });
  it('does not mistake an explicitly black background for a black accent', () => {
    const theme = composeThemeProposal('Fondo #000000 con acento morado', draft);
    expect(theme.dark.background).toBe('#000000');
    expect(hexToHsl(theme.light.accent).hue).toBeGreaterThan(255);
    const inverse = composeThemeProposal('Acento morado y fondo #000000', draft);
    expect(inverse.light.accent).toBe(theme.light.accent);
  });
  it('can lower saturation while refining without inheriting a stale model seed', () => {
    const purple = composeThemeProposal('Tema morado', draft);
    const less = composeThemeProposal('Hazlo menos saturado', draft, purple);
    expect(hexToHsl(less.light.accent).saturation).toBeLessThan(hexToHsl(purple.light.accent).saturation);
    expect(hexToHsl(less.light.accent).hue).toBeCloseTo(hexToHsl(purple.light.accent).hue, 0);
  });

  it('keeps the previous accent on unrelated refinements', () => {
    const purple = composeThemeProposal('Tema morado', draft);
    const revised = composeThemeProposal('Más contraste, mantiene el color', draft, purple);
    expect(hexToHsl(revised.light.accent).hue).toBeCloseTo(hexToHsl(purple.light.accent).hue, 0);
  });
});
