# Visor de HeroUI Native

La vista `?view=native` muestra el catálogo gratuito de HeroUI Native en un marco de teléfono. El visor ejecuta `heroui-native` con Expo Web y React Native Web en un iframe del mismo origen.

Desde la raíz del repositorio, ejecuta `npm install` y `npm run dev`. La instalación prepara las dependencias del visor y el arranque exporta sus archivos a `public/native-runtime/`. Se sirve todo desde la misma URL de Vite. `npm run build` incluye estos archivos en la salida de producción. Si editas el código del visor con Vite en marcha, vuelve a generarlo con `npm run native:build` y pulsa **Recargar visor**.

El visor recibe el modo y las variables del tema editado en Theme Studio. Uniwind aplica los tokens correspondientes a la muestra y a sus capas flotantes. La biblioteca conserva sus valores para las propiedades que el editor no ofrece.

HeroUI recomienda HeroUI Native para iOS y Android. React Native Web permite revisar el tema y probar interacciones en el navegador. Los gestos, el teclado y las APIs de dispositivo se validan por separado en su plataforma.

- [Instalación oficial de HeroUI Native](https://heroui.com/en/docs/native/getting-started/quick-start)
- [Temas de HeroUI Native](https://heroui.com/en/docs/native/getting-started/theming)
- [Exportación para web de Expo](https://docs.expo.dev/guides/publishing-websites/)
