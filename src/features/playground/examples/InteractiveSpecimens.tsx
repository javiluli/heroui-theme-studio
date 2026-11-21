import { useState } from "react";
import {
  Avatar, Badge, Button, CloseButton, ColorArea, ColorSlider, ColorSwatch, Disclosure, Kbd,
  Label, Link, ListBox, Modal, Pagination, Popover, ProgressCircle, Separator,
  Skeleton, Slider, Spinner, Switch, ToggleButton, ToggleButtonGroup, Toolbar,
  Tooltip, Typography,
} from "@heroui/react";
import { Bold, Info, Italic, Underline } from "lucide-react";
import { configuredExample, DISABLED, ORIENTATIONS, SEMANTIC_COLORS, SIZES } from "../components/configured-example";
import { ControlSelect } from "../components/ControlSelect";
import { PlaygroundControls, PlaygroundPreview } from "../components/ComponentPlayground";
import { SIZES as sizeOptions, type Size } from "../options";

const SWATCH_SIZES = ["md", "xs", "sm", "lg", "xl"] as const;
const PLACEMENTS = ["bottom", "top", "left", "right"] as const;

export const BadgeExample = configuredExample({
  Color: SEMANTIC_COLORS, Variant: ["primary", "secondary", "soft"], Size: SIZES,
  Placement: ["top-right", "top-left", "bottom-right", "bottom-left"],
}, ({ Color, Variant, Size, Placement }) => (
  <Badge.Anchor>
    <Avatar><Avatar.Fallback>LA</Avatar.Fallback></Avatar>
    <Badge color={Color} variant={Variant} size={Size} placement={Placement} aria-label="Three notifications">3</Badge>
  </Badge.Anchor>
));

export const CloseButtonExample = configuredExample({ Disabled: DISABLED }, ({ Disabled }) =>
  <CloseButton aria-label="Close sample notification" isDisabled={Disabled === "on"} />);

export const ColorAreaExample = configuredExample({ Disabled: DISABLED },
  ({ Disabled }) => (
    <ColorArea aria-label="Saturation and brightness" defaultValue="hsb(214, 86%, 71%)"
      colorSpace="hsb" xChannel="saturation" yChannel="brightness" isDisabled={Disabled === "on"}>
      <ColorArea.Thumb />
    </ColorArea>
  ));

export const ColorSliderExample = configuredExample({ Orientation: ORIENTATIONS, Disabled: DISABLED },
  ({ Orientation, Disabled }) => (
    <div className={Orientation === "vertical" ? "flex h-36" : "w-full max-w-72"}>
      <ColorSlider aria-label="Hue" defaultValue="hsb(214, 86%, 71%)" colorSpace="hsb" channel="hue"
        orientation={Orientation} isDisabled={Disabled === "on"}>
        <ColorSlider.Track><ColorSlider.Thumb /></ColorSlider.Track>
      </ColorSlider>
    </div>
  ));

export const ColorSwatchExample = configuredExample({ Size: SWATCH_SIZES, Shape: ["circle", "square"], Opacity: ["Solid", "Translucent"] },
  ({ Size, Shape, Opacity }) => (
    <ColorSwatch size={Size} shape={Shape} color={Opacity === "Solid" ? "#3978BF" : "#3978BF60"} colorName="Sample blue" />
  ));

export const DisclosureExample = configuredExample({ Disabled: DISABLED },
  ({ Disabled }) => (
    <Disclosure isDisabled={Disabled === "on"}>
      <Disclosure.Heading><Disclosure.Trigger>Project details<Disclosure.Indicator /></Disclosure.Trigger></Disclosure.Heading>
      <Disclosure.Content>Content that can be expanded and collapsed.</Disclosure.Content>
    </Disclosure>
  ));

export const KbdExample = configuredExample({ Variant: ["default", "light"] }, ({ Variant }) => <><Kbd variant={Variant}>Ctrl</Kbd><span>+</span><Kbd variant={Variant}>K</Kbd></>);

export const LinkExample = configuredExample({ Disabled: DISABLED },
  ({ Disabled }) => <Link href="https://heroui.com/en/docs/react/components/link" target="_blank" rel="noreferrer" isDisabled={Disabled === "on"}>Link documentation</Link>);

export const ListBoxExample = configuredExample({ Selection: ["single", "multiple", "none"], "Destructive item": DISABLED },
  ({ Selection, "Destructive item": danger }) => (
    <div className="w-full max-w-64">
      <ListBox aria-label="Projects" selectionMode={Selection} disabledKeys={["archived"]}>
        <ListBox.Item id="design" textValue="Design">Design<ListBox.ItemIndicator /></ListBox.Item>
        <ListBox.Item id="docs" textValue="Documentation" variant={danger === "on" ? "danger" : "default"}>Documentation<ListBox.ItemIndicator /></ListBox.Item>
        <ListBox.Item id="archived" textValue="Archived">Archived</ListBox.Item>
      </ListBox>
    </div>
  ));

export const ModalExample = configuredExample({ Size: ["md", "xs", "sm", "lg", "cover", "full"], Background: ["opaque", "blur", "transparent"] },
  ({ Size, Background }) => (
    <Modal>
      <Button variant="secondary">Open modal</Button>
      <Modal.Backdrop variant={Background}>
        <Modal.Container size={Size}>
          <Modal.Dialog>
            <Modal.CloseTrigger /><Modal.Header><Modal.Heading>Project overview</Modal.Heading></Modal.Header>
            <Modal.Body>Dialogs also use the active theme.</Modal.Body>
            <Modal.Footer><Button slot="close">Got it</Button></Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  ));

export function PaginationExample() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState<Size>("md");
  return (
    <>
      <PlaygroundControls><ControlSelect label="Size" value={size} options={sizeOptions} onChange={setSize} /></PlaygroundControls>
      <PlaygroundPreview>
        <Pagination size={size}>
          <Pagination.Content>
            <Pagination.Item><Pagination.Previous isDisabled={page === 1} onPress={() => setPage(page - 1)}><Pagination.PreviousIcon /></Pagination.Previous></Pagination.Item>
            {[1, 2, 3].map((number) => (
              <Pagination.Item key={number}><Pagination.Link isActive={page === number} onPress={() => setPage(number)}>{number}</Pagination.Link></Pagination.Item>
            ))}
            <Pagination.Item><Pagination.Next isDisabled={page === 3} onPress={() => setPage(page + 1)}><Pagination.NextIcon /></Pagination.Next></Pagination.Item>
          </Pagination.Content>
        </Pagination>
      </PlaygroundPreview>
    </>
  );
}

export const PopoverExample = configuredExample({ Placement: PLACEMENTS }, ({ Placement }) => (
  <Popover>
    <Button variant="secondary">View details</Button>
    <Popover.Content placement={Placement}>
      <Popover.Dialog><Popover.Heading>Details</Popover.Heading><p>This overlay uses the active theme.</p></Popover.Dialog>
    </Popover.Content>
  </Popover>
));

export const ProgressCircleExample = configuredExample({
  Color: SEMANTIC_COLORS, Size: SIZES, Progress: ["65", "25", "100"], Indeterminate: DISABLED,
}, ({ Color, Size, Progress, Indeterminate }) => (
  <ProgressCircle aria-label="Export progress" size={Size} color={Color} value={Number(Progress)} isIndeterminate={Indeterminate === "on"}>
    <ProgressCircle.Track><ProgressCircle.TrackCircle /><ProgressCircle.FillCircle /></ProgressCircle.Track>
  </ProgressCircle>
));

export const SeparatorExample = configuredExample({ Variant: ["default", "secondary", "tertiary"], Orientation: ORIENTATIONS },
  ({ Variant, Orientation }) => (
    <div className={Orientation === "vertical" ? "flex h-12 items-stretch gap-3" : "grid w-full gap-2"}>
      <span>Details</span><Separator variant={Variant} orientation={Orientation} /><span>Activity</span>
    </div>
  ));

export const SkeletonExample = configuredExample({ Animation: ["shimmer", "pulse", "none"] },
  ({ Animation }) => <Skeleton animationType={Animation}><span className="block h-8 w-52" /></Skeleton>);

export const SliderExample = configuredExample({ Orientation: ORIENTATIONS, Disabled: DISABLED },
  ({ Orientation, Disabled }) => (
    <div className={Orientation === "vertical" ? "h-36" : "w-full max-w-72"}>
      <Slider orientation={Orientation} defaultValue={45} isDisabled={Disabled === "on"}>
        <Label>Volume</Label><Slider.Output />
        <Slider.Track><Slider.Fill /><Slider.Thumb /></Slider.Track>
      </Slider>
    </div>
  ));

export const SpinnerExample = configuredExample({
  Color: ["current", "accent", "success", "warning", "danger"], Size: ["md", "sm", "lg", "xl"],
}, ({ Color, Size }) => <Spinner size={Size} color={Color} aria-label="Loading example" />);

export const SwitchExample = configuredExample({ Size: SIZES, Disabled: DISABLED, Invalid: DISABLED },
  ({ Size, Disabled, Invalid }) => (
    <Switch size={Size} isDisabled={Disabled === "on"} isInvalid={Invalid === "on"}>
      <Switch.Content><Switch.Control><Switch.Thumb /></Switch.Control><Label>Notifications</Label></Switch.Content>
    </Switch>
  ));

export const ToggleButtonExample = configuredExample({ Variant: ["default", "ghost"], Size: SIZES, Disabled: DISABLED },
  ({ Variant, Size, Disabled }) => (
    <ToggleButton variant={Variant} size={Size} isDisabled={Disabled === "on"}><Bold aria-hidden="true" /> Bold</ToggleButton>
  ));

export const ToggleButtonGroupExample = configuredExample({
  Selection: ["single", "multiple"], Orientation: ORIENTATIONS, Size: SIZES, Disabled: DISABLED,
}, ({ Selection, Orientation, Size, Disabled }) => (
  <ToggleButtonGroup aria-label="Text formatting" selectionMode={Selection} orientation={Orientation}
    size={Size} isDisabled={Disabled === "on"} defaultSelectedKeys={["bold"]}>
    <ToggleButton id="bold" aria-label="Bold" isIconOnly><Bold /></ToggleButton>
    <ToggleButton id="italic" aria-label="Italic" isIconOnly><Italic /></ToggleButton>
    <ToggleButton id="underline" aria-label="Underline" isIconOnly><Underline /></ToggleButton>
  </ToggleButtonGroup>
));

export const ToolbarExample = configuredExample({ Orientation: ORIENTATIONS }, ({ Orientation }) => (
  <Toolbar aria-label="Project tools" orientation={Orientation}>
    <ToggleButton>Pin</ToggleButton><Button variant="secondary">Save</Button>
  </Toolbar>
));

export const TooltipExample = configuredExample({ Placement: PLACEMENTS, Disabled: DISABLED },
  ({ Placement, Disabled }) => (
    <Tooltip delay={200} isDisabled={Disabled === "on"}>
      <Button variant="secondary"><Info aria-hidden="true" /> More information</Button>
      <Tooltip.Content placement={Placement}>Project information</Tooltip.Content>
    </Tooltip>
  ));

export const TypographyExample = configuredExample({
  Tipo: ["h3", "h4", "body", "body-sm", "code"], Color: ["default", "muted"],
}, ({ Tipo, Color }) => <Typography type={Tipo} color={Color}>North Studio theme</Typography>);
