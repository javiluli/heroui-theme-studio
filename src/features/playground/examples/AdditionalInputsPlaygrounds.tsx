import { useState } from "react";
import {
  Autocomplete,
  Button,
  Checkbox,
  CheckboxGroup,
  ColorSwatchPicker,
  ComboBox,
  Description,
  Fieldset,
  Form,
  Input,
  InputGroup,
  Label,
  ListBox,
  SearchField,
  TextField,
} from "@heroui/react";
import { Search } from "lucide-react";
import {
  PlaygroundControls,
  PlaygroundPreview,
} from "../components/ComponentPlayground";
import { ControlSelect } from "../components/ControlSelect";
import { ControlSwitch } from "../components/ControlSwitch";

const OPTIONS = [
  { id: "design", label: "Design" },
  { id: "frontend", label: "Frontend" },
  { id: "marketing", label: "Marketing" },
];
const VARIANTS = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
] as const;
type Variant = (typeof VARIANTS)[number]["key"];

export function AutocompletePlayground() {
  const [variant, setVariant] = useState<Variant>("secondary");
  const [disabled, setDisabled] = useState(false);
  return (
    <>
      <PlaygroundControls>
        <ControlSelect
          label="Variant"
          value={variant}
          options={VARIANTS}
          onChange={setVariant}
        />
        <ControlSwitch
          label="Disabled"
          value={disabled}
          onChange={setDisabled}
        />
      </PlaygroundControls>
      <PlaygroundPreview>
        <Autocomplete
          variant={variant}
          isDisabled={disabled}
          placeholder="Select a discipline"
        >
          <Label>Discipline</Label>
          <Autocomplete.Trigger>
            <Autocomplete.Value />
            <Autocomplete.ClearButton />
            <Autocomplete.Indicator />
          </Autocomplete.Trigger>
          <Autocomplete.Popover>
            <Autocomplete.Filter>
              <SearchField aria-label="Search disciplines">
                <SearchField.Group>
                  <SearchField.SearchIcon />
                  <SearchField.Input placeholder="Filtrar..." />
                </SearchField.Group>
              </SearchField>
              <ListBox items={OPTIONS}>
                {(option) => (
                  <ListBox.Item id={option.id} textValue={option.label}>
                    {option.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                )}
              </ListBox>
            </Autocomplete.Filter>
          </Autocomplete.Popover>
        </Autocomplete>
      </PlaygroundPreview>
    </>
  );
}

export function ComboBoxPlayground() {
  const [variant, setVariant] = useState<Variant>("secondary");
  const [disabled, setDisabled] = useState(false);
  return (
    <>
      <PlaygroundControls>
        <ControlSelect
          label="Variant"
          value={variant}
          options={VARIANTS}
          onChange={setVariant}
        />
        <ControlSwitch
          label="Disabled"
          value={disabled}
          onChange={setDisabled}
        />
      </PlaygroundControls>
      <PlaygroundPreview>
        <ComboBox variant={variant} isDisabled={disabled}>
          <Label>Specialty</Label>
          <ComboBox.InputGroup>
            <Input placeholder="Search or type" />
            <ComboBox.Trigger />
          </ComboBox.InputGroup>
          <ComboBox.Popover>
            <ListBox items={OPTIONS}>
              {(item) => (
                <ListBox.Item id={item.id} textValue={item.label}>
                  {item.label}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              )}
            </ListBox>
          </ComboBox.Popover>
        </ComboBox>
      </PlaygroundPreview>
    </>
  );
}

export function FieldsetPlayground() {
  const [disabled, setDisabled] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  return (
    <>
      <PlaygroundControls>
        <ControlSwitch
          label="Disabled"
          value={disabled}
          onChange={setDisabled}
        />
      </PlaygroundControls>
      <PlaygroundPreview>
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          <Fieldset disabled={disabled}>
            <Fieldset.Legend>Sample data</Fieldset.Legend>
            <Fieldset.Group>
              <TextField isRequired>
                <Label>Project name</Label>
                <InputGroup variant="secondary">
                  <InputGroup.Prefix>
                    <Search size={16} />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    placeholder="New project"
                    name="project"
                  />
                  <InputGroup.Suffix>.app</InputGroup.Suffix>
                </InputGroup>
              </TextField>
            </Fieldset.Group>
            <Fieldset.Actions>
              <Button type="submit" size="sm" variant="primary">
                Validate example
              </Button>
            </Fieldset.Actions>
          </Fieldset>
        </Form>
        {submitted && (
          <span className="text-xs text-muted">
            The form was processed locally.
          </span>
        )}
      </PlaygroundPreview>
    </>
  );
}

export function CheckboxGroupPlayground() {
  const [disabled, setDisabled] = useState(false);
  const [selected, setSelected] = useState<string[]>(["web"]);
  return (
    <>
      <PlaygroundControls>
        <ControlSwitch
          label="Disabled"
          value={disabled}
          onChange={setDisabled}
        />
      </PlaygroundControls>
      <PlaygroundPreview>
        <CheckboxGroup
          value={selected}
          onChange={setSelected}
          isDisabled={disabled}
        >
          <Label>Platforms</Label>
          <Checkbox value="web">
            <Checkbox.Content>
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              Web
            </Checkbox.Content>
          </Checkbox>
          <Checkbox value="mobile">
            <Checkbox.Content>
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              Mobile
            </Checkbox.Content>
          </Checkbox>
          <Checkbox value="desktop">
            <Checkbox.Content>
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              Desktop
            </Checkbox.Content>
          </Checkbox>
          <Description>
            Seleccionadas: {selected.join(", ") || "ninguna"}
          </Description>
        </CheckboxGroup>
      </PlaygroundPreview>
    </>
  );
}

export function ColorSwatchesPlayground() {
  const [color, setColor] = useState("#8B5CF6");
  const [shape, setShape] = useState<"circle" | "square">("circle");
  const [layout, setLayout] = useState<"grid" | "stack">("grid");
  const colors = ["#8B5CF6", "#F43F5E", "#06B6D4", "#22C55E", "#F59E0B"];
  return (
    <>
      <PlaygroundControls>
        <ControlSelect label="Shape" value={shape} onChange={setShape}
          options={[{ key: "circle", label: "Circle" }, { key: "square", label: "Square" }]} />
        <ControlSelect label="Layout" value={layout} onChange={setLayout}
          options={[{ key: "grid", label: "Grid" }, { key: "stack", label: "Vertical" }]} />
      </PlaygroundControls>
      <PlaygroundPreview>
        <ColorSwatchPicker aria-label="Sample palette" variant={shape} layout={layout}
          value={color}
          onChange={(value) => setColor(value.toString("hex").toUpperCase())}
        >
          {colors.map((hex) => (
            <ColorSwatchPicker.Item key={hex} color={hex}>
              <ColorSwatchPicker.Swatch />
              <ColorSwatchPicker.Indicator />
            </ColorSwatchPicker.Item>
          ))}
        </ColorSwatchPicker>
        <span className="text-xs text-muted">Color de ejemplo: {color}</span>
      </PlaygroundPreview>
    </>
  );
}
