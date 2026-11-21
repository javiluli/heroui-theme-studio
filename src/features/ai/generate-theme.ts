import { parseThemeDraft, type ThemeProposal } from './model';
import { composeThemeProposal } from './palette';
import { responseDiagnostic, ThemeResponseParseError } from './response';

export const THEME_FORMAT_ATTEMPTS = 2;

export interface RawThemeCompletion {
  content?: string | null;
  finishReason?: string | null;
}

/** Only retries malformed/incomplete model output; inference/worker errors propagate. */
export async function generateThemeWithRecovery(
  generateResponse: (attempt: number) => Promise<RawThemeCompletion>,
  instruction: string,
  previous?: ThemeProposal,
  onInvalidResponse?: (
    cause: unknown,
    attempt: number,
    diagnostic: ReturnType<typeof responseDiagnostic>,
  ) => void,
): Promise<ThemeProposal> {
  let lastError: unknown;
  for (let attempt = 0; attempt < THEME_FORMAT_ATTEMPTS; attempt++) {
    const raw = await generateResponse(attempt);
    const content = raw.content ?? '';
    try {
      if (!content.trim()) {
        throw new ThemeResponseParseError('The model returned an empty response.', 'empty');
      }
      const draft = parseThemeDraft(content);
      return composeThemeProposal(instruction, draft, previous);
    } catch (error) {
      lastError = error;
      onInvalidResponse?.(error, attempt, responseDiagnostic(content, raw.finishReason));
    }
  }
  const detail = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(
    'The model did not produce valid theme JSON after ' +
    THEME_FORMAT_ATTEMPTS + ' attempts. Last issue: ' + detail,
  );
}
