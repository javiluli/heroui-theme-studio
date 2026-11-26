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
      <Switch.Content className="min-h-6 w-full justify-between">
        <Label><span className="font-mono text-xs leading-4 font-normal text-muted">{label}</span></Label>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Content>
    </Switch>
  );
}
