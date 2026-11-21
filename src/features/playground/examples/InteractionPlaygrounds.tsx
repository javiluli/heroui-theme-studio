import { useState } from 'react';
import {
  AlertDialog, Button, ColorArea, ColorField, ColorPicker, ColorSlider,
  ColorSwatch, Description, Dropdown, InputOTP, Label, ErrorMessage,
  Tag, TagGroup, Drawer,
} from '@heroui/react';
import { MoreHorizontal, MessageCircle, Trash2, Pencil, PanelRight } from 'lucide-react';
import { PlaygroundControls, PlaygroundPreview } from '../components/ComponentPlayground';
import { ControlSelect } from '../components/ControlSelect';
import { CHIP_COLORS, SIZES, type ChipColor, type Size } from '../options';
import { ControlSwitch } from '../components/ControlSwitch';

export function DropdownPlayground() {
  const [lastAction, setLastAction] = useState('None');
  const [disabled, setDisabled] = useState(false);
  return <>
    <PlaygroundControls><ControlSwitch label="Disabled" value={disabled} onChange={setDisabled}/></PlaygroundControls>
    <PlaygroundPreview>
      <Dropdown>
        <Button variant="secondary" isDisabled={disabled}><MoreHorizontal size={16}/> Actions</Button>
        <Dropdown.Popover>
          <Dropdown.Menu onAction={(key) => setLastAction(String(key))}>
            <Dropdown.Item id="edit" textValue="Edit"><Pencil size={15}/> Edit</Dropdown.Item>
            <Dropdown.Item id="share" textValue="Share"><MessageCircle size={15}/> Share</Dropdown.Item>
            <Dropdown.Item id="delete" textValue="Delete"><Trash2 size={15}/> Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
      <span className="text-xs text-muted">Last action: {lastAction}</span>
    </PlaygroundPreview>
  </>;
}

export function ColorPlayground() {
  const [color, setColor] = useState('#7555E8');
  const [placement, setPlacement] = useState<'bottom' | 'top' | 'left' | 'right'>('bottom');
  return <>
    <PlaygroundControls>
      <ControlSelect label="Placement" value={placement} options={edgePlacements} onChange={setPlacement} />
    </PlaygroundControls>
    <PlaygroundPreview>
      <ColorPicker value={color} onChange={(next) => setColor(next.toString('hex').toUpperCase())}>
        <ColorPicker.Trigger>
          <ColorSwatch/>
          <span>{color} · Change</span>
        </ColorPicker.Trigger>
        <ColorPicker.Popover placement={placement}>
          <ColorArea colorSpace="hsb" xChannel="saturation" yChannel="brightness">
            <ColorArea.Thumb/>
          </ColorArea>
          <ColorSlider channel="hue" colorSpace="hsb">
            <ColorSlider.Track><ColorSlider.Thumb/></ColorSlider.Track>
          </ColorSlider>
          <ColorField><Label>HEX</Label><ColorField.Group><ColorField.Input/></ColorField.Group></ColorField>
        </ColorPicker.Popover>
      </ColorPicker>
      <div className="size-10 rounded-[var(--radius)] border border-border" style={{backgroundColor:color}} aria-label={'Sample color ' + color}/>
      <span className="text-xs text-muted">This color applies to the example only. It does not change --accent.</span>
    </PlaygroundPreview>
  </>;
}

export function TagGroupPlayground() {
  const [tags, setTags] = useState(['Design','React','HeroUI']);
  const [size, setSize] = useState<Size>('md');
  const [variant, setVariant] = useState<'default' | 'surface'>('default');
  return <>
    <PlaygroundControls>
      <ControlSelect label="Variant" value={variant} onChange={setVariant}
        options={[{ key: 'default', label: 'Default' }, { key: 'surface', label: 'Surface' }]} />
      <ControlSelect label="Size" value={size} options={SIZES} onChange={setSize} />
    </PlaygroundControls>
    <PlaygroundPreview>
      <TagGroup size={size} variant={variant} onRemove={(keys) => setTags((items) => items.filter((tag) => !keys.has(tag)))}>
        <Label>Tags</Label>
        <TagGroup.List items={tags.map((tag) => ({id:tag,label:tag}))}>
          {(tag) => <Tag id={tag.id} textValue={tag.label}>{tag.label}<Tag.RemoveButton/></Tag>}
        </TagGroup.List>
        <Description>Removing a tag does not change the theme.</Description>
        {!tags.length && <ErrorMessage>Select at least one tag.</ErrorMessage>}
      </TagGroup>
      <Button size="sm" variant="secondary" onPress={() => setTags(['Design','React','HeroUI'])}>Reset</Button>
    </PlaygroundPreview>
  </>;
}

export function InputOTPPlayground() {
  const [disabled, setDisabled] = useState(false);
  const [value, setValue] = useState('');
  const [variant, setVariant] = useState<'primary' | 'secondary'>('primary');
  const [invalid, setInvalid] = useState(false);
  return <>
    <PlaygroundControls>
      <ControlSelect label="Variant" value={variant} onChange={setVariant}
        options={[{ key: 'primary', label: 'Primary' }, { key: 'secondary', label: 'Secondary' }]} />
      <ControlSwitch label="Disabled" value={disabled} onChange={setDisabled} />
      <ControlSwitch label="Invalid" value={invalid} onChange={setInvalid} />
    </PlaygroundControls>
    <PlaygroundPreview>
      <InputOTP aria-label="Verification code" variant={variant} isInvalid={invalid} maxLength={6} value={value} onChange={setValue} isDisabled={disabled}>
        <InputOTP.Group>
          <InputOTP.Slot index={0}/><InputOTP.Slot index={1}/><InputOTP.Slot index={2}/>
        </InputOTP.Group>
        <InputOTP.Separator/>
        <InputOTP.Group>
          <InputOTP.Slot index={3}/><InputOTP.Slot index={4}/><InputOTP.Slot index={5}/>
        </InputOTP.Group>
      </InputOTP>
      <span className="text-xs text-muted">{value.length} / 6 caracteres</span>
    </PlaygroundPreview>
  </>;
}

export function AlertDialogPlayground() {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [status, setStatus] = useState<ChipColor>('danger');
  const [size, setSize] = useState<Size>('md');
  return <>
    <PlaygroundControls>
      <ControlSelect label="State" value={status} options={CHIP_COLORS} onChange={setStatus} />
      <ControlSelect label="Size" value={size} options={SIZES} onChange={setSize} />
    </PlaygroundControls>
    <PlaygroundPreview>
      <Button variant="danger" onPress={() => setOpen(true)}><Trash2 size={16}/> Delete example</Button>
      <AlertDialog.Backdrop isOpen={open} onOpenChange={setOpen}>
          <AlertDialog.Container size={size}>
            <AlertDialog.Dialog>
              <AlertDialog.Header><AlertDialog.Icon status={status} /><AlertDialog.Heading>Delete this item?</AlertDialog.Heading></AlertDialog.Header>
              <AlertDialog.Body>This is a demo confirmation. No item will be deleted.</AlertDialog.Body>
              <AlertDialog.Footer>
                <Button variant="secondary" onPress={() => setOpen(false)}>Cancel</Button>
                <Button variant="danger" onPress={() => { setConfirmed(true); setOpen(false); }}>Confirm</Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
      </AlertDialog.Backdrop>
      {confirmed && <span className="text-xs text-muted">Demo action confirmed.</span>}
    </PlaygroundPreview>
  </>;
}

const edgePlacements = [
  { key: 'right', label: 'Right' }, { key: 'left', label: 'Left' },
  { key: 'bottom', label: 'Bottom' }, { key: 'top', label: 'Top' },
] as const;
const backdropVariants = [
  { key: 'opaque', label: 'Opaque' }, { key: 'blur', label: 'Blurred' },
  { key: 'transparent', label: 'Transparent' },
] as const;

export function DrawerPlayground() {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<(typeof edgePlacements)[number]['key']>('right');
  const [backdrop, setBackdrop] = useState<(typeof backdropVariants)[number]['key']>('opaque');
  return <>
    <PlaygroundControls>
      <ControlSelect label="Placement" value={placement} options={edgePlacements} onChange={setPlacement} />
      <ControlSelect label="Background" value={backdrop} options={backdropVariants} onChange={setBackdrop} />
    </PlaygroundControls>
    <PlaygroundPreview>
      <Button variant="secondary" onPress={() => setOpen(true)}><PanelRight size={16}/> Open drawer</Button>
      <Drawer.Backdrop variant={backdrop} isOpen={open} onOpenChange={setOpen}>
          <Drawer.Content placement={placement}>
            <Drawer.Dialog>
            <Drawer.Header><Drawer.Heading>Project information</Drawer.Heading></Drawer.Header>
            <Drawer.Body><p>Este panel usa el Drawer disponible en @heroui/react.</p></Drawer.Body>
            <Drawer.Footer><Button variant="primary" onPress={() => setOpen(false)}>Close</Button></Drawer.Footer>
            </Drawer.Dialog>
          </Drawer.Content>
      </Drawer.Backdrop>
    </PlaygroundPreview>
  </>;
}
