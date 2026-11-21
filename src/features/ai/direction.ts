import { findStyleReference } from './style-references';

export type ThemeGenerationMode = 'new' | 'refine';

/**
 * A chat conversation is not automatically a continuous design session:
 * requesting "another theme" must not inherit the previous accent.
 * Explicit edits, on the other hand, keep the current proposal as context.
 */
export function getThemeGenerationMode(
  instruction: string,
  hasPrevious: boolean,
): ThemeGenerationMode {
  if (!hasPrevious) return 'new';
  const input = instruction.trim();

  // These describe a new visual identity, even after a previous theme.
  if (/\b(?:new|another|from scratch|nuevo|nueva|otro|otra|desde cero|independiente|diferente|distinto)\b/i.test(input)) {
    return 'new';
  }
  if (/\b(?:create|generate|design|crea(?:me)?|genera(?:me)?|diseña(?:me)?|quiero|hazme|dame)\b.{0,85}\b(?:tema|theme|estilo|look|diseño)\b/i.test(input)) {
    return 'new';
  }
  if (/\b(?:tema|theme|estilo|look)\b.{0,55}\b(?:inspired by|inspirado|inspirada|tipo|similar a|como|spotify)\b/i.test(input)) {
    return 'new';
  }
  // Named design inspirations replace the visual identity rather than
  // continuing the previous purple/blue hue.
  if (findStyleReference(input)) return 'new';

  // Requests for a new overall theme without explicit editing verbs.
  if (/\b(?:tema|theme)\b/i.test(input) &&
    !/\b(?:keep|retain|adjust|change|reduce|increase|more|less|mant[eé]n|conserva|retoca|modifica|ajusta|cambia|reduce|aumenta|más|menos)\b/i.test(input)) {
    return 'new';
  }
  return 'refine';
}

export function previousThemeForRequest<T>(
  instruction: string,
  previous?: T,
): T | undefined {
  return getThemeGenerationMode(instruction, previous !== undefined) === 'refine'
    ? previous
    : undefined;
}
