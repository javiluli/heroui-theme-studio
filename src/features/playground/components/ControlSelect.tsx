import { Label, ListBox, Select } from "@heroui/react";
import { usePlaygroundScope } from "./ComponentPlayground";

export type ControlOption<T extends string> = { key: T; label: string };

/** Typed v3 Select/ListBox control: no old v2 selectedKeys or SelectItem props. */
export function ControlSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly ControlOption<T>[];
  onChange: (next: T) => void;
}) {
  const scope = usePlaygroundScope();
  return (
    <Select
      className="min-w-28 max-w-full"
      value={value}
      onChange={(key) => {
        const option = options.find((option) => option.key === key);
        if (option) onChange(option.key);
      }}
    >
      <Label><span className="font-mono text-xs leading-4 font-normal text-muted">{label}</span></Label>
      <Select.Trigger aria-label={scope.id + ": " + label}>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox items={[...options]}>
          {(option) => (
            <ListBox.Item id={option.key} textValue={option.label}>
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          )}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
