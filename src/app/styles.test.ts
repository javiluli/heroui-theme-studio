import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('HeroUI components remain styled exclusively by their installed library', () => {
  it('paints the document canvas with the active theme background', () => {
    const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
    expect(html).toMatch(/<html\b[^>]*class="[^"]*\bbg-background\b/);
  });

  it('keeps globals.css to the official Tailwind / HeroUI imports only', () => {
    const source = readFileSync(new URL('./styles.css', import.meta.url), 'utf8').trim();
    expect(source.replace(/\r\n/g, '\n')).toBe('@import "tailwindcss";\n@import "@heroui/styles";');
    expect(source).not.toMatch(/[{}]/);
  });

  it('never reintroduces custom BEM CSS selectors, component styling or keyframes', () => {
    const css = readFileSync(new URL('./styles.css', import.meta.url), 'utf8');
    expect(css).not.toContain('.button');
    expect(css).not.toContain('.card');
    expect(css).not.toContain('.input');
    expect(css).not.toContain('@keyframes');
    expect(css).not.toContain('@layer');
  });
});
