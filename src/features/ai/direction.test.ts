import { describe, expect, it } from 'vitest';
import { getThemeGenerationMode, previousThemeForRequest } from './direction';

describe('theme conversation independence', () => {
  it('starts new themes for brand/style changes', () => {
    for (const prompt of [
      'Genérame ahora un tema estilo spotify',
      'Quiero un tema estilo Spotify',
      'spotify',
      'Hazlo estilo Spotify',
      'Crea otro tema elegante',
      'Un tema inspirado en un reproductor de música',
    ]) {
      expect(getThemeGenerationMode(prompt, true)).toBe('new');
    }
  });
  it('retains previous context only for explicit refinements', () => {
    for (const prompt of ['Más contraste', 'Hazlo menos saturado', 'Cambia el acento a verde', 'Mantén el color pero suaviza bordes']) {
      expect(getThemeGenerationMode(prompt, true)).toBe('refine');
    }
    expect(getThemeGenerationMode('Más contraste', false)).toBe('new');
  });
  it('provides no purple theme as context to a new Spotify prompt', () => {
    const previous = { accent: '#8D16BC' };
    expect(previousThemeForRequest('Genérame ahora un tema estilo spotify', previous)).toBeUndefined();
    expect(previousThemeForRequest('Más contraste', previous)).toBe(previous);
  });
});
