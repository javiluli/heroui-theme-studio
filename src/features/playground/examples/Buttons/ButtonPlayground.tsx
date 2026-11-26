import { Button, Spinner } from "@heroui/react";
import { Globe } from "lucide-react";
import { useState } from "react";
import {
  PlaygroundControls,
  PlaygroundPreview,
} from "../../components/ComponentPlayground";
import { ControlSegment } from "../../components/ControlSegment";
import { ControlSwitch } from "../../components/ControlSwitch";
import { BUTTON_VARIANTS, SIZES, type Size } from "../../options";

const sizes = SIZES.map(({ key }) => key);

export function ButtonPlayground() {
  const [size, setSize] = useState<Size>("sm");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isPending, setIsPending] = useState(false);

  return (
    <>
      <PlaygroundControls>
        <ControlSegment label="Size" options={sizes} value={size} onChange={setSize} />
        <ControlSwitch label="isDisabled" value={isDisabled} onChange={setIsDisabled} />
        <ControlSwitch label="isPending" value={isPending} onChange={setIsPending} />
      </PlaygroundControls>

      <PlaygroundPreview>
        {BUTTON_VARIANTS.map(({ key, label }) => (
          <Button
            key={key}
            variant={key}
            size={size}
            isDisabled={isDisabled}
            isPending={isPending}
          >
            {isPending ? <Spinner color="current" size="sm" /> : <Globe aria-hidden="true" />}
            {label}
          </Button>
        ))}
      </PlaygroundPreview>
    </>
  );
}
