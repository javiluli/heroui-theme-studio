import { createContext, type ReactNode, useContext, useRef, useState } from 'react';
import { useDocumentTheme } from './useDocumentTheme';
import { useThemeEditor } from './useThemeEditor';
import type { EditableThemeVariable } from './token-descriptions';

type ThemeStudioState = ReturnType<typeof useThemeEditor> & {
  selectedVariable: EditableThemeVariable | null;
  openEditorToken: (variable: EditableThemeVariable) => void;
};

const ThemeStudioContext = createContext<ThemeStudioState | null>(null);

/** Single global theme source. Each component playground owns only local example state. */
export function ThemeStudioProvider({ children }: { children: ReactNode }) {
  const editor = useThemeEditor();
  useDocumentTheme(editor.theme, editor.mode);
  const [selectedVariable, setSelectedVariable] = useState<EditableThemeVariable | null>(null);
  const tokenPulse = useRef<Animation | null>(null);
  const openEditorToken = (variable: EditableThemeVariable) => {
    const target = document.getElementById('theme-token-' + variable.slice(2));
    if (!target) return;
    setSelectedVariable(variable);
    target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    const control = target.querySelector<HTMLInputElement>('input') ?? target.querySelector<HTMLButtonElement>('button');
    control?.focus({ preventScroll: true });
    tokenPulse.current?.cancel();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      tokenPulse.current = target.animate(
        [{ scale: '1', easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }, { scale: '1.08', offset: 0.35 }, { scale: '1' }],
        { duration: 360 },
      );
    }
  };

  return (
    <ThemeStudioContext.Provider value={{ ...editor, selectedVariable, openEditorToken }}>
      {children}
    </ThemeStudioContext.Provider>
  );
}

export function useThemeStudio(): ThemeStudioState {
  const value = useContext(ThemeStudioContext);
  if (!value) throw new Error('ThemeStudioProvider is missing');
  return value;
}
