# HeroUI Theme Studio

Unofficial theme generator for HeroUI v3. Keep this name and descriptor in the header, metadata and README.

- Check the installed HeroUI React and Native CSS and the relevant local docs in .heroui-docs/react before changing tokens or components. Use the official docs if a local page is missing.
- Keep the editable list in src/features/theme/model.ts. Store only CSS overrides per mode. HeroUI Default is empty. A reset removes an override so the library owns defaults, references, derived colors and scales.
- Keep CSS import in import-css.ts. Read the supported theme blocks, validate the editable variables and retain CSS values as written. Apply approved declarations at the document root so portals inherit them. Export the same customizations in the selected platform's format.
- Use free HeroUI React v3 compound components and Tailwind v4 for app layout. Keep src/app/styles.css to the two library imports. Use the real HeroUI Native components in the Expo Web viewer and respect its own defaults. Keep example state local and the catalog's token links backed by the library styles.
- Keep the assistant mounted in its right-hand panel. Load WebLLM in its worker after an explicit request and apply only approved, validated proposals. Keep the compact schema, same-engine recovery and strongest-first fallback. Carry previous colors only into a refinement.
- Prefer existing components and browser or library behavior. Keep changes proportional to the feature, preserve keyboard access and responsive layout, and use a build or a brief visual check when verification is needed.
