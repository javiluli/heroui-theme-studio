import { Button } from "@heroui/react";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Container, Flex, Grid } from "../components/layout";
import { EditorPanel } from "../features/theme/components/EditorPanel";
import { ExportPanel } from "../features/theme/components/ExportPanel";
import { ImportCssPanel } from "../features/theme/components/ImportCssPanel";
import { exportThemeCss } from "../features/theme/export-css";
import {
  ThemeStudioProvider,
  useThemeStudio,
} from "../features/theme/ThemeStudioContext";
import { StudioHeader } from "./layout/StudioHeader";
import { StudioViews, type StudioPage } from "./layout/StudioViews";
import { ViewLoadBoundary } from "./layout/ViewLoadBoundary";

const ComponentGallery = lazy(
  () => import("../features/playground/ComponentGallery"),
);
const RealWebsite = lazy(
  () => import("../features/website/RealWebsite"),
);
const NativePreviewPage = lazy(
  () => import("../features/native/NativePreviewPage"),
);
const AIGeneratorPanel = lazy(() => import("../features/ai/AIGeneratorPanel"));

function currentPage(): StudioPage {
  const view = new URLSearchParams(window.location.search).get("view");
  return view === "website" || view === "native" || view === "collage"
    ? view
    : "components";
}

function StudioApp() {
  const editor = useThemeStudio();
  const [page, setPage] = useState<StudioPage>(currentPage);
  const platform = page === "native" ? "native" : "web";
  const lastWebPage = useRef<Exclude<StudioPage, "native">>(
    page === "native" ? "components" : page,
  );
  const [exportOpen, setExportOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [assistant, setAssistant] = useState<"unopened" | "open" | "closed">(
    "unopened",
  );
  const aiOpen = assistant === "open";
  const aiTrigger = useRef<HTMLButtonElement>(null);
  const studioHeader = useRef<HTMLElement>(null);
  const css = useMemo(
    () => (exportOpen ? exportThemeCss(editor.previewTheme, platform) : ""),
    [editor.previewTheme, exportOpen, platform],
  );
  const closeExport = useCallback(() => setExportOpen(false), []);
  const closeAI = useCallback(() => {
    setAssistant("closed");
    requestAnimationFrame(() =>
      aiTrigger.current?.focus({ preventScroll: true }),
    );
  }, []);

  useEffect(() => {
    const header = studioHeader.current;
    const studio = header?.parentElement;
    if (!header || !studio || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      studio.style.setProperty("--studio-header-height", `${header.offsetHeight}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onBack = () => {
      const next = currentPage();
      if (next !== "native") lastWebPage.current = next;
      setPage(next);
    };
    window.addEventListener("popstate", onBack);
    return () => window.removeEventListener("popstate", onBack);
  }, []);

  const navigate = (next: StudioPage) => {
    if (next === page) return;
    const url = new URL(window.location.href);
    url.searchParams.set("view", next);
    url.hash = "";
    window.history.pushState({}, "", url);
    if (next !== "native") lastWebPage.current = next;
    setPage(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <Flex
      data-theme-world="specimen"
      className={`${page === "native" ? "min-h-dvh" : "min-h-screen"} w-full bg-background text-foreground`}
    >
      <div
        className={
          aiOpen
            ? "@container/studio min-w-0 flex-1 max-lg:hidden"
            : "@container/studio min-w-0 flex-1"
        }
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-(--radius) focus:bg-surface focus:p-3 focus:text-surface-foreground focus:outline-2 focus:outline-focus"
        >
          Skip to preview
        </a>
        <header className="sticky top-0 z-30 border-b border-separator bg-background" ref={studioHeader}>
          <Container>
            <StudioHeader
              platform={platform}
              mode={editor.mode}
              aiOpen={aiOpen}
              aiTrigger={aiTrigger}
              onModeChange={editor.setMode}
              onToggleAI={() => setAssistant(aiOpen ? "closed" : "open")}
              onExport={() => setExportOpen(true)}
            />
          </Container>
        </header>
        <Container>
          <Grid className={
            "grid-cols-1 gap-5 py-4 @[56rem]/studio:grid-cols-[24rem_minmax(0,1fr)] " +
            (page === "native"
              ? "h-[calc(100dvh-var(--studio-header-height,3.5625rem))] grid-rows-[minmax(0,1fr)_minmax(0,3fr)] @[56rem]/studio:grid-rows-[minmax(0,1fr)]"
              : "items-start")
          }>
            <EditorPanel
              platform={platform}
              onPlatformChange={(next) =>
                navigate(next === "native" ? "native" : lastWebPage.current)
              }
              theme={editor.previewTheme}
              mode={editor.mode}
              useNativeLinks={editor.useNativeLinks}
              onToggleNativeLinks={editor.toggleNativeLinks}
              highlightedVariable={editor.highlightedVariable}
              selectedPreset={editor.selectedPreset}
              onPreset={editor.applyPreset}
              onColor={editor.setColor}
              onPreviewColor={editor.previewColor}
              onClearColorPreview={editor.clearColorPreview}
              onRadius={editor.setRadius}
              onFieldRadius={editor.setFieldRadius}
              onFontFamily={editor.setFontFamily}
              onReset={editor.reset}
              onImportCss={() => setImportOpen(true)}
            />

            <main
              id="main-content"
              tabIndex={-1}
              className={`mx-auto w-full min-w-0 focus-visible:outline-2 focus-visible:outline-focus ${page === "native" ? "min-h-0 max-w-334" : `scroll-mt-24 pb-16 ${page === "components" ? "max-w-334" : "max-w-6xl"}`}`}
            >
              <StudioViews page={page} onNavigate={navigate}>
                <ViewLoadBoundary
                  key={page === "collage" ? "components" : page}
                  fallback={
                    <div className="space-y-2 text-sm">
                      <p role="alert">The preview could not be loaded.</p>
                      <ReloadPage />
                    </div>
                  }
                >
                  <Suspense
                    fallback={
                      <p role="status" className="text-sm text-muted">
                        Loading preview…
                      </p>
                    }
                  >
                    {(page === "components" || page === "collage") && (
                      <ComponentGallery
                        layout={page === "collage" ? "collage" : "list"}
                      />
                    )}
                    {page === "website" && <RealWebsite />}
                    {page === "native" && (
                      <NativePreviewPage
                        theme={editor.previewTheme}
                        mode={editor.mode}
                      />
                    )}
                  </Suspense>
                </ViewLoadBoundary>
              </StudioViews>
            </main>
          </Grid>
        </Container>
      </div>
      {assistant !== "unopened" && (
        <ViewLoadBoundary
          fallback={aiOpen && <AssistantPlaceholder onClose={closeAI} failed />}
        >
          <Suspense
            fallback={aiOpen && <AssistantPlaceholder onClose={closeAI} />}
          >
            <AIGeneratorPanel
              open={aiOpen}
              theme={editor.theme}
              onApply={editor.importTheme}
              onClose={closeAI}
            />
          </Suspense>
        </ViewLoadBoundary>
      )}
      {exportOpen && (
        <ExportPanel css={css} platform={platform} onClose={closeExport} />
      )}
      {importOpen && (
        <ImportCssPanel
          theme={editor.theme}
          onApply={editor.importTheme}
          onClose={() => setImportOpen(false)}
        />
      )}
    </Flex>
  );
}

function AssistantPlaceholder({
  onClose,
  failed = false,
}: {
  onClose: () => void;
  failed?: boolean;
}) {
  return (
    <aside
      id="theme-ai-chat"
      aria-label="Theme assistant"
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
      className="sticky top-0 h-dvh w-full shrink-0 space-y-3 border-l border-separator bg-surface p-4 text-sm text-surface-foreground lg:w-99.5"
    >
      <Button size="sm" variant="ghost" autoFocus onPress={onClose}>
        Close assistant
      </Button>
      {failed ? (
        <div className="space-y-2">
          <p role="alert">The assistant could not be loaded.</p>
          <ReloadPage />
        </div>
      ) : (
        <p role="status">Loading assistant…</p>
      )}
    </aside>
  );
}

function ReloadPage() {
  return (
    <Button
      size="sm"
      variant="secondary"
      onPress={() => window.location.reload()}
    >
      Reload page
    </Button>
  );
}

export function App() {
  return (
    <ThemeStudioProvider>
      <StudioApp />
    </ThemeStudioProvider>
  );
}
