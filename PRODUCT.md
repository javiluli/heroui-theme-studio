# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

React developers building HeroUI v3 themes who need more control over colors and adjustments than the official web generator provides.

## Product Purpose

HeroUI Theme Studio helps React developers create, customize, preview, import, and export themes for HeroUI React v3. It addresses gaps in the official web generator's available color and adjustment controls. Success means developers can create and refine a usable theme quickly, with confidence that it uses supported theme variables.

## Positioning

A HeroUI-focused theme editor that combines detailed theme controls, presets, and optional prompt-based AI with previews of individual components, component combinations, and a website view, then exports validated theme CSS. Theme AI should be as specialized to HeroUI theme work as practical, while remaining local, bounded, and subject to user review.

## Capabilities and Constraints

- Targets HeroUI React v3 and Tailwind CSS v4.
- Theme editing is limited to the 31 approved color tokens plus `--radius`, `--field-radius`, and `--font-sans`. Light and dark modes can retain separate layout settings.
- Themes can be edited through controls, loaded from presets, imported from supported HeroUI CSS, and exported as CSS. Import parses named light and dark blocks and accepts only the approved variables; arbitrary CSS is never executed or inserted.
- Theme values persist in local storage and apply globally across the component gallery and website preview.
- The component gallery represents the documented free HeroUI React component catalog. Do not present Pro components as part of the product.
- Theme AI is optional and runs locally in a separate WebGPU worker only after an explicit user action. It does not require an API key or silently call a paid remote model. Generated values are validated and require user approval before application.
- Theme AI is not fine-tuned. Its HeroUI theme focus comes from domain-restricted instructions, verified design references, palette derivation, and output validation; do not claim specialized model training.
- The shared theme is available in the Web catalogue, collage and application compositions, and in the HeroUI Native phone viewer. Copy and export use the format of the selected platform.
- Visual component styles come from HeroUI's supported APIs and theme variables. App layout uses Tailwind utilities; `src/app/styles.css` contains only the Tailwind and HeroUI imports.

## Brand Commitments

The product is named HeroUI Theme Studio. It is an independent theme-authoring tool for HeroUI React v3; do not imply that it is HeroUI Pro or an official commercial HeroUI product.

The user wants theme creation and editing to feel modern, clean, simple, and intuitive, with fast color changes and previews.

## Evidence on Hand

- The repository contains the working React application, component examples, theme editor, import/export flows, and tests.
- The component gallery is maintained against the 73-component free React catalog documented on 2026-11-16.
- Theme presets are implemented in `src/features/theme/templates/`.
- No testimonials, customer results, pricing claims, or third-party endorsements are established in the repository; do not invent them.

## Product Principles

- Make theme creation and export the primary job.
- Keep previews tied to real HeroUI v3 components and supported theme variables.
- Preserve user theme data through editing, import, export, and default updates.
- Keep local AI optional, transparent, and subject to user review.
- Represent only verified free HeroUI components and capabilities.

## Accessibility & Inclusion

Preserve keyboard access, visible focus, responsive layouts, and reduced-motion support.
