import { useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Button,
  Disclosure,
  DisclosureGroup,
  ScrollShadow,
  Sheet,
  Toast,
  toast,
} from "@heroui/react";
import { Bell, PanelBottom } from "lucide-react";
import {
  PlaygroundControls,
  PlaygroundPreview,
} from "../components/ComponentPlayground";
import { ControlSelect } from "../components/ControlSelect";
import { ControlSwitch } from "../components/ControlSwitch";
import { CHIP_COLORS, SIZES, type ChipColor, type Size } from "../options";

export function AvatarGroupPlayground() {
  const [size, setSize] = useState<Size>("md");
  const [grid, setGrid] = useState(false);

  return (
    <>
      <PlaygroundControls>
        <ControlSelect
          label="Size"
          value={size}
          options={SIZES}
          onChange={setSize}
        />
        <ControlSwitch label="Grid" value={grid} onChange={setGrid} />
      </PlaygroundControls>
      <PlaygroundPreview>
        <AvatarGroup size={size} max={3} isGrid={grid} color="accent">
          {["CR", "LM", "JD", "AP", "MG"].map((name) => (
            <Avatar key={name}>
              <Avatar.Fallback>{name}</Avatar.Fallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </PlaygroundPreview>
    </>
  );
}

export function DisclosurePlayground() {
  const [disabled, setDisabled] = useState(false);
  const [multiple, setMultiple] = useState(false);
  return (
    <>
      <PlaygroundControls>
        <ControlSwitch
          label="Disabled"
          value={disabled}
          onChange={setDisabled}
        />
        <ControlSwitch
          label="Allow multiple"
          value={multiple}
          onChange={setMultiple}
        />
      </PlaygroundControls>
      <PlaygroundPreview>
        <DisclosureGroup
          isDisabled={disabled}
          allowsMultipleExpanded={multiple}
          defaultExpandedKeys={["first"]}
        >
          <Disclosure id="first">
            <Disclosure.Heading>
              <Disclosure.Trigger>
                Getting started
                <Disclosure.Indicator />
              </Disclosure.Trigger>
            </Disclosure.Heading>
            <Disclosure.Content>
              Edit the global tokens to see how this disclosure changes.
            </Disclosure.Content>
          </Disclosure>
          <Disclosure id="second">
            <Disclosure.Heading>
              <Disclosure.Trigger>
                Customize colors
                <Disclosure.Indicator />
              </Disclosure.Trigger>
            </Disclosure.Heading>
            <Disclosure.Content>
              Backgrounds and text use the same theme tokens.
            </Disclosure.Content>
          </Disclosure>
        </DisclosureGroup>
      </PlaygroundPreview>
    </>
  );
}

export function SheetPlayground() {
  const [placement, setPlacement] = useState<"bottom" | "right" | "top" | "left">("bottom");
  return (
    <>
      <PlaygroundControls>
        <ControlSelect
          label="Placement"
          value={placement}
          options={
            [
              { key: "bottom", label: "Bottom" },
              { key: "right", label: "Right" },
              { key: "top", label: "Top" },
              { key: "left", label: "Left" },
            ] as const
          }
          onChange={setPlacement}
        />
      </PlaygroundControls>
      <PlaygroundPreview>
        <Sheet placement={placement}>
          <Sheet.Trigger>
            <Button variant="secondary">
              <PanelBottom size={16} /> Open sheet
            </Button>
          </Sheet.Trigger>
          <Sheet.Backdrop>
            <Sheet.Content>
              <Sheet.Dialog>
                <Sheet.Handle />
                <Sheet.CloseTrigger />
                <Sheet.Header>
                  <Sheet.Heading>Sheet preview</Sheet.Heading>
                </Sheet.Header>
                <Sheet.Body>
                  <p>A HeroUI sheet that uses the editor colors.</p>
                </Sheet.Body>
                <Sheet.Footer>
                  <Sheet.Close>
                    <Button variant="primary">Got it</Button>
                  </Sheet.Close>
                </Sheet.Footer>
              </Sheet.Dialog>
            </Sheet.Content>
          </Sheet.Backdrop>
        </Sheet>
      </PlaygroundPreview>
    </>
  );
}

export function ScrollPlayground() {
  const [enabled, setEnabled] = useState(true);
  return (
    <>
      <PlaygroundControls>
        <ControlSwitch
          label="Enable shadow"
          value={enabled}
          onChange={setEnabled}
        />
      </PlaygroundControls>
      <PlaygroundPreview>
        <div className="w-full">
          <ScrollShadow className="h-48" isEnabled={enabled} orientation="vertical">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="border-b border-separator px-3 py-2 text-xs text-muted"
              >
                Item #{i + 1} · componente en scroll
              </div>
            ))}
          </ScrollShadow>
        </div>
      </PlaygroundPreview>
    </>
  );
}

export function ToastPlayground() {
  const [variant, setVariant] = useState<ChipColor>("success");
  return (
    <>
      <PlaygroundControls>
        <ControlSelect label="Variant" value={variant} options={CHIP_COLORS} onChange={setVariant} />
      </PlaygroundControls>
      <PlaygroundPreview>
        <Toast.Provider />
        <Button
          variant="primary"
          onPress={() => toast("Changes saved", { variant })}
        >
          <Bell size={16} /> Show toast
        </Button>
      </PlaygroundPreview>
    </>
  );
}
