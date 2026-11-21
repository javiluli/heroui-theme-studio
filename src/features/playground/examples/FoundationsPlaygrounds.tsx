import { useState } from "react";
import {
  Accordion,
  Avatar,
  Badge,
  Breadcrumbs,
  Chip,
  FieldError,
  Input,
  Kbd,
  Label,
  Meter,
  NumberField,
  Radio,
  RadioGroup,
  Separator,
  Surface,
  Table,
  TextField,
  Typography,
} from "@heroui/react";
import {
  PlaygroundControls,
  PlaygroundPreview,
} from "../components/ComponentPlayground";
import { ControlSelect } from "../components/ControlSelect";
import { ControlSwitch } from "../components/ControlSwitch";
import { SIZES, type Size } from "../options";

const COLORS = [
  { key: "default", label: "Default" },
  { key: "accent", label: "Accent" },
  { key: "success", label: "Success" },
  { key: "warning", label: "Warning" },
  { key: "danger", label: "Danger" },
] as const;
type Color = (typeof COLORS)[number]["key"];

export function AvatarBadgePlayground() {
  const [size, setSize] = useState<Size>("md");
  const [color, setColor] = useState<Color>("accent");
  const [variant, setVariant] = useState<"default" | "soft">("default");
  return (
    <>
      <PlaygroundControls>
        <ControlSelect
          label="Size"
          value={size}
          options={SIZES}
          onChange={setSize}
        />
        <ControlSelect
          label="Color"
          value={color}
          options={COLORS}
          onChange={setColor}
        />
        <ControlSelect label="Variant" value={variant} onChange={setVariant}
          options={[{ key: "default", label: "Default" }, { key: "soft", label: "Soft" }]} />
      </PlaygroundControls>
      <PlaygroundPreview>
        <Avatar size={size} color={color} variant={variant}>
          <Avatar.Fallback>AG</Avatar.Fallback>
        </Avatar>
        <Avatar size={size} color={color} variant={variant}>
          <Avatar.Fallback>JD</Avatar.Fallback>
        </Avatar>
        <Badge.Anchor>
          <Avatar size={size} color={color} variant={variant}>
            <Avatar.Fallback>LM</Avatar.Fallback>
          </Avatar>
          <Badge color="danger">5</Badge>
        </Badge.Anchor>

      </PlaygroundPreview>
    </>
  );
}

const FIELD_VARIANTS = [{ key: "primary", label: "Primary" }, { key: "secondary", label: "Secondary" }] as const;
const ORIENTATIONS = [{ key: "vertical", label: "Vertical" }, { key: "horizontal", label: "Horizontal" }] as const;

export function FormChoicesPlayground() {
  const [choice, setChoice] = useState("weekly");
  const [disabled, setDisabled] = useState(false);
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("vertical");
  return (
    <>
      <PlaygroundControls>
        <ControlSwitch label="Disabled" value={disabled} onChange={setDisabled} />
        <ControlSelect label="Orientation" value={orientation} options={ORIENTATIONS} onChange={setOrientation} />
      </PlaygroundControls>
      <PlaygroundPreview>
        <RadioGroup orientation={orientation} value={choice} onChange={setChoice} isDisabled={disabled}>
          <Label>Frequency</Label>
          {[["daily", "Daily"], ["weekly", "Weekly"]].map(([value, label]) => (
            <Radio key={value} value={value}>
              <Radio.Content>
                <Radio.Control><Radio.Indicator /></Radio.Control>
                {label}
              </Radio.Content>
            </Radio>
          ))}
        </RadioGroup>
      </PlaygroundPreview>
    </>
  );
}

export function TextFieldsPlayground() {
  const [disabled, setDisabled] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [amount, setAmount] = useState(12);
  const [variant, setVariant] = useState<"primary" | "secondary">("primary");
  return (
    <>
      <PlaygroundControls>
        <ControlSelect label="Variant" value={variant} options={FIELD_VARIANTS} onChange={setVariant} />
        <ControlSwitch label="Disabled" value={disabled} onChange={setDisabled} />
        <ControlSwitch label="Invalid" value={invalid} onChange={setInvalid} />
      </PlaygroundControls>
      <PlaygroundPreview>
        <NumberField variant={variant} value={amount} minValue={0} maxValue={100}
          onChange={setAmount} isDisabled={disabled} isInvalid={invalid}>
          <Label>Amount</Label>
          <NumberField.Group>
            <NumberField.DecrementButton />
            <NumberField.Input />
            <NumberField.IncrementButton />
          </NumberField.Group>
          <FieldError>Check the amount.</FieldError>
        </NumberField>
      </PlaygroundPreview>
    </>
  );
}

export function StatusPlayground() {
  const [color, setColor] = useState<Color>("accent");
  const [size, setSize] = useState<Size>("md");
  const [value, setValue] = useState(68);
  return (
    <>
      <PlaygroundControls>
        <ControlSelect label="Color" value={color} options={COLORS} onChange={setColor} />
        <ControlSelect label="Size" value={size} options={SIZES} onChange={setSize} />
      </PlaygroundControls>
      <PlaygroundPreview>
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Meter value={value} color={color} size={size}>
            <Label>Storage used</Label>
            <Meter.Output />
            <Meter.Track><Meter.Fill /></Meter.Track>
          </Meter>
          <input type="range" min={0} max={100} value={value}
            onChange={(event) => setValue(Number(event.target.value))} aria-label="Adjust meter value" />
        </div>
      </PlaygroundPreview>
    </>
  );
}

export function NavigationPlayground() {
  const [disabled, setDisabled] = useState(false);
  return (
    <>
      <PlaygroundControls>
        <ControlSwitch label="Disabled" value={disabled} onChange={setDisabled} />
      </PlaygroundControls>
      <PlaygroundPreview>
        <Breadcrumbs isDisabled={disabled}>
          <Breadcrumbs.Item href="#example-breadcrumbs">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#example-breadcrumbs">Projects</Breadcrumbs.Item>
          <Breadcrumbs.Item>Design</Breadcrumbs.Item>
        </Breadcrumbs>
      </PlaygroundPreview>
    </>
  );
}

const MEMBERS = [
  { id: "1", name: "Lucía Martínez", role: "Design", status: "Active" },
  { id: "2", name: "Carlos Ruiz", role: "Frontend", status: "Active" },
  { id: "3", name: "Ana Pérez", role: "Marketing", status: "Pending" },
  { id: "4", name: "David Jiménez", role: "Backend", status: "Active" },
];
export function TablePlayground() {
  const [query, setQuery] = useState("");
  const [variant, setVariant] = useState<"primary" | "secondary">("secondary");
  const rows = MEMBERS.filter((row) =>
    row.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <PlaygroundControls>
        <ControlSelect
          label="Variant"
          value={variant}
          options={
            [
              { key: "primary", label: "Primary" },
              { key: "secondary", label: "Secondary" },
            ] as const
          }
          onChange={setVariant}
        />
        <TextField>
          <Label>Search people</Label>
          <Input
            variant="secondary"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter people…"
          />
        </TextField>
      </PlaygroundControls>
      <PlaygroundPreview>
      <div className="w-full min-w-0">
        <Table variant={variant}>
          <Table.ScrollContainer>
            <Table.Content aria-label="Sample team members">
              <Table.Header>
                <Table.Column isRowHeader>Name</Table.Column>
                <Table.Column>Role</Table.Column>
                <Table.Column>State</Table.Column>
              </Table.Header>
              <Table.Body
                items={rows}
                renderEmptyState={() => <p>No results found.</p>}
              >
                {(member) => (
                  <Table.Row id={member.id}>
                    <Table.Cell>{member.name}</Table.Cell>
                    <Table.Cell>{member.role}</Table.Cell>
                    <Table.Cell>
                      <Chip
                        size="sm"
                        color={
                          member.status === "Active" ? "success" : "warning"
                        }
                        variant="soft"
                      >
                        {member.status}
                      </Chip>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
      </PlaygroundPreview>
    </>
  );
}

export function LayoutPlayground() {
  const [variant, setVariant] = useState<"default" | "secondary" | "tertiary" | "transparent">("default");
  return (
    <>
      <PlaygroundControls>
        <ControlSelect label="Variant" value={variant} onChange={setVariant} options={[
          { key: "default", label: "Default" }, { key: "secondary", label: "Secondary" },
          { key: "tertiary", label: "Tertiary" }, { key: "transparent", label: "Transparent" },
        ]} />
      </PlaygroundControls>
      <PlaygroundPreview>
          <Surface variant={variant}>
            <div className="flex flex-col gap-3">
              <Typography type="h4">Sample heading</Typography>
              <Typography type="body">
                Text using the global theme typography.
              </Typography>
              <Separator />
              <div>
                Shortcut <Kbd>⌘</Kbd> <Kbd>K</Kbd>
              </div>
            </div>
          </Surface>
      </PlaygroundPreview>
    </>
  );
}

export function AccordionPlayground() {
  const [variant, setVariant] = useState<"surface" | "default">("surface");
  return (
    <>
      <PlaygroundControls>
        <ControlSelect
          label="Variant"
          value={variant}
          options={
            [
              { key: "surface", label: "Surface" },
              { key: "default", label: "Default" },
            ] as const
          }
          onChange={setVariant}
        />
      </PlaygroundControls>
      <PlaygroundPreview>
        <Accordion variant={variant} defaultExpandedKeys={["a"]}>
          <Accordion.Item id="a">
            <Accordion.Heading>
              <Accordion.Trigger>
                How is the theme customized?
                <Accordion.Indicator />
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body>
                HeroUI v3 CSS variables are applied to the document root.
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item id="b">
            <Accordion.Heading>
              <Accordion.Trigger>
                Does it work in dark mode?
                <Accordion.Indicator />
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body>
                Yes. Light and dark modes each have their own variables.
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </PlaygroundPreview>
    </>
  );
}
