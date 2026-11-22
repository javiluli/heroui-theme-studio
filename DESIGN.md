---
name: HeroUI Theme Studio
description: Unofficial theme generator for HeroUI v3
colors:
  primary: "oklch(0.6204 0.195 253.83)"
  on-primary: "var(--snow)"
  light-canvas: "oklch(0.9702 0 0)"
  dark-canvas: "oklch(12% 0.005 285.823)"
  light-surface: "var(--white)"
  dark-surface: "oklch(0.2103 0.0059 285.89)"
typography:
  body:
    fontFamily: '"Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "16px"
  title:
    fontFamily: '"Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "20px"
    fontWeight: 600
  label:
    fontFamily: '"Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "12px"
rounded:
  control: "8px"
  field: "12px"
  button: "24px"
  gallery: "8px"
  gallery-frame: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.button}"
    padding: "0 16px"
    size: "14px"
    height: "36px"
  input-field:
    backgroundColor: "var(--field-background)"
    textColor: "var(--field-foreground)"
    rounded: "{rounded.field}"
    padding: "8px 12px"
  gallery-card:
    backgroundColor: "var(--background)"
    textColor: "var(--foreground)"
    rounded: "{rounded.gallery}"
    padding: "40px 16px 12px"
  selected-navigation:
    backgroundColor: "var(--surface)"
    textColor: "var(--foreground)"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  theme-token-tile:
    backgroundColor: "var(--default)"
    textColor: "var(--default-foreground)"
    rounded: "{rounded.field}"
    size: "{typography.label.fontSize}"
---

# Design System: HeroUI Theme Studio

## Overview

HeroUI Theme Studio is an unofficial theme generator for HeroUI v3. Theme controls sit beside live examples so developers can change a token and see its effect on React and Native components.

The visual system follows HeroUI's semantic variables and native component behavior. Color provides the main signal for the active theme and meaningful states; quiet neutral surfaces keep the dense catalog readable. Avoid decoration that does not help users edit, compare, or understand a theme.

**Key Characteristics:**
- Clear, tool-like hierarchy with compact controls and generous separation between component examples.
- The current HeroUI default palette uses a light cobalt-blue accent over neutral ink surfaces; theme edits can replace that palette globally.
- Native HeroUI components communicate their own focus, selected, disabled, loading, and validation states.
- Light mode uses soft native elevation; dark mode relies on tonal surfaces without visible shadows.

**The Live Sample Rule.** A theme change should be judged in real HeroUI components, not only in an isolated color swatch.

## Colors

The default palette pairs a clear cobalt-blue action color with near-neutral light and dark canvases. All colors are semantic CSS variables applied at the document root, and user themes can replace their values.

### Primary
- **Accent**: the primary color for prominent actions and selected controls. Linked tokens can reuse it for focus and other states.
- **Accent foreground**: text and icons on the accent color.

### Neutral
- The light canvas is near-white. The dark canvas has a subtle cool-violet cast.
- Semantic surface and overlay colors distinguish content from the canvas in both modes.
- Secondary and tertiary surfaces distinguish nested regions. Muted text, borders, and separators provide quieter hierarchy.

### Named Rules
**The Semantic Color Rule.** Use the approved HeroUI theme variables for color roles; do not create component-specific color systems.

## Typography

**Display Font:** Inter where loaded, with a system sans-serif fallback  
**Body Font:** Inter where loaded, with a system sans-serif fallback  
**Labels and code:** The active sans-serif stack for controls and color tile labels. Use monospace for code in token guides and radius labels.

**Character:** Compact and legible, with weight and spacing establishing hierarchy instead of decorative type. The selected theme can change the global sans-serif stack; the default prefers Inter when available.

### Hierarchy
- **Title** (600, 20px): component example headings and high-level chat headings.
- **Body** (400, 16px default; 14px in compact controls): general content and component text.
- **Label** (400–600, 12px): field labels, group descriptions, and supporting information.
- **Color token label** (500, 12px): CSS variable names on color tiles.

## Layout

The workspace uses shared gutters of 16px on small screens and 20px at desktop sizes. At a workspace width of 56rem, the editor sits beside the preview and stays sticky as the Web gallery scrolls. From 84rem, the catalog uses three columns with equal widths for the editor and the index and a centered preview capped at 56rem. At narrower widths, the component picker provides direct navigation inside the preview.

The main header holds the documentation link, theme mode, AI, and export controls. Reset, copy, and import actions live in the editor. The centered Web tabs stay below the header while scrolling. The AI chat narrows the studio from the right on wide screens and uses the available width on small screens. The website demo adapts to its container width.

Native fills the available viewport. The device selector sets the preview’s logical dimensions, and the phone frame scales to fit. The catalog scrolls inside that frame.

## Elevation & Depth

The system is hybrid. In light mode, HeroUI's native surface, overlay, and field shadows add a soft lift. Dark mode removes surface elevation and uses tonal differences between the canvas, surface, and nested surfaces. Thin semantic borders and spacing separate the editor and gallery groups; do not add extra shadows to HeroUI components.

### Shadow Vocabulary
- **Surface:** `0 2px 4px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.06), 0 0 1px 0 rgba(0, 0, 0, 0.06)` for raised content in light mode.
- **Overlay:** `0 2px 8px 0 rgba(0, 0, 0, 0.06), 0 -6px 12px 0 rgba(0, 0, 0, 0.03), 0 14px 28px 0 rgba(0, 0, 0, 0.08)` for floating layers in light mode.
- Dark mode sets native surface, overlay, and field shadows to transparent.

**The Tone Before Shadow Rule.** Establish hierarchy with semantic surface levels first; reserve elevation for HeroUI's native light-mode behavior.

## Shapes

The default theme radius is 8px and the default field radius is 12px. Gallery stages use the theme radius, and their outer frames add the 8px inset to keep the curves aligned. The numeric values in the token table describe the default theme. Imported CSS may set different radii by color mode.

## Components

### Buttons
- **Character:** Native and precise, with clear states.
- **Primary:** Solid accent with accent foreground. Medium buttons use 14px text and 16px horizontal padding. Their native height is 40px below the medium breakpoint and 36px from it.
- **Secondary / Tertiary / Outline / Ghost:** Use HeroUI's native semantic variants to express lower emphasis without custom component CSS.
- **Hover / Focus:** Keep the native transition, visible focus indication, and pressed/disabled states.

### Chips
- Use HeroUI's semantic color and variant props. Success, warning, and danger retain their status meaning and pair color with text or accessible labels.

### Cards / Containers
- Component examples use a semantic surface frame and an inset background stage. Small examples share a minimum height, and larger content can grow without a scroll area in the stage.
- Separate examples through spacing and surface contrast.

### Inputs / Fields
- Use HeroUI field components with the theme's field background, foreground, placeholder, border, and 12px field radius.
- Preserve native validation, disabled, and focus treatments.

### Navigation
- **Components**, **Collage**, and **Web** share the sticky preview tab bar. The editor’s **Web / Native** switch changes platform.

### Theme Token Tile
- Each tile pairs a HeroUI color swatch and picker with the visible CSS variable name. Tiles are arranged two per row. The example’s **Tokens** panel links to the matching editor tile.

## Do's and Don'ts

### Do:
- **Do** use the installed HeroUI v3 native component variants and semantic theme variables.
- **Do** keep theme changes visible across the editor, real component examples, and website preview.
- **Do** group palette controls by semantic purpose and display their CSS variable names.
- **Do** keep keyboard access and visible focus, and respect reduced-motion preferences.

### Don't:
- **Don't** add CSS rules that override HeroUI component internals; app-owned layout belongs on HTML wrappers.
- **Don't** add theme controls outside the 31 approved color tokens, `--radius`, `--field-radius`, and `--font-sans`.
- **Don't** use decorative color, borders, badges, or shadows that compete with the component previews.
- **Don't** imply that the free component catalog includes HeroUI Pro components.
