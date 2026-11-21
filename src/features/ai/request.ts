import { AI_THEME_SYSTEM_PROMPT } from './prompt';
import { THEME_RESPONSE_FORMAT } from './schema';
import { AI_MAX_TOKENS, AI_NEW_THEME_TEMPERATURE, AI_TEMPERATURE } from './config';
import type { ThemeProposal } from './model';
import { previousThemeForRequest } from './direction';
import { referencePrompt } from './style-references';

export function buildThemeRequest(instruction: string, previous?: ThemeProposal, attempt = 0) {
  const context = previousThemeForRequest(instruction, previous);
  const reference = referencePrompt(instruction);
  const userContent = context
    ? [
        'Adjust this existing theme while preserving all unrelated decisions:',
        JSON.stringify({
          name: context.name,
          radius: context.radius,
          previousAccent: context.light.accent,
          previousDarkAccent: context.dark.accent,
          previousLightBackground: context.light.background,
          previousDarkBackground: context.dark.background,
          previousLightSurface: context.light.surface,
          previousDarkSurface: context.dark.surface,
        }),
        'Current design requirement:',
        instruction.trim(),
      ].join('\n')
    : 'Create a NEW theme from scratch. Choose its own accent hue, saturation, luminosity and neutral mood; do not inherit earlier colors.\nDesign requirement: ' + instruction.trim();
  const referenceContext = reference ? '\n' + reference : '';
  const retryInstruction = attempt > 0
    ? '\nRETRY: Return exactly one complete JSON object, starting with { and ending with }. Include all seven keys and valid #RRGGBB accent/neutral; no reasoning, fences or prose.'
    : '';
  return {
    stream: false as const,
    messages: [
      { role: 'system' as const, content: AI_THEME_SYSTEM_PROMPT },
      { role: 'user' as const, content: userContent + referenceContext + retryInstruction },
    ],
    response_format: THEME_RESPONSE_FORMAT,
    temperature: attempt > 0 ? 0.2 : context ? AI_TEMPERATURE : AI_NEW_THEME_TEMPERATURE,
    max_tokens: attempt > 0 ? Math.max(1152, AI_MAX_TOKENS) : AI_MAX_TOKENS,
    extra_body: { enable_thinking: false },
  };
}
