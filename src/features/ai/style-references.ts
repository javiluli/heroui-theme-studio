/**
 * Optional, curated visual references for brand-inspired themes.
 * Keep these references design-only: no logos, trademarks or official affiliation.
 * Add a new entry only after verifying its palette; the model alone is not a source of truth.
 */
export interface StyleReference {
  id: string;
  label: string;
  match: RegExp;
  accent: string;
  darkBackground: string;
  darkSurface: string;
  neutral: string;
  defaultDarkStyle: 'black' | 'charcoal' | 'tinted';
}

export const STYLE_REFERENCES: readonly StyleReference[] = [
  {
    id: 'spotify',
    label: 'Spotify',
    match: /\bspotify\b/i,
    accent: '#1ED760',
    darkBackground: '#121212',
    darkSurface: '#1F1F1F',
    neutral: '#8E8E8E',
    defaultDarkStyle: 'charcoal',
  },
];

export function findStyleReference(instruction: string): StyleReference | null {
  return STYLE_REFERENCES.find((reference) => reference.match.test(instruction)) ?? null;
}

export function referencePrompt(instruction: string): string {
  const reference = findStyleReference(instruction);
  if (!reference) return '';
  return [
    'Verified visual reference (design inspiration only): ' + reference.label,
    'Reference accent: ' + reference.accent,
    'Dark background: ' + reference.darkBackground,
    'Dark surface: ' + reference.darkSurface,
    'Use the characteristic color identity unless the user explicitly requests another accent.',
    'Do not imitate logos or claim official affiliation.',
  ].join('\n');
}
