import {
  Accordion,
  Alert,
  Avatar,
  BottomSheet,
  Button,
  Card,
  Checkbox,
  Chip,
  CloseButton,
  ControlField,
  Description,
  Dialog,
  FieldError,
  Input,
  InputGroup,
  InputOTP,
  Label,
  LinkButton,
  ListGroup,
  Menu,
  Popover,
  PressableFeedback,
  RadioGroup,
  ScrollShadow,
  SearchField,
  Select,
  Separator,
  Skeleton,
  SkeletonGroup,
  Slider,
  Spinner,
  Surface,
  Switch,
  Tabs,
  TagGroup,
  TextArea,
  TextField,
  Typography,
  useToast,
} from "heroui-native";
import { useState, type ComponentType } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Linking, ScrollView, View } from "react-native";

function ButtonExample() {
  const [pressed, setPressed] = useState(false);
  return (
    <View className="gap-3">
      <View className="flex-row flex-wrap gap-2">
        <Button onPress={() => setPressed((value) => !value)}>
          {pressed ? "Enabled" : "Primary"}
        </Button>
        <Button variant="secondary" onPress={() => setPressed(false)}>
          Secondary
        </Button>
        <Button variant="outline" isDisabled>
          Disabled
        </Button>
      </View>
    </View>
  );
}

function CheckboxExample() {
  const [selected, setSelected] = useState(false);
  return (
    <Checkbox
      accessibilityLabel="Accept terms"
      isSelected={selected}
      onSelectedChange={setSelected}
    />
  );
}

function SwitchExample() {
  const [selected, setSelected] = useState(true);
  return (
    <Switch
      accessibilityLabel="Notifications"
      isSelected={selected}
      onSelectedChange={setSelected}
    />
  );
}

function ControlFieldExample() {
  const [selected, setSelected] = useState(true);
  return (
    <ControlField isSelected={selected} onSelectedChange={setSelected}>
      <View className="flex-1">
        <Label>Notifications</Label>
        <Description>Project updates</Description>
      </View>
      <ControlField.Indicator />
    </ControlField>
  );
}

function CloseButtonExample() {
  const [open, setOpen] = useState(true);
  return open ? (
    <View className="flex-row items-center justify-between">
      <Typography>Sample notification</Typography>
      <CloseButton
        accessibilityLabel="Dismiss notification"
        onPress={() => setOpen(false)}
      />
    </View>
  ) : (
    <Button size="sm" variant="secondary" onPress={() => setOpen(true)}>
      Show again
    </Button>
  );
}

function RadioExample() {
  const [value, setValue] = useState("weekly");
  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <RadioGroup.Item value="daily">Daily</RadioGroup.Item>
      <RadioGroup.Item value="weekly">Weekly</RadioGroup.Item>
    </RadioGroup>
  );
}

function SearchExample() {
  const [query, setQuery] = useState("");
  return (
    <SearchField value={query} onChange={setQuery}>
      <SearchField.Group>
        <SearchField.SearchIcon />
        <SearchField.Input
          placeholder="Search projects"
          accessibilityLabel="Search projects"
        />
        <SearchField.ClearButton />
      </SearchField.Group>
    </SearchField>
  );
}

function SelectExample() {
  const [value, setValue] = useState<{ label: string; value: string }>();
  return (
    <Select value={value} onValueChange={setValue}>
      <Select.Trigger>
        <Select.Value placeholder="Select a city" />
        <Select.TriggerIndicator />
      </Select.Trigger>
      <Select.Portal>
        <Select.Overlay />
        <Select.Content presentation="popover" width="trigger">
          <Select.Item label="Madrid" value="madrid" />
          <Select.Item label="Valencia" value="valencia" />
        </Select.Content>
      </Select.Portal>
    </Select>
  );
}

function TabsExample() {
  const [tab, setTab] = useState("general");
  return (
    <Tabs value={tab} onValueChange={setTab}>
      <Tabs.List>
        <Tabs.ScrollView>
          <Tabs.Indicator />
          <Tabs.Trigger value="general">
            <Tabs.Label>General</Tabs.Label>
          </Tabs.Trigger>
          <Tabs.Trigger value="profile">
            <Tabs.Label>Profile</Tabs.Label>
          </Tabs.Trigger>
        </Tabs.ScrollView>
      </Tabs.List>
      <Tabs.Content value="general">
        <Typography>Project preferences</Typography>
      </Tabs.Content>
      <Tabs.Content value="profile">
        <Typography>Profile details</Typography>
      </Tabs.Content>
    </Tabs>
  );
}

function ToastExample() {
  const { toast } = useToast();
  return (
    <Button
      onPress={() => toast.show({ variant: "success", label: "Theme saved" })}
    >
      Show notification
    </Button>
  );
}

export const nativeExamples = {
  Accordion: () => (
    <Accordion>
      <Accordion.Item value="detail">
        <Accordion.Trigger>
          <Typography>Project details</Typography>
          <Accordion.Indicator />
        </Accordion.Trigger>
        <Accordion.Content>
          <Typography>This panel uses the active theme.</Typography>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
  Alert: () => (
    <Alert status="success">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Changes saved</Alert.Title>
        <Alert.Description>Your theme is ready.</Alert.Description>
      </Alert.Content>
    </Alert>
  ),
  Avatar: () => (
    <View className="flex-row gap-2">
      <Avatar>
        <Avatar.Fallback>LM</Avatar.Fallback>
      </Avatar>
      <Avatar color="accent">
        <Avatar.Fallback>AG</Avatar.Fallback>
      </Avatar>
    </View>
  ),
  BottomSheet: () => (
    <BottomSheet>
      <BottomSheet.Trigger asChild>
        <Button>Show sheet</Button>
      </BottomSheet.Trigger>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content enableDynamicSizing={false} snapPoints={["38%"]}>
          <BottomSheet.Close />
          <BottomSheet.Title>Theme details</BottomSheet.Title>
          <BottomSheet.Description>
            A sample bottom sheet.
          </BottomSheet.Description>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  ),
  Button: ButtonExample,
  Card: () => (
    <Card>
      <Card.Body>
        <Card.Title>Project theme</Card.Title>
        <Card.Description>
          The background uses the surface token.
        </Card.Description>
      </Card.Body>
    </Card>
  ),
  Checkbox: CheckboxExample,
  Chip: () => (
    <View className="flex-row flex-wrap gap-2">
      <Chip>New</Chip>
      <Chip variant="soft" color="success">
        Done
      </Chip>
      <Chip variant="soft" color="warning">
        Pending
      </Chip>
    </View>
  ),
  CloseButton: CloseButtonExample,
  ControlField: ControlFieldExample,
  Description: () => (
    <Description>The name will appear in the project.</Description>
  ),
  Dialog: () => (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button>Open dialog</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Close />
          <Dialog.Title>Confirm changes</Dialog.Title>
          <Dialog.Description>
            This dialog uses the theme colors.
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  ),
  FieldError: () => (
    <FieldError isInvalid>Enter a valid code.</FieldError>
  ),
  Input: () => (
    <Input
      placeholder="Project name"
      accessibilityLabel="Project name"
    />
  ),
  InputGroup: () => (
    <InputGroup>
      <InputGroup.Prefix>
        <Typography>€</Typography>
      </InputGroup.Prefix>
      <InputGroup.Input
        placeholder="12,00"
        accessibilityLabel="Price"
        keyboardType="decimal-pad"
      />
    </InputGroup>
  ),
  InputOTP: () => (
    <InputOTP
      maxLength={4}
      textInputProps={{ accessibilityLabel: "Verification code" }}
    >
      <InputOTP.Group>
        {[0, 1, 2, 3].map((index) => (
          <InputOTP.Slot key={index} index={index} />
        ))}
      </InputOTP.Group>
    </InputOTP>
  ),
  Label: () => <Label isRequired>Username</Label>,
  LinkButton: () => (
    <LinkButton
      onPress={() =>
        void Linking.openURL(
          "https://heroui.com/en/docs/native/components/link-button",
        )
      }
    >
      Documentation
    </LinkButton>
  ),
  ListGroup: () => (
    <ListGroup>
      <ListGroup.Item>
        <ListGroup.ItemContent>
          <ListGroup.ItemTitle>Design team</ListGroup.ItemTitle>
          <ListGroup.ItemDescription>3 collaborators</ListGroup.ItemDescription>
        </ListGroup.ItemContent>
      </ListGroup.Item>
    </ListGroup>
  ),
  Menu: () => (
    <Menu>
      <Menu.Trigger asChild>
        <Button variant="secondary">Actions</Button>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Overlay />
        <Menu.Content presentation="popover" width={210}>
          <Menu.Item id="edit">
            <Menu.ItemTitle>Edit</Menu.ItemTitle>
          </Menu.Item>
          <Menu.Item id="duplicate">
            <Menu.ItemTitle>Duplicate</Menu.ItemTitle>
          </Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu>
  ),
  Popover: () => (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="secondary">View details</Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Overlay />
        <Popover.Content presentation="popover" width={235}>
          <Popover.Title>More information</Popover.Title>
          <Popover.Description>
            Overlay preview.
          </Popover.Description>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  ),
  PressableFeedback: () => (
    <PressableFeedback
      accessibilityRole="button"
      className="rounded-xl bg-surface p-3"
    >
      <PressableFeedback.Highlight />
      <Typography>Press to see the visual feedback</Typography>
    </PressableFeedback>
  ),
  RadioGroup: RadioExample,
  ScrollShadow: () => (
    <ScrollShadow
      LinearGradientComponent={LinearGradient}
      size={22}
      className="h-24"
    >
      <ScrollView nestedScrollEnabled>
        {["Design", "Typography", "Color", "Controls", "Navigation"].map(
          (label) => (
            <View key={label} className="py-2">
              <Typography>{label}</Typography>
            </View>
          ),
        )}
      </ScrollView>
    </ScrollShadow>
  ),
  SearchField: SearchExample,
  Select: SelectExample,
  Separator: () => (
    <View className="gap-2">
      <Typography>Account</Typography>
      <Separator />
      <Typography>Preferences</Typography>
    </View>
  ),
  Skeleton: () => <Skeleton className="h-6 w-44 rounded-md" />,
  SkeletonGroup: () => (
    <SkeletonGroup isLoading>
      <View className="gap-2">
        <SkeletonGroup.Item className="h-6 w-44 rounded-md" />
        <SkeletonGroup.Item className="h-4 w-36 rounded-md" />
      </View>
    </SkeletonGroup>
  ),
  Slider: () => (
    <Slider defaultValue={40}>
      <Slider.Output />
      <Slider.Track>
        <Slider.Fill />
        <Slider.Thumb />
      </Slider.Track>
    </Slider>
  ),
  Spinner: () => <Spinner accessibilityLabel="Loading data" />,
  Surface: () => (
    <Surface variant="secondary" className="p-4">
      <Typography>Secondary surface</Typography>
    </Surface>
  ),
  Switch: SwitchExample,
  Tabs: TabsExample,
  TagGroup: () => (
    <TagGroup selectionMode="multiple">
      <TagGroup.List>
        <TagGroup.Item id="design">Design</TagGroup.Item>
        <TagGroup.Item id="code">Code</TagGroup.Item>
      </TagGroup.List>
    </TagGroup>
  ),
  TextArea: () => (
    <TextArea placeholder="Write a note" accessibilityLabel="Nota" />
  ),
  TextField: () => (
    <TextField isRequired>
      <Label>Email</Label>
      <Input placeholder="nombre@ejemplo.com" />
      <Description>For account notifications.</Description>
    </TextField>
  ),
  Toast: ToastExample,
  Typography: () => (
    <View className="gap-1">
      <Typography type="h4">Theme typography</Typography>
      <Typography type="body-sm" color="muted">
        Supporting text and visual hierarchy.
      </Typography>
    </View>
  ),
} satisfies Record<string, ComponentType>;
