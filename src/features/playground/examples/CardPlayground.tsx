import { useState } from 'react';
import { Button, Card, Chip } from '@heroui/react';
import { MoreHorizontal, Plus } from 'lucide-react';
import { PlaygroundControls, PlaygroundPreview } from '../components/ComponentPlayground';
import { ControlSwitch } from '../components/ControlSwitch';

export function CardPlayground() {
  const [header, setHeader] = useState(true);
  const [footer, setFooter] = useState(true);
  const [muted, setMuted] = useState(false);
  return (
    <>
      <PlaygroundControls>
        <ControlSwitch label="Header" value={header} onChange={setHeader} />
        <ControlSwitch label="Footer" value={footer} onChange={setFooter} />
        <ControlSwitch label="Show details" value={muted} onChange={setMuted} />
      </PlaygroundControls>
      <PlaygroundPreview>
        <Card>
          {header && (
            <Card.Header>
              <div className="flex items-center justify-between gap-3">
                <div><Card.Title>Project Atlas</Card.Title><Card.Description>A sample card.</Card.Description></div>
                <Button isIconOnly variant="ghost" size="sm" aria-label="More options"><MoreHorizontal size={17} /></Button>
              </div>
            </Card.Header>
          )}
          <Card.Content>
            <p className="text-sm text-muted">This card uses the global surface, border, and radius tokens.</p>
            {muted && <p className="mt-2 text-xs text-muted">The surface follows the current theme.</p>}
            <Chip variant="soft" color="success" size="sm">Active</Chip>
          </Card.Content>
          {footer && (
            <Card.Footer>
              <Button variant="primary" size="sm"><Plus size={15} /> New item</Button>
            </Card.Footer>
          )}
        </Card>
      </PlaygroundPreview>
    </>
  );
}
