# HeroUI Theme Studio

Unofficial theme generator for HeroUI v3

## Use the editor

1. Pick a **Theme preset** or import an existing HeroUI CSS theme.
2. Edit colors, radii, border widths, and typography in the sidebar. Switch between light and dark mode from the editor toolbar.
3. Try **Components**, **Collage**, and **Web** for React, or switch to **Native** and choose a phone or custom viewport.
4. Select **Export CSS**. Add the export after `@heroui/styles` in a React project or after `heroui-native/styles` in an Expo project.

HeroUI Default uses the installed library theme. The editor saves and exports overrides per mode. Reset a control to restore its original value or relationship. Importing CSS replaces the current overrides. The optional AI assistant runs locally with WebGPU and downloads a model when you request a theme. The proposal is applied only when you select **Apply theme**.

## Run locally

Use Node.js 24.

```sh
npm ci
npm run dev
```

To verify and serve the production build locally:

```sh
npm run build
npm run preview
```

The build includes the Expo Web viewer and writes the complete site to `dist/`.

## Deploy on Vercel

Import the `heroui-theme-studio` GitHub repository as a Vite project. Use the repository root and its default branch. The checked-in configuration uses `npm ci`, `npm run build`, and `dist`.

The build uses Vercel's production domain for the canonical URL and sitemap. Set `SITE_URL` to the public HTTPS URL if you need to override it, then redeploy. Once the public site is live, verify the domain in Google Search Console and submit `/sitemap.xml`.

[HeroUI React theming](https://heroui.com/en/docs/react/getting-started/theming) · [HeroUI Native theming](https://heroui.com/en/docs/native/getting-started/theming)
