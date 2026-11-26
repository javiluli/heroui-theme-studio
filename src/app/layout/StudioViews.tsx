import { Tabs } from "@heroui/react";
import type { ReactNode } from "react";

const webViews = [
  { id: "components", label: "Components" },
  { id: "collage", label: "Collage" },
  { id: "website", label: "Web" },
] as const;
export type StudioPage = (typeof webViews)[number]["id"] | "native";

export function StudioViews({ page, onNavigate, children }: {
  page: Exclude<StudioPage, "native">;
  onNavigate: (page: StudioPage) => void;
  children: ReactNode;
}) {
  return (
    <Tabs selectedKey={page} onSelectionChange={(key) => {
      const view = webViews.find(({ id }) => id === key);
      if (view) onNavigate(view.id);
    }}>
      {children}
    </Tabs>
  );
}

export function StudioViewTabs() {
  return (
    <Tabs.ListContainer>
      <Tabs.List aria-label="Preview views">
        {webViews.map(({ id, label }) => (
          <Tabs.Tab key={id} id={id}>{label}<Tabs.Indicator /></Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs.ListContainer>
  );
}
