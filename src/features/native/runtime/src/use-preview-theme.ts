import { useEffect, useState } from "react";
import { Uniwind } from "uniwind";
import { PREVIEW_PING, PREVIEW_READY, PREVIEW_RENDERED, PREVIEW_THEME, type PreviewThemeMessage } from "./theme-protocol";

// Native animation helpers accept sRGB strings for these computed CSS colors.
const animationColors = ["--color-background", "--color-default", "--color-default-hover", "--color-danger-soft"];

function updateAnimationColors(root: HTMLElement, pixel: CanvasRenderingContext2D) {
  for (const name of animationColors) root.style.removeProperty(name);
  const computed = getComputedStyle(root);
  const colors = animationColors.map((name) => computed.getPropertyValue(name).trim());
  for (const [index, color] of colors.entries()) {
    if (!CSS.supports("color", color)) continue;
    pixel.clearRect(0, 0, 1, 1);
    pixel.fillStyle = color;
    pixel.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = pixel.getImageData(0, 0, 1, 1).data;
    root.style.setProperty(animationColors[index], `rgba(${r}, ${g}, ${b}, ${a / 255})`);
  }
}

export function usePreviewTheme() {
  const embedded = typeof window !== "undefined" && window.parent !== window;
  const [themeReady, setThemeReady] = useState(!embedded);

  useEffect(() => {
    if (!embedded) return;
    const origin = window.location.origin;
    const ready = () => window.parent.postMessage(PREVIEW_READY, origin);
    const applied: Partial<Record<PreviewThemeMessage["mode"], Record<string, string>>> = {};
    let activeMode: PreviewThemeMessage["mode"] | undefined;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const pixel = canvas.getContext("2d", { willReadFrequently: true });
    const root = document.documentElement;
    const receiveTheme = (event: MessageEvent) => {
      if (event.origin !== origin || event.source !== window.parent) return;
      if (event.data === PREVIEW_PING) {
        ready();
        return;
      }
      const data = event.data as Partial<PreviewThemeMessage> | null;
      if (data?.type !== PREVIEW_THEME || (data.mode !== "light" && data.mode !== "dark") ||
          !data.variables || typeof data.variables !== "object") return;

      const { mode, variables } = data;
      const previous = applied[mode] ?? {};
      const changed = Object.fromEntries(Object.entries(variables)
        .filter(([name, value]) => /^--[a-z-]+$/.test(name) && typeof value === "string" && previous[name] !== value));
      const hasChanges = Object.keys(changed).length > 0;
      const modeChanged = activeMode !== mode;
      if (hasChanges) Uniwind.updateCSSVariables(mode, changed);
      applied[mode] = variables;
      if (modeChanged) {
        Uniwind.setTheme(mode);
        activeMode = mode;
      }
      if (pixel && (modeChanged || hasChanges)) updateAnimationColors(root, pixel);
      root.style.colorScheme = mode;
      setThemeReady(true);
    };
    window.addEventListener("message", receiveTheme);
    ready();
    return () => window.removeEventListener("message", receiveTheme);
  }, [embedded]);

  useEffect(() => {
    if (embedded && themeReady) window.parent.postMessage(PREVIEW_RENDERED, window.location.origin);
  }, [embedded, themeReady]);

  return themeReady;
}
