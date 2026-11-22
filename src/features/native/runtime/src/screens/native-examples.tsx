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
  Tabs,
  TagGroup,
  TextArea,
  TextField,
  Typography,
  useToast,
} from "heroui-native";
import { useCallback, useState, type ComponentType } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Linking, ScrollView, useWindowDimensions, View } from "react-native";
import { PreviewDialog } from "./PreviewDialog";
import { PreviewInputOTP } from "./PreviewInputOTP";
import { PreviewSliderThumb } from "./PreviewSliderThumb";
import { PreviewSwitch } from "./PreviewSwitch";

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
    <PreviewSwitch
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
      <ControlField.Indicator><PreviewSwitch accessibilityLabel="Project updates" /></ControlField.Indicator>
    </ControlField>
  );
}

function CloseButtonExample() {
  const [open, setOpen] = useState(true);
  return open ? (
    <View className="flex-row items-center justify-between gap-2">
      <View className="min-w-0 flex-1"><Typography>Sample notification</Typography></View>
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
      <Select.Trigger accessibilityLabel="City">
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

function MenuExample() {
  const { toast } = useToast();
  const { width } = useWindowDimensions();
  return (
    <Menu>
      <Menu.Trigger asChild>
        <Button variant="secondary">Actions</Button>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Overlay />
        <Menu.Content presentation="popover" width={Math.min(210, width - 24)}>
          <Menu.Item id="edit" onPress={() => toast.show({ label: "Editing project" })}>
            <Menu.ItemTitle>Edit</Menu.ItemTitle>
          </Menu.Item>
          <Menu.Item id="duplicate" onPress={() => toast.show({ variant: "success", label: "Project duplicated" })}>
            <Menu.ItemTitle>Duplicate</Menu.ItemTitle>
          </Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu>
  );
}

function SliderExample() {
  const [value, setValue] = useState(40);
  return (
    <View className="gap-2">
      <Slider value={value} step={5} onChange={(next) => { if (typeof next === "number") setValue(next); }}>
        <Slider.Output />
        <Slider.Track>
          <Slider.Fill />
          <PreviewSliderThumb label="Volume" value={value} max={100} step={5} onChange={setValue} />
        </Slider.Track>
      </Slider>
      <View className="flex-row flex-wrap gap-2">
        <Button variant="outline" size="sm" isDisabled={value === 0} onPress={() => setValue((current) => current - 5)}>
          Decrease
        </Button>
        <Button variant="outline" size="sm" isDisabled={value === 100} onPress={() => setValue((current) => current + 5)}>
          Increase
        </Button>
      </View>
    </View>
  );
}

function DialogExample() {
  const [open, setOpen] = useState(false);
  const dismiss = useCallback(() => setOpen(false), []);
  return (
    <Dialog isOpen={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild><Button>Open dialog</Button></Dialog.Trigger>
      <PreviewDialog title="Confirm changes" description="This dialog uses the theme colors." onDismiss={dismiss}>
        <Button onPress={dismiss}>Done</Button>
      </PreviewDialog>
    </Dialog>
  );
}

function PopoverExample() {
  const { width } = useWindowDimensions();
  return (
    <Popover>
      <Popover.Trigger asChild><Button variant="secondary">View details</Button></Popover.Trigger>
      <Popover.Portal>
        <Popover.Overlay />
        <Popover.Content presentation="popover" width={Math.min(235, width - 24)}>
          <Popover.Title>More information</Popover.Title>
          <Popover.Description>Overlay preview.</Popover.Description>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
}

function OtpExample() {
  const { width } = useWindowDimensions();
  const slotWidth = Math.min(44, Math.floor((width - 88) / 4));
  return (
    <PreviewInputOTP maxLength={4} textInputProps={{ accessibilityLabel: "Verification code" }}>
      <InputOTP.Group>
        {[0, 1, 2, 3].map((index) => <InputOTP.Slot key={index} index={index} style={{ width: slotWidth }} />)}
      </InputOTP.Group>
    </PreviewInputOTP>
  );
}

function BottomSheetExample() {
  const { height } = useWindowDimensions();
  return (
    <BottomSheet>
      <BottomSheet.Trigger asChild><Button>Show sheet</Button></BottomSheet.Trigger>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content enableDynamicSizing={false} snapPoints={[height < 440 ? "75%" : "38%"]}>
          <View className="flex-row items-start justify-between gap-2">
            <View className="min-w-0 flex-1"><BottomSheet.Title>Theme details</BottomSheet.Title></View>
            <View className="shrink-0"><BottomSheet.Close variant="ghost" accessibilityLabel="Close sheet" /></View>
          </View>
          <BottomSheet.Description>A sample bottom sheet.</BottomSheet.Description>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
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
  BottomSheet: BottomSheetExample,
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
  Dialog: DialogExample,
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
  InputOTP: OtpExample,
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
  Menu: MenuExample,
  Popover: PopoverExample,
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
  Skeleton: () => <Skeleton className="h-6 w-full max-w-44 rounded-md" />,
  SkeletonGroup: () => (
    <SkeletonGroup isLoading>
      <View className="gap-2">
        <SkeletonGroup.Item className="h-6 w-full max-w-44 rounded-md" />
        <SkeletonGroup.Item className="h-4 w-full max-w-36 rounded-md" />
      </View>
    </SkeletonGroup>
  ),
  Slider: SliderExample,
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
    <TextArea placeholder="Write a note" accessibilityLabel="Note" />
  ),
  TextField: () => (
    <TextField isRequired>
      <Label>Email</Label>
      <Input placeholder="you@example.com" accessibilityLabel="Email" />
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
