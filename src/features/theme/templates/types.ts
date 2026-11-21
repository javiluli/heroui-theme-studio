import type { Palette, ThemeConfig } from '../model';

/** Same model as xylish7/nextui-theme-generator: {name, label, value}. */
export interface ThemeTemplate {
  readonly name: string;
  readonly label: string;
  readonly description: string;
  readonly value: {
    readonly light: Partial<Palette>;
    readonly dark: Partial<Palette>;
    readonly layout?: Partial<Pick<ThemeConfig, 'radius' | 'fieldRadius' | 'fontFamily'>>;
  };
}
