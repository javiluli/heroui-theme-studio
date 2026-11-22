import { Header, Link, ListBox, Select, Typography } from "@heroui/react";
import { memo, useCallback, useEffect, useRef, useState, type ComponentProps, type RefObject } from "react";
import { categoryId, COMPONENT_CATEGORIES, COMPONENT_ORDER } from "../component-categories";
import type { ReactComponentSlug } from "../inspection/component-variable-map";
import { REACT_COMPONENT_SOURCES } from "../inspection/react-component-sources";

type IndexLinkClickHandler = NonNullable<ComponentProps<typeof Link>["onClick"]>;

function sectionId(slug: ReactComponentSlug) {
  return "example-" + slug;
}

function alignAnchor(target: HTMLElement | null) {
  if (target && window.location.hash === "#" + target.id) {
    target.scrollIntoView({ block: "start", behavior: "instant" });
  }
}

function jumpToAnchor(id: string, anchorTarget: RefObject<HTMLElement | null>) {
  const target = document.getElementById(id);
  if (!target) return;
  if (window.location.hash !== "#" + id) window.history.pushState(null, "", "#" + id);
  anchorTarget.current = target;
  target.focus({ preventScroll: true });
  alignAnchor(target);
}

export function ComponentJumpPicker({ anchorTarget }: { anchorTarget: RefObject<HTMLElement | null> }) {
  return (
    <div className="mb-6 max-w-72 @[84rem]/studio:hidden">
      <Select aria-label="Jump to a component" placeholder="Jump to a component" selectedKey={null}
        onSelectionChange={(key) => {
          const slug = COMPONENT_ORDER.find((item) => item === key);
          if (slug) jumpToAnchor(sectionId(slug), anchorTarget);
        }}>
        <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
        <Select.Popover>
          <ListBox>
            {COMPONENT_CATEGORIES.map(({ title, slugs }) => (
              <ListBox.Section key={title}>
                <Header>{title}</Header>
                {slugs.map((slug) => {
                  const name = REACT_COMPONENT_SOURCES[slug].name;
                  return <ListBox.Item key={slug} id={slug} textValue={name}>{name}</ListBox.Item>;
                })}
              </ListBox.Section>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}

const IndexLink = memo(function IndexLink({ slug, active, onClick }: {
  slug: ReactComponentSlug;
  active: boolean;
  onClick: IndexLinkClickHandler;
}) {
  return (
    <li>
      <Link href={"#" + sectionId(slug)} aria-current={active ? "location" : undefined} onClick={onClick}>
        <span className={`min-w-0 wrap-anywhere py-1 text-xs leading-snug ${active ? "font-semibold text-accent" : "text-foreground"}`}>
          {REACT_COMPONENT_SOURCES[slug].name}
        </span>
      </Link>
    </li>
  );
});

export const ComponentIndex = memo(function ComponentIndex({ gallery, anchorTarget }: {
  gallery: HTMLDivElement | null;
  anchorTarget: RefObject<HTMLElement | null>;
}) {
  const [active, setActive] = useState(() => categoryId(COMPONENT_CATEGORIES[0].title));
  const indexScroll = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gallery) return;
    const sections = Array.from(gallery.querySelectorAll<HTMLElement>("[data-category-heading], [data-example]"));
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
      setActive(sections[atBottom ? sections.length - 1 : low].id);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const stopAligning = () => { anchorTarget.current = null; };
    const initial = document.getElementById(window.location.hash.slice(1));
    if (initial && gallery.contains(initial)) {
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
    resize?.observe(gallery);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", stopAligning);
      window.removeEventListener("pointerdown", stopAligning);
      window.removeEventListener("keydown", stopAligning);
      resize?.disconnect();
      cancelAnimationFrame(frame);
      anchorTarget.current = null;
    };
  }, [gallery, anchorTarget]);

  useEffect(() => {
    const scroll = indexScroll.current;
    const selected = scroll?.querySelector('[aria-current="location"]');
    if (!scroll || !selected || !scroll.clientHeight) return;
    const viewport = scroll.getBoundingClientRect();
    const row = selected.getBoundingClientRect();
    if (row.top < viewport.top) scroll.scrollTop += row.top - viewport.top;
    else if (row.bottom > viewport.bottom) scroll.scrollTop += row.bottom - viewport.bottom;
  }, [active]);

  const followAnchor = useCallback<IndexLinkClickHandler>((event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!(event.currentTarget instanceof HTMLAnchorElement)) return;
    event.preventDefault();
    jumpToAnchor(event.currentTarget.hash.slice(1), anchorTarget);
  }, [anchorTarget]);

  return (
    <nav aria-label="Component index" className="sticky top-[calc(var(--studio-header-height,3.5625rem)+4.5rem)] mt-18 hidden min-w-0 px-2 @[84rem]/studio:block">
      <Typography type="body-xs" color="muted" weight="medium">On this page</Typography>
      <div ref={indexScroll} className="scrollbar mt-3 flex max-h-[calc(100dvh-var(--studio-header-height,3.5625rem)-7rem)] flex-col gap-6 overflow-y-auto overscroll-contain [@media(hover:hover)]:[&:not(:hover,:focus-within)]:[--scrollbar-color:transparent_transparent]"
        data-scrollbar="thin">
        {COMPONENT_CATEGORIES.map(({ title, slugs }) => {
          const id = categoryId(title);
          return (
            <div key={id} className="space-y-1">
              <div>
                <Link href={"#" + id} aria-current={active === id ? "location" : undefined} onClick={followAnchor}>
                  <Typography type="body-xs" color="muted" weight={active === id ? "semibold" : "medium"}>{title}</Typography>
                </Link>
              </div>
              <ul aria-label={title}>
                {slugs.map((slug) => <IndexLink key={slug} slug={slug} active={active === sectionId(slug)} onClick={followAnchor} />)}
              </ul>
            </div>
          );
        })}
      </div>
    </nav>
  );
});
