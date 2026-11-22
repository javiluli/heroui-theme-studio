import { Label, Select } from "heroui-native";

export type PreviewOption = { label: string; value: string };

export function PreviewSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly PreviewOption[];
  value?: PreviewOption;
  onChange: (value?: PreviewOption) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <Label>{label}</Label>
      <Select.Trigger accessibilityLabel={label}>
        <Select.Value placeholder="Select one" />
        <Select.TriggerIndicator />
      </Select.Trigger>
      <Select.Portal>
        <Select.Overlay />
        <Select.Content presentation="popover" width="trigger">
          {options.map((option) => (
            <Select.Item key={option.value} {...option} />
          ))}
        </Select.Content>
      </Select.Portal>
    </Select>
  );
}
