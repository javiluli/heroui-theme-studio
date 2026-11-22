import {
  Alert, Avatar, Button, Card, Checkbox, Chip, CloseButton, Description, Dialog, Input, InputOTP, Label,
  ListGroup, Radio, RadioGroup, Separator, Slider, Spinner, Tabs, TextField, Typography, useToast,
} from "heroui-native";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useState } from "react";
import { Image, Platform, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { PreviewDialog } from "./PreviewDialog";
import { PreviewInputOTP } from "./PreviewInputOTP";
import { PreviewSelect, type PreviewOption } from "./PreviewSelect";
import { PreviewSliderThumb } from "./PreviewSliderThumb";
import { PreviewSwitch } from "./PreviewSwitch";

const states = ["California", "Florida", "New York", "Texas", "Washington"].map((label) => ({ label, value: label }));
const buttonVariants = ["primary", "secondary", "tertiary", "danger", "danger-soft", "ghost"] as const;
const avatarGradients = [
  ["#cffafe", "#38bdf8", "#6d28d9"],
  ["#dcfce7", "#6ee7b7", "#1d4ed8"],
  ["#f3e8ff", "#c084fc", "#be185d"],
  ["#fef3c7", "#fdba74", "#c2410c"],
  ["#fee2e2", "#fda4af", "#b91c1c"],
] as const;
const priceFormat = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function CollageTabs({ values, label }: { values: readonly string[]; label: string }) {
  const [selected, setSelected] = useState(values[0]);
  return (
    <Tabs value={selected} onValueChange={setSelected}>
      <Tabs.List className="w-full" accessibilityLabel={label}>
        <Tabs.ScrollView>
          <Tabs.Indicator />
          {values.map((value) => (
            <Tabs.Trigger key={value} value={value} className="flex-1">
              <Tabs.Label>{value}</Tabs.Label>
            </Tabs.Trigger>
          ))}
        </Tabs.ScrollView>
      </Tabs.List>
    </Tabs>
  );
}

function CollageControls() {
  const [state, setState] = useState<PreviewOption>();
  const [checked, setChecked] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const [choice, setChoice] = useState("second");
  const [price, setPrice] = useState(250);
  return (
    <View className="gap-4">
      <TextField isRequired>
        <Label>Your email</Label>
        <Input placeholder="john@email.com" accessibilityLabel="Your email" keyboardType="email-address" autoCapitalize="none" />
        <Description>We won't share your email</Description>
      </TextField>
      <PreviewSelect label="State" options={states} value={state} onChange={setState} />
      <View className="flex-row flex-wrap items-center justify-between gap-3 px-1">
        <Checkbox accessibilityLabel="Checkbox" isSelected={checked} onSelectedChange={setChecked} />
        <PreviewSwitch accessibilityLabel="Switch" isSelected={enabled} onSelectedChange={setEnabled} />
        <RadioGroup value={choice} onValueChange={setChoice} className="flex-row items-center gap-3" accessibilityLabel="Radio options">
          <RadioGroup.Item accessibilityLabel="First option" value="first"><Radio /></RadioGroup.Item>
          <RadioGroup.Item accessibilityLabel="Second option" value="second"><Radio /></RadioGroup.Item>
        </RadioGroup>
        <Spinner accessibilityLabel="Loading" />
      </View>
      <Slider value={price} maxValue={500} step={5} onChange={(next) => { if (typeof next === "number") setPrice(next); }}>
        <View className="flex-row flex-wrap items-center justify-between gap-1">
          <Label>Price</Label>
          <Slider.Output>{({ state }) => priceFormat.format(state.values[0])}</Slider.Output>
        </View>
        <Slider.Track>
          <Slider.Fill />
          <PreviewSliderThumb label="Price" value={price} max={500} step={5} onChange={setPrice} />
        </Slider.Track>
      </Slider>
      <CollageTabs label="Time range" values={["1D", "7D", "1M", "1Y", "All"]} />
      <CollageTabs label="Message type" values={["Chats", "Emails"]} />
    </View>
  );
}

function VerifyAccount() {
  const [code, setCode] = useState("4320");
  const { width } = useWindowDimensions();
  const { toast } = useToast();
  const setDigits = (value: string) => setCode(value.replace(/\D/g, ""));
  const slotWidth = Math.min(44, Math.floor((width - 88) / 6));
  return (
    <View className="gap-2">
      <Typography.Heading type="h2" className="text-base">Verify account</Typography.Heading>
      <Description>We've sent a code to a****@gmail.com</Description>
      {width >= 240 ? (
        <PreviewInputOTP maxLength={6} value={code} onChange={setDigits} textInputProps={{ accessibilityLabel: "Verification code" }}>
          <InputOTP.Group>
            {[0, 1, 2].map((index) => <InputOTP.Slot key={index} index={index} style={{ width: slotWidth }} />)}
          </InputOTP.Group>
          <InputOTP.Separator />
          <InputOTP.Group>
            {[3, 4, 5].map((index) => <InputOTP.Slot key={index} index={index} style={{ width: slotWidth }} />)}
          </InputOTP.Group>
        </PreviewInputOTP>
      ) : (
        <Input value={code} onChangeText={setDigits} maxLength={6} keyboardType="number-pad" accessibilityLabel="Verification code" />
      )}
      <View className="flex-row flex-wrap items-center gap-1">
        <Description>Didn't receive a code?</Description>
        <Button size="sm" variant="ghost" onPress={() => { setCode(""); toast.show({ label: "Demo code reset" }); }}>Resend</Button>
      </View>
    </View>
  );
}

function FileActions() {
  const { toast } = useToast();
  return (
    <ListGroup>
      <Description>Actions</Description>
      {[["New file", "Create a new file"], ["Edit file", "Make changes"], ["Delete file", "Move to trash"]].map(([label, detail], index) => (
        <View key={label}>
          {index === 2 && <View className="gap-2 pt-1"><Separator /><Description>Danger zone</Description></View>}
          <ListGroup.Item accessibilityRole="button" onPress={() => toast.show({ label: `${label} · demo` })}>
            <ListGroup.ItemContent>
              <ListGroup.ItemTitle>{label}</ListGroup.ItemTitle>
              <ListGroup.ItemDescription>{detail}</ListGroup.ItemDescription>
            </ListGroup.ItemContent>
            <ListGroup.ItemSuffix />
          </ListGroup.Item>
        </View>
      ))}
    </ListGroup>
  );
}

function AccountCard() {
  const [visible, setVisible] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const dismiss = useCallback(() => setDialogOpen(false), []);
  const { toast } = useToast();
  if (!visible) return <Button variant="tertiary" onPress={() => setVisible(true)}>Show account preview</Button>;
  return (
    <Card>
      <View className="gap-3">
        <View className="flex-row items-center justify-between gap-2">
          <View className="min-w-0 flex-1"><Card.Title>Create an account</Card.Title></View>
          <View className="shrink-0"><CloseButton variant="ghost" accessibilityLabel="Hide account preview" onPress={() => setVisible(false)} /></View>
        </View>
        <Card.Description>Start your free 7-day trial. No credit card required.</Card.Description>
        <Dialog isOpen={dialogOpen} onOpenChange={setDialogOpen}>
          <Dialog.Trigger asChild><Button>Get Started</Button></Dialog.Trigger>
          <PreviewDialog title="Create an account" description="This is a component preview." onDismiss={dismiss}>
            <Button onPress={dismiss}>Done</Button>
          </PreviewDialog>
        </Dialog>
        <View className="flex-row items-center gap-3">
          <View className="flex-1"><Separator /></View><Description>OR</Description><View className="flex-1"><Separator /></View>
        </View>
        {["Google", "Apple"].map((provider) => (
          <Button key={provider} variant="tertiary" onPress={() => toast.show({ label: `${provider} sign-in · demo` })}>
            Continue with {provider}
          </Button>
        ))}
      </View>
    </Card>
  );
}

const communities = [
  { name: "Indie Hackers", count: "148 members", by: "John", initials: "IH", left: 0, top: -56 },
  { name: "AI Builders", count: "362 members", by: "Martha", initials: "AI", left: -56, top: -8 },
] as const;

function CommunityCards() {
  const image = Platform.OS === "web" && typeof window !== "undefined"
    ? new URL("../collage-communities.jpg", window.location.href).href
    : undefined;
  return (
    <View className="flex-row flex-wrap gap-2">
      {communities.map(({ name, count, by, initials, left, top }) => (
        <View key={name} className="min-w-0 flex-1 basis-32">
          <Card>
            <View className="gap-2">
              {image ? (
                <View className="size-14 overflow-hidden rounded-xl">
                  <Image source={{ uri: image }} style={{ position: "absolute", width: 112, height: 112, left, top }} />
                </View>
              ) : <Avatar color="accent"><Avatar.Fallback>{initials}</Avatar.Fallback></Avatar>}
              <Card.Title>{name}</Card.Title>
              <Card.Description>{count}</Card.Description>
              <Description>By {by}</Description>
            </View>
          </Card>
        </View>
      ))}
    </View>
  );
}

function ChangesCard() {
  const [visible, setVisible] = useState(true);
  const { toast } = useToast();
  if (!visible) return <Button variant="tertiary" onPress={() => setVisible(true)}>Show changes preview</Button>;
  const finish = (label: string) => { setVisible(false); toast.show({ label }); };
  return (
    <Card>
      <View className="gap-3">
        <View className="flex-row items-center justify-between gap-2">
          <View className="min-w-0 flex-1"><Card.Title>Unsaved changes</Card.Title></View>
          <View className="shrink-0"><CloseButton variant="ghost" accessibilityLabel="Hide changes preview" onPress={() => setVisible(false)} /></View>
        </View>
        <Card.Description>Do you want to save or discard changes?</Card.Description>
        <View className="flex-row flex-wrap gap-2">
          <Button variant="tertiary" onPress={() => finish("Changes discarded")}>Discard</Button>
          <Button onPress={() => finish("Changes saved")}>Save changes</Button>
        </View>
      </View>
    </Card>
  );
}

export function NativeCollageScreen() {
  const [notifications, setNotifications] = useState(true);
  const { toast } = useToast();
  return (
    <ScrollView className="min-h-0 flex-1" contentContainerClassName="gap-5 px-4 pb-6 pt-9"
      keyboardShouldPersistTaps="handled" testID="native-collage">
      <Typography.Heading type="h1" className="text-xl">Collage</Typography.Heading>
      <CollageControls />
      <Separator />
      <View className="flex-row flex-wrap items-center gap-1" accessibilityLabel="Seven community members">
        {avatarGradients.map((colors) => (
          <Avatar key={colors[0]} size="sm">
            <Avatar.Fallback>
              <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            </Avatar.Fallback>
          </Avatar>
        ))}
        <View><Chip size="sm" variant="soft">+2</Chip></View>
      </View>
      <VerifyAccount />
      <View className="flex-row flex-wrap gap-2">
        {buttonVariants.map((variant) => (
          <Button key={variant} size="sm" variant={variant} accessibilityLabel={`Click me · ${variant}`}
            onPress={() => toast.show({ label: `${variant} button pressed` })}>Click me</Button>
        ))}
      </View>
      <Card>
        <View className="gap-2">
          <View className="flex-row items-center gap-2">
            <Avatar size="sm" color="accent"><Avatar.Fallback>H</Avatar.Fallback></Avatar>
            <View className="min-w-0 flex-1"><Card.Title>HeroUI</Card.Title><Description>@hero_ui</Description></View>
          </View>
          <Typography>Building the future of UI for web &amp; mobile. (YC S24)</Typography>
          <Description>4 Following · 97.1K Followers</Description>
        </View>
      </Card>
      <Alert>
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>You have 2 credits left</Alert.Title>
          <Alert.Description>Get a paid plan for more credits</Alert.Description>
          <View className="mt-2 items-start">
            <Button size="sm" variant="tertiary" onPress={() => toast.show({ label: "Upgrade · demo" })}>Upgrade</Button>
          </View>
        </Alert.Content>
      </Alert>
      <View className="flex-row items-center gap-2">
        <View className="min-w-0 flex-1">
          <Label>Allow notifications</Label><Description>Receive push notifications from HeroUI</Description>
        </View>
        <PreviewSwitch accessibilityLabel="Allow notifications" isSelected={notifications} onSelectedChange={setNotifications} />
      </View>
      <AccountCard />
      <CommunityCards />
      <FileActions />
      <ChangesCard />
    </ScrollView>
  );
}
