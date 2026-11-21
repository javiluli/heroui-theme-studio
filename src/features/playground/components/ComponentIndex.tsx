import { Link, ListBox, Select, Typography } from "@heroui/react";
import { memo, useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { ReactComponentSlug } from "../inspection/component-variable-map";
import { REACT_COMPONENT_SOURCES } from "../inspection/react-component-sources";

function sectionId(slug: ReactComponentSlug) {
  return "example-" + slug;
}

function alignAnchor(target: HTMLElement | null) {
  if (target && window.location.hash === "#" + target.id) {
    target.scrollIntoView({ block: "start", behavior: "instant" });
  }
}

const IndexLink = memo(function IndexLink({ slug, active, onJump }: {
  slug: ReactComponentSlug;
  active: boolean;
  onJump: (slug: ReactComponentSlug) => void;
}) {
  return (
    <li>
      <Link href={"#" + sectionId(slug)} aria-current={active ? "location" : undefined}
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          onJump(slug);
        }}>
        <span className={`min-w-0 wrap-anywhere py-1.5 text-xs leading-snug ${active ? "font-semibold text-foreground" : "text-muted"}`}>
          {REACT_COMPONENT_SOURCES[slug].name}
        </span>
      </Link>
    </li>
  );
});

export const ComponentIndex = memo(function ComponentIndex({ gallery, slugs }: {
  gallery: RefObject<HTMLDivElement | null>;
  slugs: readonly ReactComponentSlug[];
}) {
  const [active, setActive] = useState<ReactComponentSlug | undefined>(slugs[0]);
  const indexScroll = useRef<HTMLDivElement>(null);
  const anchorTarget = useRef<HTMLElement | null>(null);
  const items = useMemo(() => slugs.map((slug) => ({ slug, name: REACT_COMPONENT_SOURCES[slug].name })), [slugs]);

  useEffect(() => {
    const root = gallery.current;
    if (!root) return;
    const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-example]"));
    if (!sections.length) return;
    const readingLine = () => parseFloat(getComputedStyle(sections[0]).scrollMarginTop) + 2;
    let line = readingLine();
    let frame = 0;
    let resized = false;

    const update = () => {
      frame = 0;
      if (resized) {
        resized = false;
        line = readingLine();
        // Lazy examples can expand after their placeholder is replaced.
        alignAnchor(anchorTarget.current);
      }
      if (!indexScroll.current?.offsetWidth) return;
      // The sections are in document order. Find the last heading above the reading line.
      let low = 0;
      let high = sections.length - 1;
      while (low < high) {
        const middle = Math.ceil((low + high) / 2);
        if (sections[middle].getBoundingClientRect().top <= line) low = middle;
        else high = middle - 1;
      }
      const atBottom = window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      setActive(slugs[atBottom ? sections.length - 1 : low]);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const stopAligning = () => { anchorTarget.current = null; };
    const initial = document.getElementById(window.location.hash.slice(1));
    if (initial && root.contains(initial)) {
      anchorTarget.current = initial;
      alignAnchor(initial);
    }
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    const onResize = () => {
      resized = true;
      schedule();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("wheel", stopAligning, { passive: true });
    window.addEventListener("pointerdown", stopAligning, { passive: true });
    window.addEventListener("keydown", stopAligning);
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => {
      resized = true;
      schedule();
    });
    resize?.observe(root);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", stopAligning);
      window.removeEventListener("pointerdown", stopAligning);
      window.removeEventListener("keydown", stopAligning);
      resize?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [gallery, slugs]);

  useEffect(() => {
    const scroll = indexScroll.current;
    const selected = scroll?.querySelector('[aria-current="location"]');
    if (!scroll || !selected || !scroll.clientHeight) return;
    const viewport = scroll.getBoundingClientRect();
    const row = selected.getBoundingClientRect();
    if (row.top < viewport.top) scroll.scrollTop += row.top - viewport.top;
    else if (row.bottom > viewport.bottom) scroll.scrollTop += row.bottom - viewport.bottom;
  }, [active]);

  const jump = useCallback((slug: ReactComponentSlug) => {
    const id = sectionId(slug);
    const target = document.getElementById(id);
    if (!target) return;
    if (window.location.hash !== "#" + id) window.history.pushState(null, "", "#" + id);
    anchorTarget.current = target;
    target.focus({ preventScroll: true });
    alignAnchor(target);
  }, []);

  return (
    <>
      <div className="max-w-72 @[60rem]/catalog:hidden">
        <Select aria-label="Jump to a component" placeholder="Jump to a component" selectedKey={null}
          onSelectionChange={(key) => {
            const slug = slugs.find((item) => item === key);
            if (slug) jump(slug);
          }}>
          <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
          <Select.Popover>
            <ListBox items={items}>
              {({ slug, name }) => <ListBox.Item id={slug} textValue={name}>{name}</ListBox.Item>}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>
      <nav aria-label="Component index" className="sticky top-[calc(var(--studio-header-height,3.5625rem)+4.5rem)] hidden min-w-0 @[60rem]/catalog:col-start-2 @[60rem]/catalog:row-start-1 @[60rem]/catalog:block">
        <Typography type="body-xs" color="muted" weight="medium">On this page</Typography>
        <div ref={indexScroll} className="scrollbar mt-2 max-h-[calc(100dvh-var(--studio-header-height,3.5625rem)-7rem)] overflow-y-auto overscroll-contain [@media(hover:hover)]:[&:not(:hover,:focus-within)]:[--scrollbar-color:transparent_transparent]"
          data-scrollbar="thin">
          <ul className="space-y-0.5">
            {slugs.map((slug) => <IndexLink key={slug} slug={slug} active={active === slug} onJump={jump} />)}
          </ul>
        </div>
      </nav>
    </>
  );
});
