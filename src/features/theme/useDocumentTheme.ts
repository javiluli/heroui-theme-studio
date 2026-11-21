import { useCallback, useLayoutEffect, useRef } from 'react';
import { cssColorValue, getThemeVariables } from './conversion';
import type { ColorToken, ThemeConfig, ThemeMode } from './model';

/** Apply the approved theme to <html>, including HeroUI portals. */
export function useDocumentTheme(theme: ThemeConfig, mode: ThemeMode) {
  const frame = useRef<number | null>(null);
  const draft = useRef<{ token: ColorToken; color: string } | null>(null);
  const painted = useRef<{ name: string; previous: string } | null>(null);

  const clearColorPreview = useCallback((token?: ColorToken) => {
    if (token && draft.current?.token !== token) return;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    draft.current = null;
    if (painted.current) {
      const { name, previous } = painted.current;
      document.documentElement.style.setProperty(name, previous);
      painted.current = null;
    }
  }, []);

  const previewColor = useCallback((token: ColorToken, color: string) => {
    if (draft.current?.token === token && draft.current.color === color) return;
    draft.current = { token, color };
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      if (!draft.current) return;
      const name = '--' + draft.current.token;
      const style = document.documentElement.style;
      if (painted.current && painted.current.name !== name) {
        style.setProperty(painted.current.name, painted.current.previous);
        painted.current = null;
      }
      const value = cssColorValue(draft.current.color);
      const previous = style.getPropertyValue(name);
      if (previous === value) return;
      painted.current ??= { name, previous };
      style.setProperty(name, value);
    });
  }, []);

  useLayoutEffect(() => clearColorPreview, [clearColorPreview]);
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = mode;
    root.classList.toggle('dark', mode === 'dark');
    root.classList.toggle('light', mode === 'light');
    root.style.colorScheme = mode;
    // HeroUI's scrollbar utility reads this pair rather than the editable alias.
    root.style.setProperty('--scrollbar-color', 'var(--scrollbar) var(--scrollbar-track)');
  }, [mode]);

  useLayoutEffect(() => {
    // After a commit, closing the picker must never restore the old draft baseline.
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    draft.current = null;
    painted.current = null;
    const root = document.documentElement;
    for (const [name, value] of Object.entries(getThemeVariables(theme, mode))) {
      if (root.style.getPropertyValue(name) !== value) root.style.setProperty(name, value);
    }
  }, [theme, mode]);

  return { previewColor, clearColorPreview };
}
