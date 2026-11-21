import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { Button, Disclosure, Skeleton } from "@heroui/react";
import { Braces, SlidersHorizontal } from "lucide-react";
import { ComponentVariables } from "../inspection/ComponentVariables";
import {
  getComponentVariableGuide,
  type ReactComponentSlug,
} from "../inspection/component-variable-map";
import { REACT_COMPONENT_SOURCES } from "../inspection/react-component-sources";

interface PlaygroundScope {
  id: string;
  collage: boolean;
}
const PlaygroundContext = createContext<PlaygroundScope | null>(null);
const stageMinimum = "min-h-52";

export function usePlaygroundScope() {
  const scope = useContext(PlaygroundContext);
  if (!scope) throw new Error("Controls must be nested in ComponentPlayground");
  return scope;
}

function TokenDisclosure({
  renderContent,
}: {
  renderContent: () => ReactNode;
}) {
  const [state, setState] = useState<"idle" | "expanded" | "collapsed">("idle");
  const expanded = state === "expanded";

  return (
    <Disclosure
      isExpanded={expanded}
      onExpandedChange={(open) => setState(open ? "expanded" : "collapsed")}
    >
      <div className="flex justify-end px-1 py-0.5">
        <Button
          slot="trigger"
          size="sm"
          variant={expanded ? "secondary" : "ghost"}
        >
          <Braces size={16} aria-hidden="true" /> Tokens{" "}
          <Disclosure.Indicator aria-hidden="true" />
        </Button>
      </div>
      <Disclosure.Content inert={!expanded} data-playground-panel="tokens">
        {state !== "idle" && renderContent()}
      </Disclosure.Content>
    </Disclosure>
  );
}

/** Shared frame for each example and its optional token guide. */
export function ComponentPlayground({
  slug,
  children,
  collage = false,
  onInteract,
}: {
  slug: ReactComponentSlug;
  children: ReactNode;
  collage?: boolean;
  onInteract?: () => void;
}) {
  const id = "example-" + slug;
  const title = REACT_COMPONENT_SOURCES[slug].name;
  const lastStageHeight = useRef<number>(undefined);
  const measureStage = useCallback((stage: HTMLDivElement | null) => {
    if (!stage || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      lastStageHeight.current =
        entry.borderBoxSize[0]?.blockSize ?? stage.offsetHeight;
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return (
    <PlaygroundContext.Provider value={{ id, collage }}>
      <section
        id={id}
        data-example={slug}
        aria-labelledby={id + "-title"}
        tabIndex={collage ? undefined : -1}
        onFocusCapture={onInteract}
        onPointerDownCapture={
          onInteract &&
          ((event) => {
            if (event.pointerType === "mouse") onInteract();
          })
        }
        onClickCapture={onInteract}
        onChangeCapture={onInteract}
        onScrollCapture={onInteract}
        className={
          collage
            ? "min-w-0"
            : "min-w-0 scroll-mt-[calc(var(--studio-header-height,3.5625rem)+4.5rem)] space-y-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus"
        }
      >
        <h2
          id={id + "-title"}
          className={collage ? "sr-only" : "text-lg font-semibold"}
        >
          {title}
        </h2>
        {collage && <div className="@container min-w-0">{children}</div>}
        {!collage && !children && (
          // Match the closed frame, including the HeroUI button's extra height below md.
          <div
            className="rounded-[calc(var(--radius)+var(--spacing)*2)] bg-surface p-2 pb-12 md:pb-11 "
            aria-hidden="true"
          >
            <div
              className={`grid ${stageMinimum} place-items-center rounded-(--radius) bg-background`}
              style={
                lastStageHeight.current
                  ? { minHeight: lastStageHeight.current }
                  : undefined
              }
            >
              <Skeleton animationType="none">
                <span className="block h-8 w-20" />
              </Skeleton>
            </div>
          </div>
        )}
        {!collage && children && (
          <div className="@container/frame rounded-[calc(var(--radius)+var(--spacing)*2)] bg-surface p-2 text-surface-foreground">
            <div
              ref={measureStage}
              data-playground-stage
              className={
                `@container relative grid ${stageMinimum} min-w-0 grid-cols-[minmax(0,1fr)] place-items-center rounded-(--radius) bg-background pt-10 pb-3 text-foreground sm:px-4 ` +
                "@[36rem]/frame:grid-cols-[minmax(0,1fr)_0rem] @[36rem]/frame:has-[>[data-settings-open]]:grid-cols-[minmax(0,1fr)_13rem] " +
                "motion-safe:@[36rem]/frame:transition-[grid-template-columns] motion-safe:duration-300 motion-safe:ease-out-quint"
              }
            >
              {children}
            </div>
            <TokenDisclosure
              renderContent={() => (
                <ComponentVariables guide={getComponentVariableGuide(slug)} />
              )}
            />
          </div>
        )}
      </section>
    </PlaygroundContext.Provider>
  );
}
export function PlaygroundControls({ children }: { children: ReactNode }) {
  const { collage, id } = usePlaygroundScope();
  const [state, setState] = useState<"idle" | "open" | "closed">("idle");
  if (collage) return null;
  const open = state === "open";
  const panelId = id + "-settings";
  return (
    <>
      <div className="absolute inset-e-2 top-2 z-10" data-playground-settings>
        <Button
          size="sm"
          variant={open ? "secondary" : "ghost"}
          isIconOnly
          aria-label="Example settings"
          aria-expanded={open}
          aria-controls={panelId}
          onPress={() => setState(open ? "closed" : "open")}
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
        </Button>
      </div>
      <div
        id={panelId}
        data-playground-panel="settings"
        data-settings-open={open || undefined}
        inert={!open}
        aria-hidden={!open}
        className={
          "min-w-0 overflow-clip self-start justify-self-stretch @[36rem]/frame:col-start-2 @[36rem]/frame:row-start-1 @[36rem]/frame:block " +
          (open ? "block" : "hidden @[36rem]/frame:h-0")
        }
      >
        <div
          className={
            "flex min-w-0 flex-wrap items-end gap-3 px-2 pt-2 @[36rem]/frame:w-52 @[36rem]/frame:flex-col @[36rem]/frame:items-stretch @[36rem]/frame:ps-4 @[36rem]/frame:pe-0 " +
            "motion-safe:transition-[opacity,translate,visibility] motion-safe:duration-300 motion-safe:ease-out-quint " +
            (open
              ? "visible translate-x-0 opacity-100 motion-safe:starting:translate-x-2 motion-safe:starting:opacity-0"
              : "invisible translate-x-2 opacity-0")
          }
        >
          {state !== "idle" && children}
        </div>
      </div>
    </>
  );
}
export function PlaygroundPreview({ children }: { children: ReactNode }) {
  const { collage } = usePlaygroundScope();
  return (
    <div
      className={`flex min-w-0 flex-wrap items-center gap-3 ${collage ? "min-h-8 py-1" : "w-full min-h-24 justify-center py-4"}`}
    >
      {children}
    </div>
  );
}
