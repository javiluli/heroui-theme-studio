import { useState } from 'react';
import { Chip } from '@heroui/react';
import { PlaygroundControls, PlaygroundPreview } from '../components/ComponentPlayground';
import { ControlSelect } from '../components/ControlSelect';
import { CHIP_COLORS, CHIP_VARIANTS, SIZES, type ChipColor, type ChipVariant, type Size } from '../options';

export function ChipPlayground() {
  const [variant, setVariant] = useState<ChipVariant>('soft');
  const [color, setColor] = useState<ChipColor>('accent');
  const [size, setSize] = useState<Size>('md');
  return (
    <>
      <PlaygroundControls>
        <ControlSelect label="Color" value={color} options={CHIP_COLORS} onChange={setColor} />
        <ControlSelect label="Variant" value={variant} options={CHIP_VARIANTS} onChange={setVariant} />
        <ControlSelect label="Size" value={size} options={SIZES} onChange={setSize} />
      </PlaygroundControls>
      <PlaygroundPreview>
        <Chip variant={variant} color={color} size={size}>
          <Chip.Label>{color} / {variant}</Chip.Label>
        </Chip>
        {CHIP_COLORS.map(({ key }) => (
          <Chip key={key} variant={variant} color={key} size={size}>
            <Chip.Label>{key}</Chip.Label>
          </Chip>
        ))}
      </PlaygroundPreview>
    </>
  );
}
