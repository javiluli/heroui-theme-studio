export const PREVIEW_READY = "theme-studio:native-ready";
export const PREVIEW_RENDERED = "theme-studio:native-rendered";
export const PREVIEW_PING = "theme-studio:native-ping";
export const PREVIEW_THEME = "theme-studio:native-theme";

export interface PreviewThemeMessage {
  type: typeof PREVIEW_THEME;
  mode: "light" | "dark";
  variables: Record<string, string>;
}
