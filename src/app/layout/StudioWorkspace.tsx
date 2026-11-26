import { Tabs } from "@heroui/react";
import { useLayoutEffect, useRef, useState, type ComponentProps, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Container, Grid } from "../../components/layout";
import type { ThemePlatform } from "../../features/theme/export-css";
import { StudioHeader } from "./StudioHeader";
import { StudioViews, StudioViewTabs, type StudioPage } from "./StudioViews";

const columns = "grid-cols-1 @[52rem]/studio:grid-cols-(--studio-split-columns)";
const webColumns = "@[84rem]/studio:grid-cols-(--studio-web-columns)";
const previewLayout = "@[52rem]/studio:h-full @[52rem]/studio:grid-rows-[minmax(0,1fr)]";

const studioSize = {
  "--studio-editor-width": "21rem",
  "--studio-index-width": "13rem",
  "--studio-column-gap": "1.25rem",
  "--studio-inset": "1rem",
  "--studio-mobile-editor-height": "17rem",
  "--studio-example-gap": "1.5rem",
  "--studio-stage-height": "12rem",
  "--studio-header-height": "3.5625rem",
  "--studio-split-columns": "minmax(0, min(var(--studio-editor-width), 38%)) minmax(0, 1fr)",
  "--studio-web-columns": "var(--studio-editor-width) minmax(0, 1fr) var(--studio-index-width)",
  // Keep the midpoint of the preview column as room opens for a single header row.
  "--studio-header-columns": "calc(var(--studio-editor-width) + var(--studio-column-gap) + var(--studio-index-width)) minmax(0, 1fr) var(--studio-index-width)",
} as CSSProperties;

interface StudioWorkspaceProps {
  page: StudioPage;
  onNavigate: (page: StudioPage) => void;
  onPlatformChange: (platform: ThemePlatform) => void;
  headerActions: Omit<ComponentProps<typeof StudioHeader>, "navigation">;
  editor: ReactNode;
  index: ReactNode;
  children: ReactNode;
}

export function StudioWorkspace({ page, onNavigate, onPlatformChange, headerActions, editor, index, children }: StudioWorkspaceProps) {
  const workspace = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  const preview = useRef<HTMLElement>(null);
  const [viewTabsHost, setViewTabsHost] = useState<HTMLDivElement | null>(null);
  const native = page === "native";
  const catalog = page === "components";
  let mainLayout = "min-h-0 @[52rem]/studio:overflow-y-auto @[52rem]/studio:overscroll-contain";
  if (native) mainLayout = "h-144 min-h-0 px-2 @[52rem]/studio:h-full";
  if (catalog) mainLayout = "scroll-mt-(--studio-header-height) pb-16";

  useLayoutEffect(() => {
    const shell = workspace.current;
    const bar = header.current;
    if (!shell || !bar) return;
    const measure = () => {
      const height = bar.getBoundingClientRect().height;
      if (height > 0) shell.style.setProperty("--studio-header-height", `${height}px`);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(bar);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (preview.current) preview.current.scrollTop = 0;
  }, [page]);

  return (
    <Tabs
      ref={workspace}
      style={studioSize}
      className={catalog ? "gap-0" : "gap-0 @[52rem]/studio:h-dvh"}
      selectedKey={headerActions.platform}
      onSelectionChange={(platform) => {
        if (platform === "web" || platform === "native") onPlatformChange(platform);
      }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-(--radius) focus:bg-surface focus:p-3 focus:text-surface-foreground focus:outline-2 focus:outline-focus"
      >
        Skip to preview
      </a>
      <header ref={header} className="sticky top-0 z-30 shrink-0 border-b border-separator bg-background">
        <Container>
          <StudioHeader
            {...headerActions}
            navigation={native ? undefined : <div ref={setViewTabsHost} />}
          />
        </Container>
      </header>
      <Container className="min-h-0 flex-1">
        <Grid className={`${columns} ${native ? "" : webColumns} ${catalog ? "items-start" : previewLayout} gap-x-(--studio-column-gap) gap-y-5 py-(--studio-inset)`}>
          {editor}
          <main
            ref={preview}
            id="main-content"
            tabIndex={-1}
            className={`mx-auto w-full min-w-0 max-w-334 focus-visible:outline-2 focus-visible:outline-focus ${mainLayout}`}
          >
            <Tabs.Panel
              key={headerActions.platform}
              id={headerActions.platform}
              className={native ? "m-0 h-full min-h-0 p-0" : "m-0 p-0"}
            >
              {native ? children : viewTabsHost && (
                <StudioViews page={page} onNavigate={onNavigate}>
                  {createPortal(<StudioViewTabs />, viewTabsHost)}
                  <Tabs.Panel key={page} id={page} className="m-0 p-0">{children}</Tabs.Panel>
                </StudioViews>
              )}
            </Tabs.Panel>
          </main>
          {index}
        </Grid>
      </Container>
    </Tabs>
  );
}
