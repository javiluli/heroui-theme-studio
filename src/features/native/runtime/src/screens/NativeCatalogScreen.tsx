import { Button, Chip, ListGroup, SearchField, Separator, Surface, Typography, useThemeColor } from "heroui-native";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { catalogGroups, exampleLabel, findCatalogGroups, type NativeExample } from "./catalog";
import { nativeExamples } from "./native-examples";
import { PreviewIcon } from "./PreviewIcon";

const categories = ["All", ...catalogGroups.map(({ name }) => name)];

export function NativeCatalogScreen() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<{ name: NativeExample; group: string }>();
  const groups = findCatalogGroups(search, category);
  const count = groups.reduce((total, group) => total + group.examples.length, 0);
  const foreground = useThemeColor("foreground");
  const Sample = selected && nativeExamples[selected.name];

  return (
    <>
      <ScrollView className={selected ? "hidden" : "min-h-0 flex-1"} aria-hidden={!!selected}
        contentContainerClassName="gap-5 px-4 pb-5 pt-3" showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" testID="native-catalog">
        <View className="gap-1">
          <Typography.Heading type="h1" className="text-2xl">Component library</Typography.Heading>
          <Typography color="muted">Try HeroUI Native components with your theme.</Typography>
        </View>
        <View className="gap-3">
          <SearchField value={search} onChange={setSearch}>
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Search components" accessibilityLabel="Search components" />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2" keyboardShouldPersistTaps="handled">
            {categories.map((name) => (
              <Button key={name} size="sm" variant={category === name ? "primary" : "secondary"}
                accessibilityState={{ selected: category === name }} onPress={() => setCategory(name)}>
                {name}
              </Button>
            ))}
          </ScrollView>
          <Typography type="body-sm" color="muted" accessibilityLiveRegion="polite">
            {count} {count === 1 ? "component" : "components"}
          </Typography>
        </View>
        {groups.map(({ name, examples }) => (
          <View key={name} className="gap-2">
            <Typography.Heading type="h2" className="text-lg">{name}</Typography.Heading>
            <ListGroup>
              {examples.map((example, index) => (
                <View key={example}>
                  {index > 0 && <Separator />}
                  <ListGroup.Item accessibilityRole="button" accessibilityLabel={exampleLabel(example)}
                    testID={`native-entry-${example}`} onPress={() => setSelected({ name: example, group: name })}>
                    <ListGroup.ItemContent><ListGroup.ItemTitle>{exampleLabel(example)}</ListGroup.ItemTitle></ListGroup.ItemContent>
                    <ListGroup.ItemSuffix />
                  </ListGroup.Item>
                </View>
              ))}
            </ListGroup>
          </View>
        ))}
        {!count && (
          <Surface className="gap-3 p-4">
            <Typography>No matching components.</Typography>
            <Button size="sm" variant="secondary" onPress={() => { setSearch(""); setCategory("All"); }}>Clear filters</Button>
          </Surface>
        )}
      </ScrollView>
      {selected && Sample && (
        <ScrollView className="min-h-0 flex-1" contentContainerClassName="gap-4 px-4 pb-5 pt-3"
          keyboardShouldPersistTaps="handled" testID="native-catalog-detail">
          <View className="items-start">
            <Button size="sm" variant="ghost" onPress={() => setSelected(undefined)} accessibilityLabel="Back to catalog">
              <PreviewIcon name="back" color={foreground} size={16} />
              <Button.Label>Catalog</Button.Label>
            </Button>
          </View>
          <View className="items-start gap-2">
            <Chip size="sm" variant="soft">{selected.group}</Chip>
            <Typography.Heading type="h1" className="text-2xl">{exampleLabel(selected.name)}</Typography.Heading>
          </View>
          <Surface variant="secondary">
            <View className="min-h-28 justify-center p-4" testID={`native-sample-${selected.name}`}>
              <Sample />
            </View>
          </Surface>
        </ScrollView>
      )}
    </>
  );
}
