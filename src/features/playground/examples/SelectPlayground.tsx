import { useState } from 'react';
import { Label, ListBox, Select } from '@heroui/react';
import { PlaygroundControls, PlaygroundPreview } from '../components/ComponentPlayground';
import { ControlSwitch } from '../components/ControlSwitch';

const animals = [
  { id: 'cat', label: 'Cat' },
  { id: 'dog', label: 'Dog' },
  { id: 'bird', label: 'Bird' },
  { id: 'fox', label: 'Fox' },
];

export function SelectPlayground() {
  const [disabled, setDisabled] = useState(false);
  const [selected, setSelected] = useState<string>('cat');
  return (
    <>
      <PlaygroundControls>
        <ControlSwitch label="Disabled" value={disabled} onChange={setDisabled} />
      </PlaygroundControls>
      <PlaygroundPreview>
        <Select selectedKey={selected} isDisabled={disabled}
          onSelectionChange={(key) => { if (key) setSelected(String(key)); }} placeholder="Select an animal">
          <Label>Favorite animal</Label>
          <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
          <Select.Popover>
            <ListBox items={animals}>
              {(animal) => <ListBox.Item id={animal.id} textValue={animal.label}>
                {animal.label}<ListBox.ItemIndicator />
              </ListBox.Item>}
            </ListBox>
          </Select.Popover>
        </Select>
        <small className="text-xs text-muted">Selection: {animals.find((a) => a.id === selected)?.label ?? 'None'}</small>
      </PlaygroundPreview>
    </>
  );
}
