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
import { Analytics } from "@vercel/analytics/react";
import { Flex } from "../components/layout";
import { EditorPanel } from "../features/theme/components/EditorPanel";
import { ExportPanel } from "../features/theme/components/ExportPanel";
import { ImportCssPanel } from "../features/theme/components/ImportCssPanel";
import { exportThemeCss } from "../features/theme/export-css";
import {
  ThemeStudioProvider,
  useThemeStudio,
} from "../features/theme/ThemeStudioContext";
import type { StudioPage } from "./layout/StudioViews";
import { StudioWorkspace } from "./layout/StudioWorkspace";
import { ViewLoadBoundary } from "./layout/ViewLoadBoundary";

const ComponentGallery = lazy(
  () => import("../features/playground/ComponentGallery"),
);
const ComponentIndex = lazy(() =>
  import("../features/playground/components/ComponentIndex").then(
    ({ ComponentIndex }) => ({ default: ComponentIndex }),
  ),
);
const RealWebsite = lazy(() => import("../features/website/RealWebsite"));
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
  const [catalog, setCatalog] = useState<HTMLDivElement | null>(null);
  const catalogAnchor = useRef<HTMLElement | null>(null);
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
  const css = useMemo(
    () => exportThemeCss(editor.theme, platform),
    [editor.theme, platform],
  );
  const closeExport = useCallback(() => setExportOpen(false), []);
  const closeAI = useCallback(() => {
    setAssistant("closed");
    requestAnimationFrame(() =>
      aiTrigger.current?.focus({ preventScroll: true }),
    );
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
      className="min-h-dvh w-full bg-background text-foreground [--studio-assistant-width:clamp(20rem,28vw,24.875rem)]"
    >
      <div
        className={
          aiOpen
            ? "@container/studio min-w-0 flex-1 max-lg:hidden"
            : "@container/studio min-w-0 flex-1"
        }
      >
        <StudioWorkspace
          page={page}
          onNavigate={navigate}
          onPlatformChange={(platform) => navigate(platform === "native" ? "native" : lastWebPage.current)}
          headerActions={{
            platform,
            aiOpen,
            aiTrigger,
            onToggleAI: () => setAssistant(aiOpen ? "closed" : "open"),
            onExport: () => setExportOpen(true),
          }}
          editor={
            <EditorPanel
              platform={platform}
              theme={editor.theme}
              mode={editor.mode}
              onModeChange={editor.setMode}
              highlightedVariable={editor.selectedVariable}
              selectedPreset={editor.selectedPreset}
              onPreset={editor.applyPreset}
              onToken={editor.setToken}
              onReset={() => editor.applyPreset("default")}
              onImportCss={() => setImportOpen(true)}
            />
          }
          index={page === "components" && catalog && (
            <Suspense fallback={null}>
              <ComponentIndex gallery={catalog} anchorTarget={catalogAnchor} />
            </Suspense>
          )}
        >
          <ViewLoadBoundary
            key={page}
            fallback={
              <div className="space-y-2 text-sm">
                <p role="alert">The preview could not be loaded.</p>
                <ReloadPage />
              </div>
            }
          >
            <Suspense fallback={<p role="status" className="text-sm text-muted">Loading preview…</p>}>
              {(page === "components" || page === "collage") && (
                <ComponentGallery
                  layout={page === "collage" ? "collage" : "list"}
                  onGalleryReady={setCatalog}
                  anchorTarget={catalogAnchor}
                />
              )}
              {page === "website" && <RealWebsite />}
              {page === "native" && <NativePreviewPage theme={editor.theme} mode={editor.mode} />}
            </Suspense>
          </ViewLoadBoundary>
        </StudioWorkspace>
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
      <ExportPanel css={css} platform={platform} isOpen={exportOpen} onClose={closeExport} />
      {importOpen && (
        <ImportCssPanel
          platform={platform}
          onApply={editor.importTheme}
          onClose={() => setImportOpen(false)}
        />
      )}
      <Analytics />
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
      className="sticky top-0 h-dvh w-full shrink-0 space-y-3 border-l border-separator bg-surface p-4 text-sm text-surface-foreground lg:w-(--studio-assistant-width)"
    >
      <Button size="lg" variant="ghost" autoFocus onPress={onClose}>
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
