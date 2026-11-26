import { ToggleButton, ToggleButtonGroup } from "@heroui/react";
import "./control-segment.css";

interface ControlSegmentProps<T extends string> {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  isDisabled?: boolean;
}

export function ControlSegment<T extends string>({
  label,
  options,
  value,
  onChange,
  isDisabled = false,
}: ControlSegmentProps<T>) {
  return (
    <ToggleButtonGroup
      aria-label={label}
      className="control-segment"
      size="sm"
      fullWidth
      disallowEmptySelection
      isDisabled={isDisabled}
      selectionMode="single"
      selectedKeys={new Set([value])}
      onSelectionChange={(keys) => {
        const selected = options.find((option) => keys.has(option));
        if (selected !== undefined) onChange(selected);
      }}
    >
      {options.map((option) => (
        <ToggleButton key={option} id={option}>
          {option}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
