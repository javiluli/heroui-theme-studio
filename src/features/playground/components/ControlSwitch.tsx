import { Label, Switch } from "@heroui/react";

export function ControlSwitch({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <Switch isSelected={value} onChange={onChange}>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Content>
        <Label>{label}</Label>
      </Switch.Content>
    </Switch>
  );
}
