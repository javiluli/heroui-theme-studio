import { type ThemeToken } from "./model";

export function isHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
}

export function isThemeValue(token: ThemeToken, value: unknown): value is string {
  if (typeof value !== "string" || !value.trim() || value.length > 300 ||
    /[;{}!@<>\\]|\/\*|\b(?:url|src|attr)\s*\(/i.test(value)) return false;
  if (token === "font-sans") return CSS.supports("font-family", value);
  if (token === "radius" || token === "field-radius" || token === "border-width" || token === "field-border-width") {
    return /^(?:0|(?:\d+|\d*\.\d+)(?:px|r?em)|(?:var|calc|min|max|clamp)\([\s\S]+\))$/i.test(value) &&
      CSS.supports("border-radius", value);
  }
  return CSS.supports("color", value);
}

/** The browser resolves HeroUI aliases and converts the result for React Aria's picker. */
export function readColorHex(color: string): string {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const pixel = canvas.getContext("2d");
  if (!pixel) return "#000000";
  // Canvas preserves RGB at zero alpha when converting an opaque relative color first.
  pixel.fillStyle = `rgb(from ${color} r g b / 1)`;
  pixel.fillRect(0, 0, 1, 1);
  const rgb = Array.from(pixel.getImageData(0, 0, 1, 1).data).slice(0, 3);
  pixel.clearRect(0, 0, 1, 1);
  pixel.fillStyle = color;
  pixel.fillRect(0, 0, 1, 1);
  const alpha = pixel.getImageData(0, 0, 1, 1).data[3];
  if (alpha < 255) rgb.push(alpha);
  return "#" + rgb.map((channel) => channel.toString(16).padStart(2, "0")).join("").toUpperCase();
}
