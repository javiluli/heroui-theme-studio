// Models from Counterpoint's 2024, 2025 and Q2 2026 global sell-through charts.
// Logical portrait sizes in CSS pixels. Android display-size settings can change them.
export const DEVICE_PRESETS = [
  { id: "iphone-16", label: "iPhone 16", width: 393, height: 852 },
  { id: "iphone-15", label: "iPhone 15", width: 393, height: 852 },
  { id: "iphone-15-pro", label: "iPhone 15 Pro", width: 393, height: 852 },
  { id: "iphone-15-pro-max", label: "iPhone 15 Pro Max", width: 430, height: 932 },
  { id: "galaxy-s24-ultra", label: "Galaxy S24 Ultra", width: 384, height: 832 },
  { id: "iphone-16-pro-max", label: "iPhone 16 Pro Max", width: 440, height: 956 },
  { id: "galaxy-a16-5g", label: "Galaxy A16 5G", width: 360, height: 780 },
  { id: "iphone-17", label: "iPhone 17", width: 402, height: 874 },
  { id: "iphone-17-pro-max", label: "iPhone 17 Pro Max", width: 440, height: 956 },
  { id: "galaxy-s26-ultra", label: "Galaxy S26 Ultra", width: 412, height: 891 },
] as const;
