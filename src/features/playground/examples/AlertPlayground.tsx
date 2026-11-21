import { useState } from 'react';
import { Alert } from '@heroui/react';
import { PlaygroundControls, PlaygroundPreview } from '../components/ComponentPlayground';
import { ControlSelect } from '../components/ControlSelect';
import { ControlSwitch } from '../components/ControlSwitch';

const STATUSES = [
  { key: 'accent', label: 'Accent' },
  { key: 'success', label: 'Success' },
  { key: 'warning', label: 'Warning' },
  { key: 'danger', label: 'Danger' },
] as const;
type Status = (typeof STATUSES)[number]['key'];

export function AlertPlayground() {
  const [status, setStatus] = useState<Status>('success');
  const [indicator, setIndicator] = useState(true);
  const [description, setDescription] = useState(true);
  return (
    <>
      <PlaygroundControls>
        <ControlSelect label="State" value={status} options={STATUSES} onChange={setStatus} />
        <ControlSwitch label="Indicator" value={indicator} onChange={setIndicator} />
        <ControlSwitch label="Description" value={description} onChange={setDescription} />
      </PlaygroundControls>
      <PlaygroundPreview>
        <Alert status={status}>
          {indicator && <Alert.Indicator />}
          <Alert.Content>
            <Alert.Title>State: {status}</Alert.Title>
            {description && <Alert.Description>
              Change the global theme colors or the local state to compare.
            </Alert.Description>}
          </Alert.Content>
        </Alert>
      </PlaygroundPreview>
    </>
  );
}
