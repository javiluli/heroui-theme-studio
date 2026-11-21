import { useState } from 'react';
import { Tabs } from '@heroui/react';
import { Image, Music2, Video } from 'lucide-react';
import { PlaygroundControls, PlaygroundPreview } from '../components/ComponentPlayground';
import { ControlSelect } from '../components/ControlSelect';
import { ControlSwitch } from '../components/ControlSwitch';

const VARIANTS = [
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
] as const;
type Variant = (typeof VARIANTS)[number]['key'];

export function TabsPlayground() {
  const [variant, setVariant] = useState<Variant>('primary');
  const [disabled, setDisabled] = useState(false);
  const [icons, setIcons] = useState(true);
  return (
    <>
      <PlaygroundControls>
        <ControlSelect label="Variant" value={variant} options={VARIANTS} onChange={setVariant} />
        <ControlSwitch label="Disabled" value={disabled} onChange={setDisabled} />
        <ControlSwitch label="Icons" value={icons} onChange={setIcons} />
      </PlaygroundControls>
      <PlaygroundPreview>
        <div className="w-full min-w-0 max-w-lg">
          <Tabs variant={variant}>
            <Tabs.ListContainer>
              <Tabs.List aria-label="Sample files">
                <Tabs.Tab id="photos" isDisabled={disabled}>
                  <Tabs.Indicator />{icons && <Image size={15} />} Images
                </Tabs.Tab>
                <Tabs.Tab id="music" isDisabled={disabled}>
                  <Tabs.Indicator />{icons && <Music2 size={15} />} Music
                </Tabs.Tab>
                <Tabs.Tab id="videos" isDisabled={disabled}>
                  <Tabs.Indicator />{icons && <Video size={15} />} Video
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>
            <Tabs.Panel id="photos"><div className="p-3 text-sm text-muted">Photo gallery and collections</div></Tabs.Panel>
            <Tabs.Panel id="music"><div className="p-3 text-sm text-muted">Song and album library</div></Tabs.Panel>
            <Tabs.Panel id="videos"><div className="p-3 text-sm text-muted">Video clips and recordings</div></Tabs.Panel>
          </Tabs>
        </div>
      </PlaygroundPreview>
    </>
  );
}
