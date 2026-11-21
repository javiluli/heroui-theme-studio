import { useState } from 'react';
import { Checkbox } from '@heroui/react';
import { PlaygroundControls, PlaygroundPreview } from '../components/ComponentPlayground';
import { ControlSwitch } from '../components/ControlSwitch';

export function CheckboxPlayground() {
  const [selected, setSelected] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [invalid, setInvalid] = useState(false);
  return (
    <>
      <PlaygroundControls>
        <ControlSwitch label="Selected" value={selected} onChange={setSelected} />
        <ControlSwitch label="Disabled" value={disabled} onChange={setDisabled} />
        <ControlSwitch label="Invalid" value={invalid} onChange={setInvalid} />
      </PlaygroundControls>
      <PlaygroundPreview>
        <Checkbox isSelected={selected} onChange={setSelected} isDisabled={disabled} isInvalid={invalid}>
          <Checkbox.Content>
            <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
            Enable preferences
          </Checkbox.Content>
        </Checkbox>
        <Checkbox defaultSelected isDisabled>
          <Checkbox.Content><Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>Read-only example</Checkbox.Content>
        </Checkbox>
      </PlaygroundPreview>
    </>
  );
}
