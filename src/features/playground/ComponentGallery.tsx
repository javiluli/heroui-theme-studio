import { lazy, memo, Suspense, useCallback, useEffect, useRef, useState, type ComponentType, type RefObject } from "react";
import { Skeleton } from "@heroui/react";
import { ComponentPlayground } from "./components/ComponentPlayground";
import { ComponentJumpPicker } from "./components/ComponentIndex";
import { CollagePreview } from "./components/CollagePreview";
import { categoryId, COMPONENT_CATEGORIES, COMPONENT_ORDER } from "./component-categories";
import type { ReactComponentSlug } from "./inspection/component-variable-map";
import {
  AutocompletePlayground, CheckboxGroupPlayground, ColorSwatchesPlayground, ComboBoxPlayground, FieldsetPlayground,
} from "./examples/AdditionalInputsPlaygrounds";
import type { DateExampleSlug } from "./examples/DatePlaygrounds";
import { AlertPlayground } from "./examples/AlertPlayground";
import { ButtonPlayground } from "./examples/Buttons/ButtonPlayground";
import { ButtonGroupPlayground } from "./examples/Buttons/ButtonGroupPlayground";
import { CardPlayground } from "./examples/CardPlayground";
import { CheckboxPlayground } from "./examples/CheckboxPlayground";
import { ChipPlayground } from "./examples/ChipPlayground";
import {
  AccordionPlayground, AvatarBadgePlayground, FormChoicesPlayground, LayoutPlayground,
  NavigationPlayground, StatusPlayground, TablePlayground, TextFieldsPlayground,
} from "./examples/FoundationsPlaygrounds";
import { InputPlayground } from "./examples/InputPlayground";
import {
  AlertDialogPlayground, ColorPlayground, DrawerPlayground, DropdownPlayground, InputOTPPlayground, TagGroupPlayground,
} from "./examples/InteractionPlaygrounds";
import { AvatarGroupPlayground, DisclosurePlayground, ScrollPlayground, SheetPlayground, ToastPlayground } from "./examples/MiscPlaygrounds";
import { ProgressPlayground } from "./examples/ProgressPlayground";
import { SelectPlayground } from "./examples/SelectPlayground";
import { TabsPlayground } from "./examples/TabsPlayground";
import {
  ColorFieldExample, DescriptionExample, ErrorMessageExample, FieldErrorExample, FormExample, InputGroupExample,
  LabelExample, SearchFieldExample, TextAreaExample, TextFieldExample,
} from "./examples/FormSpecimens";
import {
  BadgeExample, CloseButtonExample, ColorAreaExample, ColorSliderExample, ColorSwatchExample, DisclosureExample, KbdExample,
  LinkExample, ListBoxExample, ModalExample, PaginationExample, PopoverExample, ProgressCircleExample, SeparatorExample,
  SkeletonExample, SliderExample, SpinnerExample, SwitchExample, ToggleButtonExample, ToggleButtonGroupExample,
  ToolbarExample, TooltipExample, TypographyExample,
} from "./examples/InteractiveSpecimens";

const DatePlaygrounds = lazy(() => import("./examples/DatePlaygrounds"));

function dateSample(slug: DateExampleSlug) {
  return function DateSample() {
    return (
      <Suspense fallback={<div className="grid min-h-24" role="status">
        <span className="sr-only">Loading example…</span>
        <Skeleton animationType="none" aria-hidden="true" />
      </div>}>
        <DatePlaygrounds slug={slug} />
      </Suspense>
    );
  };
}

export const COMPONENT_EXAMPLES = {
  accordion: AccordionPlayground,
  alert: AlertPlayground,
  "alert-dialog": AlertDialogPlayground,
  autocomplete: AutocompletePlayground,
  avatar: AvatarBadgePlayground,
  "avatar-group": AvatarGroupPlayground,
  badge: BadgeExample,
  breadcrumbs: NavigationPlayground,
  button: ButtonPlayground,
  "button-group": ButtonGroupPlayground,
  calendar: dateSample("calendar"),
  card: CardPlayground,
  checkbox: CheckboxPlayground,
  "checkbox-group": CheckboxGroupPlayground,
  chip: ChipPlayground,
  "close-button": CloseButtonExample,
  "color-area": ColorAreaExample,
  "color-field": ColorFieldExample,
  "color-picker": ColorPlayground,
  "color-slider": ColorSliderExample,
  "color-swatch": ColorSwatchExample,
  "color-swatch-picker": ColorSwatchesPlayground,
  "combo-box": ComboBoxPlayground,
  "date-field": dateSample("date-field"),
  "date-picker": dateSample("date-picker"),
  "date-range-picker": dateSample("date-range-picker"),
  description: DescriptionExample,
  disclosure: DisclosureExample,
  "disclosure-group": DisclosurePlayground,
  drawer: DrawerPlayground,
  dropdown: DropdownPlayground,
  "error-message": ErrorMessageExample,
  "field-error": FieldErrorExample,
  fieldset: FieldsetPlayground,
  form: FormExample,
  input: InputPlayground,
  "input-group": InputGroupExample,
  "input-otp": InputOTPPlayground,
  kbd: KbdExample,
  label: LabelExample,
  link: LinkExample,
  "list-box": ListBoxExample,
  meter: StatusPlayground,
  modal: ModalExample,
  "number-field": TextFieldsPlayground,
  pagination: PaginationExample,
  popover: PopoverExample,
  "progress-bar": ProgressPlayground,
  "progress-circle": ProgressCircleExample,
  "radio-group": FormChoicesPlayground,
  "range-calendar": dateSample("range-calendar"),
  "scroll-shadow": ScrollPlayground,
  "search-field": SearchFieldExample,
  select: SelectPlayground,
  separator: SeparatorExample,
  sheet: SheetPlayground,
  skeleton: SkeletonExample,
  slider: SliderExample,
  spinner: SpinnerExample,
  surface: LayoutPlayground,
  switch: SwitchExample,
  table: TablePlayground,
  tabs: TabsPlayground,
  "tag-group": TagGroupPlayground,
  "text-area": TextAreaExample,
  "text-field": TextFieldExample,
  "time-field": dateSample("time-field"),
  toast: ToastPlayground,
  "toggle-button": ToggleButtonExample,
  "toggle-button-group": ToggleButtonGroupExample,
  toolbar: ToolbarExample,
  tooltip: TooltipExample,
  typography: TypographyExample,
} satisfies Record<ReactComponentSlug, ComponentType>;

const ExampleCard = memo(function ExampleCard({ slug, nearby }: {
  slug: ReactComponentSlug;
  nearby: boolean;
}) {
  const [interacted, setInteracted] = useState(false);
  const Example = COMPONENT_EXAMPLES[slug];
  return (
    <ComponentPlayground slug={slug}
      onInteract={interacted ? undefined : () => setInteracted(true)}>
      {(nearby || interacted) && <Example />}
    </ComponentPlayground>
  );
});

/** Keep headings in document order and mount untouched samples around the viewport. */
export default memo(function ComponentGallery({ layout = "list", onGalleryReady, anchorTarget }: {
  layout?: "list" | "collage";
  onGalleryReady: (gallery: HTMLDivElement | null) => void;
  anchorTarget: RefObject<HTMLElement | null>;
}) {
  const collage = layout === "collage";
  const gallery = useRef<HTMLDivElement>(null);
  const registerGallery = useCallback((node: HTMLDivElement | null) => {
    gallery.current = node;
    onGalleryReady(node);
  }, [onGalleryReady]);
  const [nearby, setNearby] = useState(() => new Set(COMPONENT_ORDER.slice(0, 4)));
  useEffect(() => {
    if (collage || !gallery.current) return;
    if (!("IntersectionObserver" in window)) {
      setNearby(new Set(COMPONENT_ORDER));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      setNearby((current) => {
        const next = new Set(current);
        for (const { target, isIntersecting } of entries) {
          const slug = (target as HTMLElement).dataset.example as ReactComponentSlug;
          if (isIntersecting) next.add(slug);
          else next.delete(slug);
        }
        return next;
      });
    }, { rootMargin: "900px 0px" });
    gallery.current.querySelectorAll("[data-example]").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [collage]);

  if (collage) return <CollagePreview />;

  return (
    <section className="w-full min-w-0"
      aria-label="Free HeroUI React v3 component catalog">
      <h1 className="sr-only">Components</h1>
      <ComponentJumpPicker anchorTarget={anchorTarget} />
      <div ref={registerGallery} data-gallery-layout={layout} className="grid min-w-0 gap-10">
        {COMPONENT_CATEGORIES.map(({ title, slugs }) => (
          <section key={title} className="grid min-w-0 gap-6">
            <h2 id={categoryId(title)} data-category-heading tabIndex={-1}
              className="scroll-mt-[calc(var(--studio-header-height,3.5625rem)+4.5rem)] text-xl font-semibold focus-visible:outline-2 focus-visible:outline-focus">
              {title}
            </h2>
            {slugs.map((slug) => <ExampleCard key={slug} slug={slug} nearby={nearby.has(slug)} />)}
          </section>
        ))}
      </div>
    </section>
  );
});
