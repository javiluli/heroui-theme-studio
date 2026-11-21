import { useState } from 'react';
import { Input, Label, TextField, Description } from '@heroui/react';
import { PlaygroundControls, PlaygroundPreview } from '../components/ComponentPlayground';
import { ControlSelect } from '../components/ControlSelect';
import { ControlSwitch } from '../components/ControlSwitch';

const INPUT_VARIANTS = [
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
] as const;
type InputVariant = (typeof INPUT_VARIANTS)[number]['key'];

export function InputPlayground() {
  const [variant, setVariant] = useState<InputVariant>('primary');
  const [disabled, setDisabled] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [required, setRequired] = useState(false);
  const [value, setValue] = useState('alex@heroui.com');

  return (
    <>
      <PlaygroundControls>
        <ControlSelect label="Variant" value={variant} options={INPUT_VARIANTS} onChange={setVariant} />
        <ControlSwitch label="Disabled" value={disabled} onChange={setDisabled} />
        <ControlSwitch label="Invalid" value={invalid} onChange={setInvalid} />
        <ControlSwitch label="Required" value={required} onChange={setRequired} />
      </PlaygroundControls>
      <PlaygroundPreview>
        <TextField isDisabled={disabled} isInvalid={invalid} isRequired={required}>
          <Label>Email</Label>
          <Input variant={variant} placeholder="tu@email.com" value={value}
            onChange={(event) => setValue(event.target.value)} />
          <Description>{invalid ? 'Check the email format.' : 'This is an interactive form field.'}</Description>
        </TextField>
        <small className="text-xs text-muted">Valor: {value || '(empty)'}</small>
      </PlaygroundPreview>
    </>
  );
}
