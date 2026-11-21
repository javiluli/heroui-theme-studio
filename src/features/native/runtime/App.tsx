import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NativeShowcaseScreen } from "./src/screens/NativeShowcaseScreen";
import { usePreviewTheme } from "./src/use-preview-theme";

export default function App() {
  const themeReady = usePreviewTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <HeroUINativeProvider>
          {themeReady && <NativeShowcaseScreen />}
        </HeroUINativeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
