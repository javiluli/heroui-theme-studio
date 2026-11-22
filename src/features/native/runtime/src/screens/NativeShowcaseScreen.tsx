import { Tabs } from "heroui-native";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeAppScreen } from "./NativeAppScreen";
import { NativeCollageScreen } from "./NativeCollageScreen";

const destinations = [
  { id: "home", label: "Home" },
  { id: "app", label: "App" },
] as const;

export function NativeShowcaseScreen() {
  const [tab, setTab] = useState("home");
  const [visitedApp, setVisitedApp] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <Tabs className="min-h-0 flex-1" value={tab} onValueChange={(next) => {
        if (next === "app") setVisitedApp(true);
        setTab(next);
      }}>
        <Tabs.Content value="home" forceMount aria-hidden={tab !== "home"}
          className={tab === "home" ? "min-h-0 flex-1" : "hidden"}>
          <NativeCollageScreen />
        </Tabs.Content>
        {visitedApp && (
          <Tabs.Content value="app" forceMount aria-hidden={tab !== "app"}
            className={tab === "app" ? "min-h-0 flex-1" : "hidden"}>
            <NativeAppScreen />
          </Tabs.Content>
        )}
        <View className="border-t border-separator bg-surface px-2 py-2">
          <Tabs.List className="w-full" accessibilityLabel="Preview navigation">
            <Tabs.Indicator />
            {destinations.map(({ id, label }) => (
              <Tabs.Trigger key={id} value={id} className="min-h-10 min-w-0 flex-1 px-0">
                <Tabs.Label>{label}</Tabs.Label>
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </View>
      </Tabs>
    </SafeAreaView>
  );
}
