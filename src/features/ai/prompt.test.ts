import { describe, expect, it } from 'vitest';
import { AI_THEME_SYSTEM_PROMPT } from './prompt';
import { buildThemeRequest } from './request';

describe('HeroUI-aware local design prompt', () => {
  it('requests the seven compact seed keys, not a full CSS file or React JSX', () => {
    for (const key of ['name', 'description', 'accent', 'neutral', 'contrast', 'darkStyle', 'radius']) {
      expect(AI_THEME_SYSTEM_PROMPT).toContain(key);
    }
    expect(AI_THEME_SYSTEM_PROMPT).toContain('HeroUI React v3');
    expect(AI_THEME_SYSTEM_PROMPT).toContain('hue, saturation AND brightness');
    expect(AI_THEME_SYSTEM_PROMPT).toContain('Light and Dark');
    expect(AI_THEME_SYSTEM_PROMPT).toContain('ONLY one complete JSON object');
    expect(AI_THEME_SYSTEM_PROMPT).toContain('not only a themed title');
    expect(AI_THEME_SYSTEM_PROMPT).not.toContain('HeroUIProvider');
    expect(AI_THEME_SYSTEM_PROMPT).not.toContain('npm install');
  });

  it('keeps constrained output and uses lower temperature for local models', () => {
    const request = buildThemeRequest('Diseña un tema pastel suave');
    expect(request.response_format.type).toBe('json_object');
    expect(request.temperature).toBeLessThan(0.7);
    expect(request.max_tokens).toBeGreaterThanOrEqual(768);
    expect(request.messages[0].content).toBe(AI_THEME_SYSTEM_PROMPT);
    expect(request.messages[1].content).toContain('saturation');
  });
});
