import { describe, expect, it } from 'vitest';
import { AI_CORE_TOKENS, type ThemeProposal } from './model';
import { buildThemeRequest } from './request';

describe('Theme generation request', () => {
  it('uses JSON schema for a compact design seed instead of 18 independent colors', () => {
    const request = buildThemeRequest('Un tema moderno de tonos azules');
    expect(request.response_format.type).toBe('json_object');
    expect(typeof request.response_format.schema).toBe('string');
    expect(JSON.parse(request.response_format.schema)).toMatchObject({
      required: ['name', 'description', 'accent', 'neutral', 'contrast', 'darkStyle', 'radius'],
    });
    expect(request.messages[1].role).toBe('user');
    expect(request.extra_body.enable_thinking).toBe(false);
  });

  it('reinforces structured output on retry without changing model', () => {
    const first = buildThemeRequest('Tema morado', undefined, 0);
    const retry = buildThemeRequest('Tema morado', undefined, 1);
    expect(retry.messages[1].content).toContain('RETRY');
    expect(retry.max_tokens).toBeGreaterThan(first.max_tokens);
    expect(retry.response_format.schema).toBe(first.response_format.schema);
    expect(retry.extra_body.enable_thinking).toBe(false);
  });

  it('starts a new Spotify theme without copying the previous purple theme', () => {
    const colors = Object.fromEntries(AI_CORE_TOKENS.map((key) => [key, '#8D16BC'])) as ThemeProposal['light'];
    const oldTheme: ThemeProposal = { name: 'Violeta Profesional', description: 'purple', radius: 12, light: colors, dark: colors };
    const request = buildThemeRequest('Genérame ahora un tema estilo spotify', oldTheme);
    expect(request.messages[1].content).not.toContain('previousAccent');
    expect(request.messages[1].content).not.toContain('Violeta Profesional');
    expect(request.messages[1].content).toContain('#1ED760');
    expect(request.messages[1].content).toContain('#121212');
  });

  it('includes both light and dark surface context only for true refinements', () => {
    const colors = Object.fromEntries(AI_CORE_TOKENS.map((key) => [key, '#112233'])) as ThemeProposal['light'];
    const oldTheme: ThemeProposal = { name: 'Old', description: 'Old style', radius: 12, light: colors, dark: colors };
    const refine = buildThemeRequest('Hazlo menos saturado', oldTheme);
    expect(refine.messages[1].content).toContain('previousLightSurface');
    expect(refine.messages[1].content).toContain('previousDarkSurface');
    const fresh = buildThemeRequest('Crea otro tema cálido', oldTheme);
    expect(fresh.messages[1].content).not.toContain('previousLightSurface');
    expect(fresh.messages[1].content).toContain('Create a NEW theme');
  });

  it('passes lightweight previous theme context on follow-up', () => {
    const colors = Object.fromEntries(AI_CORE_TOKENS.map((key) => [key, '#112233'])) as ThemeProposal['light'];
    const prev: ThemeProposal = { name: 'Ocean', description: 'Calm', radius: 8, light: colors, dark: colors };
    const request = buildThemeRequest('Reduce el azul', prev);
    expect(request.messages[1].content).toContain('"previousAccent":"#112233"');
    expect(request.messages[1].content).toContain('Reduce el azul');
  });
});
