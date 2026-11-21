import { Tabs } from "@heroui/react";
import type { ReactNode } from "react";

const webViews = [
  { id: "components", label: "Components" },
  { id: "collage", label: "Collage" },
  { id: "website", label: "Web" },
] as const;

export type StudioPage = (typeof webViews)[number]["id"] | "native";

export function StudioViews({ page, onNavigate, children }: {
  page: StudioPage;
  onNavigate: (page: StudioPage) => void;
  children: ReactNode;
}) {
  if (page === "native") return children;

  return (
    <Tabs selectedKey={page} onSelectionChange={(key) => {
      const view = webViews.find(({ id }) => id === key);
      if (view) onNavigate(view.id);
    }}>
      <div className="sticky top-[var(--studio-header-height,3.5625rem)] z-20 mb-4 flex h-14 items-center justify-center bg-background">
        <div className="max-w-full">
          <Tabs.ListContainer>
            <Tabs.List aria-label="Preview views">
              {webViews.map(({ id, label }) => <Tabs.Tab key={id} id={id}>{label}<Tabs.Indicator /></Tabs.Tab>)}
            </Tabs.List>
          </Tabs.ListContainer>
        </div>
      </div>
      {webViews.map(({ id }) => <Tabs.Panel key={id} id={id}>{page === id ? children : null}</Tabs.Panel>)}
    </Tabs>
  );
}
