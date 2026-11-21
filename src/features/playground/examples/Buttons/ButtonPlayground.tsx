import { Button, Spinner } from "@heroui/react";
import { ArrowRight, Plus } from "lucide-react";
import { useState } from "react";
import {
  PlaygroundControls,
  PlaygroundPreview,
} from "../../components/ComponentPlayground";
import { ControlSelect } from "../../components/ControlSelect";
import { ControlSwitch } from "../../components/ControlSwitch";
import { BUTTON_VARIANTS, Size, SIZES } from "../../options";

const variants = [{ key: "all", label: "All" }, ...BUTTON_VARIANTS] as const;
const states = [
  { key: "normal", label: "Normal" },
  { key: "disabled", label: "Disabled" },
  { key: "pending", label: "Pending" },
] as const;

export function ButtonPlayground() {
  const [size, setSize] = useState<Size>("md");
  const [variant, setVariant] = useState<(typeof variants)[number]["key"]>("all");
  const [state, setState] = useState<(typeof states)[number]["key"]>("normal");
  const [icon, setIcon] = useState(true);

  return (
    <>
      <PlaygroundControls>
        <ControlSelect
          label="Size"
          value={size}
          options={SIZES}
          onChange={setSize}
        />
        <ControlSelect label="Variant" value={variant} options={variants} onChange={setVariant} />
        <ControlSelect label="State" value={state} options={states} onChange={setState} />
        <ControlSwitch label="With icon" value={icon} onChange={setIcon} />
      </PlaygroundControls>

      <PlaygroundPreview>
        {BUTTON_VARIANTS.filter(({ key }) => variant === "all" || key === variant).map(({ key, label }) => (
          <Button
            key={key}
            variant={key}
            size={size}
            isDisabled={state === "disabled"}
            isPending={state === "pending"}
          >
            {({ isPending }) => (
              <>
                {isPending ? <Spinner size="sm" /> : icon ? <Plus aria-hidden="true" /> : null}
                {label}
                {!isPending && icon && <ArrowRight />}
              </>
            )}
          </Button>
        ))}
      </PlaygroundPreview>
    </>
  );
}
