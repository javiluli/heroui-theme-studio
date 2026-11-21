import { SearchField, Typography } from "heroui-native";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { nativeExamples } from "./native-examples";

const names = (
  Object.keys(nativeExamples) as (keyof typeof nativeExamples)[]
).sort((a, b) => a.localeCompare(b, "en"));

export function NativeShowcaseScreen() {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const visible = query
    ? names.filter((name) => name.toLowerCase().includes(query))
    : names;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <View className="gap-3 border-b border-separator px-4 pb-3 pt-8">
        <Typography.Heading type="h1" className="font-sans text-xl">
          Native components
        </Typography.Heading>
        <SearchField value={search} onChange={setSearch}>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input
              placeholder="Search components"
              accessibilityLabel="Search components"
            />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
      </View>
      <FlatList
        className="flex-1"
        contentContainerClassName="px-4 pb-6"
        data={visible}
        keyExtractor={(name) => name}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={8}
        ListEmptyComponent={
          <Typography className="py-5" color="muted">
            No matching components.
          </Typography>
        }
        renderItem={({ item: name }) => {
          const Sample = nativeExamples[name];
          return (
            <View
              testID={`native-sample-${name}`}
              className="gap-3 border-b border-separator py-4"
            >
              <Typography.Heading type="h2" className="font-sans text-base">
                {name}
              </Typography.Heading>
              <Sample />
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
