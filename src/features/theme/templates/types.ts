import type { ThemeOverrides } from "../model";

export interface ThemeTemplate {
  readonly name: string;
  readonly label: string;
  readonly value: {
    readonly light: ThemeOverrides;
    readonly dark: ThemeOverrides;
    readonly layout?: ThemeOverrides;
  };
}
