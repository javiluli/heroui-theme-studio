import { describe, expect, it } from 'vitest';
import { findStyleReference, referencePrompt } from './style-references';

describe('curated design references', () => {
  it('matches Spotify with green and charcoal visual cues', () => {
    expect(findStyleReference('Un tema estilo SPOTIFY')).toMatchObject({
      accent: '#1ED760', darkBackground: '#121212', darkSurface: '#1F1F1F',
    });
    expect(referencePrompt('Tema tipo spotify')).toContain('#1ED760');
  });
  it('avoids matching unrelated words or adding reference context', () => {
    expect(findStyleReference('Quiero un tema morado')).toBeNull();
    expect(referencePrompt('Quiero un tema morado')).toBe('');
  });
});
