import { useState } from "react";
import {
  Button, ColorField, Description,
  ErrorMessage, FieldError, Form, Input, InputGroup, Label,
  SearchField, Tag, TagGroup, TextArea, TextField,
} from "@heroui/react";
import { configuredExample, fieldStateProps, DISABLED, FIELD_STATES, FIELD_VARIANTS } from "../components/configured-example";
import { PlaygroundPreview } from "../components/ComponentPlayground";

export const ColorFieldExample = configuredExample({ Variant: FIELD_VARIANTS, State: FIELD_STATES },
  ({ Variant, State }) => (
    <ColorField defaultValue="#3978BF" {...fieldStateProps(State)}>
      <Label>Project color</Label>
      <ColorField.Group variant={Variant}><ColorField.Input /></ColorField.Group>
      <FieldError>Enter a valid color.</FieldError>
    </ColorField>
  ));

export const DescriptionExample = configuredExample({}, () => (
  <TextField>
    <Label>Display name</Label><Input placeholder="e.g. North Studio" />
    <Description>This is how your name will appear in the project.</Description>
  </TextField>
));

export function ErrorMessageExample() {
  const [selected, setSelected] = useState<Iterable<string | number>>([]);
  return (
    <PlaygroundPreview>
      <TagGroup selectionMode="multiple" selectedKeys={selected} onSelectionChange={setSelected}>
        <Label>Topics of interest</Label>
        <TagGroup.List><Tag id="ui">Interface</Tag><Tag id="code">Code</Tag></TagGroup.List>
        {Array.from(selected).length === 0 && <ErrorMessage>Select at least one topic.</ErrorMessage>}
      </TagGroup>
    </PlaygroundPreview>
  );
}

export const FieldErrorExample = configuredExample({ "Show error": ["on", "off"] },
  ({ "Show error": error }) => (
    <TextField isInvalid={error === "on"} defaultValue="AB">
      <Label>Project code</Label><Input />
      <FieldError>The code must be at least three characters long.</FieldError>
    </TextField>
  ));

export function FormExample() {
  const [result, setResult] = useState("");
  return (
    <PlaygroundPreview>
      <Form onSubmit={(event) => {
        event.preventDefault();
        const name = new FormData(event.currentTarget).get("name");
        setResult(`Formulario enviado: ${name}`);
      }}>
        <TextField name="name" isRequired>
          <Label>Name</Label><Input placeholder="Sample name" /><FieldError />
        </TextField>
        <Button type="submit" variant="primary">Submit example</Button>
        <output>{result}</output>
      </Form>
    </PlaygroundPreview>
  );
}

export const InputGroupExample = configuredExample({ Variant: FIELD_VARIANTS, State: FIELD_STATES },
  ({ Variant, State }) => (
    <TextField {...fieldStateProps(State)} defaultValue="12">
      <Label>Price</Label>
      <InputGroup variant={Variant}>
        <InputGroup.Prefix>€</InputGroup.Prefix><InputGroup.Input type="number" />
      </InputGroup>
      <FieldError>Check the price.</FieldError>
    </TextField>
  ));

export const LabelExample = configuredExample({ State: FIELD_STATES, Required: DISABLED },
  ({ State, Required }) => (
    <TextField {...fieldStateProps(State)} isRequired={Required === "on"}>
      <Label>Team name</Label><Input placeholder="e.g. Design" />
    </TextField>
  ));

export const SearchFieldExample = configuredExample({ Variant: FIELD_VARIANTS, State: FIELD_STATES },
  ({ Variant, State }) => (
    <SearchField {...fieldStateProps(State)} variant={Variant}>
      <Label>Search</Label>
      <SearchField.Group>
        <SearchField.SearchIcon /><SearchField.Input placeholder="Project name" /><SearchField.ClearButton />
      </SearchField.Group>
      <FieldError>Enter a valid search query.</FieldError>
    </SearchField>
  ));

export const TextAreaExample = configuredExample({ Variant: FIELD_VARIANTS, State: FIELD_STATES, Filas: ["3", "5"] },
  ({ Variant, State, Filas }) => (
    <TextField {...fieldStateProps(State)}>
      <Label>Notes</Label><TextArea variant={Variant} rows={Number(Filas)} placeholder="Write a note" />
      <FieldError>Check the note content.</FieldError>
    </TextField>
  ));

export const TextFieldExample = configuredExample({ State: FIELD_STATES, Required: DISABLED },
  ({ State, Required }) => (
    <TextField {...fieldStateProps(State)} isRequired={Required === "on"}>
      <Label>Username</Label><Input placeholder="e.g. alex" />
      <Description>Use at least three characters.</Description><FieldError>Check the name.</FieldError>
    </TextField>
  ));
