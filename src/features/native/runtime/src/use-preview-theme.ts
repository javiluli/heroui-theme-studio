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
  const isWeb = typeof window !== "undefined" && typeof document !== "undefined";
  const embedded = isWeb && window.parent !== window;
  const [themeReady, setThemeReady] = useState(!isWeb);

  useEffect(() => {
    if (!isWeb) return;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const pixel = canvas.getContext("2d", { willReadFrequently: true });
    const root = document.documentElement;
    if (!embedded) {
      if (pixel) updateAnimationColors(root, pixel);
      setThemeReady(true);
      return;
    }

    const origin = window.location.origin;
    const ready = () => window.parent.postMessage(PREVIEW_READY, origin);
    let applied: string[] = [];
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
      for (const name of applied) root.style.removeProperty(name);
      applied = [];
      for (const [name, value] of Object.entries(variables)) {
        if (!/^--[a-z-]+$/.test(name) || typeof value !== "string") continue;
        root.style.setProperty(name, value);
        applied.push(name);
      }
      Uniwind.setTheme(mode);
      root.style.colorScheme = mode;
      if (pixel) updateAnimationColors(root, pixel);
      // Notify Native hooks that read computed CSS variables on Expo Web.
      Uniwind.updateCSSVariables(mode, {});
      setThemeReady(true);
    };
    window.addEventListener("message", receiveTheme);
    ready();
    return () => window.removeEventListener("message", receiveTheme);
  }, [embedded, isWeb]);

  useEffect(() => {
    if (embedded && themeReady) window.parent.postMessage(PREVIEW_RENDERED, window.location.origin);
  }, [embedded, themeReady]);

  return themeReady;
}
