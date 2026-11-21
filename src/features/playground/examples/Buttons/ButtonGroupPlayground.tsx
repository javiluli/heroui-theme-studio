import { Button, ButtonGroup } from "@heroui/react";
import { Copy } from "lucide-react";
import { useState } from "react";
import {
  PlaygroundControls,
  PlaygroundPreview,
} from "../../components/ComponentPlayground";
import { ControlSelect } from "../../components/ControlSelect";
import { ControlSwitch } from "../../components/ControlSwitch";
import { BUTTON_VARIANTS, type Size, SIZES } from "../../options";

const variants = BUTTON_VARIANTS.filter(({ key }) => key !== "outline" && key !== "danger-soft");
type GroupVariant = (typeof variants)[number]["key"];
const orientations = [{ key: "horizontal", label: "Horizontal" }, { key: "vertical", label: "Vertical" }] as const;

export function ButtonGroupPlayground() {
  const [size, setSize] = useState<Size>("md");
  const [disabled, setDisabled] = useState(false);
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");
  const [separator, setSeparator] = useState(false);
  const [variant, setVariant] = useState<GroupVariant>("secondary");
  const [copied, setCopied] = useState(false);

  return (
    <>
      <PlaygroundControls>
        <ControlSelect label="Variant" value={variant} options={variants} onChange={setVariant} />
        <ControlSelect
          label="Size"
          value={size}
          options={SIZES}
          onChange={setSize}
        />
        <ControlSwitch
          label="Disabled"
          value={disabled}
          onChange={setDisabled}
        />
        <ControlSelect label="Orientation" value={orientation} options={orientations} onChange={setOrientation} />
        <ControlSwitch label="Separator" value={separator} onChange={setSeparator} />
      </PlaygroundControls>

      <PlaygroundPreview>
        <ButtonGroup size={size} variant={variant} orientation={orientation} isDisabled={disabled}>
          <Button onPress={() => setCopied(true)}>
            <Copy size={15} /> {copied ? "Copied" : "Copy"}
          </Button>
          <Button onPress={() => setCopied(false)}>
            {separator && <ButtonGroup.Separator />}
            Reset
          </Button>
        </ButtonGroup>
      </PlaygroundPreview>
    </>
  );
}
