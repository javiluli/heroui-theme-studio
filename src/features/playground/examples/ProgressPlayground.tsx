import { useState } from 'react';
import { Label, ProgressBar, Slider } from '@heroui/react';
import { PlaygroundControls, PlaygroundPreview } from '../components/ComponentPlayground';
import { ControlSwitch } from '../components/ControlSwitch';
import { ControlSelect } from '../components/ControlSelect';
import { CHIP_COLORS, SIZES, type ChipColor, type Size } from '../options';

export function ProgressPlayground() {
  const [color, setColor] = useState<ChipColor>('accent');
  const [size, setSize] = useState<Size>('md');
  const [progress, setProgress] = useState(65);
  const [indeterminate, setIndeterminate] = useState(false);
  return (
    <>
      <PlaygroundControls>
        <ControlSelect label="Color" value={color} options={CHIP_COLORS} onChange={setColor} />
        <ControlSelect label="Size" value={size} options={SIZES} onChange={setSize} />
        <ControlSwitch label="Indeterminate" value={indeterminate} onChange={setIndeterminate} />
      </PlaygroundControls>
      <PlaygroundPreview>
        <div className="flex w-full flex-col gap-3">
          <ProgressBar color={color} size={size} value={progress} isIndeterminate={indeterminate}>
            <Label>Upload complete</Label>
            <ProgressBar.Output />
            <ProgressBar.Track><ProgressBar.Fill /></ProgressBar.Track>
          </ProgressBar>
          <Slider aria-label="Progress value" isDisabled={indeterminate} minValue={0} maxValue={100} value={progress}
            onChange={(value) => setProgress(Array.isArray(value) ? value[0] : value)}>
            <Slider.Track><Slider.Fill /><Slider.Thumb /></Slider.Track>
          </Slider>
        </div>
      </PlaygroundPreview>
    </>
  );
}
