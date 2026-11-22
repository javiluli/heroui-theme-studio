# HeroUI Native preview

The `?view=native` preview runs `heroui-native` with Expo Web and React Native Web in a same-origin iframe. **Home** adapts the web Collage examples to the phone. **App** shows Dayplan, a sample task app with a form, cards, and working navigation. The App menu opens the searchable **Component library** for individual examples.

Run `npm install` and `npm run dev` from the repository root. The dev and production builds export the preview to `public/native-runtime/`. If you edit the preview while Vite is running, run `npm run native:build` and click **Reload preview**.

The preview receives the active mode and theme variables from Theme Studio. Uniwind applies the tokens to the sample app and its overlays. Other properties use the library defaults.

React Native Web lets you inspect theme colors and try interactions in the browser. Verify platform-specific gestures, keyboards, and device APIs on iOS and Android.

- [HeroUI Native setup](https://heroui.com/en/docs/native/getting-started/quick-start)
- [HeroUI Native theming](https://heroui.com/en/docs/native/getting-started/theming)
- [Expo web export](https://docs.expo.dev/guides/publishing-websites/)
