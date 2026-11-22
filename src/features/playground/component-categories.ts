import type { ReactComponentSlug } from "./inspection/component-variable-map";

export const COMPONENT_CATEGORIES: readonly { title: string; slugs: readonly ReactComponentSlug[] }[] = [
  { title: "Buttons", slugs: ["button", "button-group", "close-button", "toggle-button", "toggle-button-group"] },
  {
    title: "Forms",
    slugs: [
      "checkbox", "checkbox-group", "description", "error-message", "field-error", "fieldset", "form", "input",
      "input-group", "input-otp", "label", "number-field", "radio-group", "search-field", "text-area", "text-field",
    ],
  },
  { title: "Date and Time", slugs: ["calendar", "date-field", "date-picker", "date-range-picker", "range-calendar", "time-field"] },
  { title: "Navigation", slugs: ["accordion", "breadcrumbs", "disclosure", "disclosure-group", "link", "pagination", "tabs"] },
  { title: "Overlays", slugs: ["alert-dialog", "drawer", "modal", "popover", "sheet", "toast", "tooltip"] },
  { title: "Collections", slugs: ["dropdown", "list-box", "tag-group"] },
  { title: "Controls", slugs: ["slider", "switch"] },
  { title: "Feedback", slugs: ["alert", "meter", "progress-bar", "progress-circle", "skeleton", "spinner"] },
  { title: "Layout", slugs: ["card", "separator", "surface", "toolbar"] },
  { title: "Media", slugs: ["avatar", "avatar-group"] },
  { title: "Pickers", slugs: ["autocomplete", "combo-box", "select"] },
  { title: "Typography", slugs: ["kbd", "typography"] },
  { title: "Data Display", slugs: ["badge", "chip", "table"] },
  { title: "Colors", slugs: ["color-area", "color-field", "color-picker", "color-slider", "color-swatch", "color-swatch-picker"] },
  { title: "Utilities", slugs: ["scroll-shadow"] },
];

export const COMPONENT_ORDER = COMPONENT_CATEGORIES.flatMap(({ slugs }) => slugs);

export function categoryId(title: string) {
  return "category-" + title.toLowerCase().replaceAll(" ", "-");
}
