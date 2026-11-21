import { useState, type ComponentProps, type ReactNode } from "react";
import {
  Alert,
  Avatar,
  AvatarGroup,
  Button,
  Card,
  Checkbox,
  CloseButton,
  Description,
  Header,
  Input,
  InputOTP,
  Kbd,
  Label,
  ListBox,
  Modal,
  Radio,
  RadioGroup,
  Select,
  Separator,
  Slider,
  Spinner,
  Switch,
  Tabs,
  TextField,
  Toast,
  toast,
} from "@heroui/react";
import {
  BadgeCheck,
  Mail,
  MessageCircle,
  Pencil,
  Rocket,
  Save,
  SquarePlus,
  Trash2,
  UserRound,
} from "lucide-react";
import { HeroUILogo } from "../../../components/HeroUILogo";

const states = ["California", "Florida", "New York", "Texas", "Washington"];
const periods = ["1D", "7D", "1M", "1Y", "All"];
const priceFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const buttonVariants = [
  "primary",
  "secondary",
  "tertiary",
  "danger",
  "danger-soft",
  "ghost",
] as const;
const avatarColors = [
  "from-cyan-100 via-sky-400 to-violet-700",
  "from-green-100 via-emerald-300 to-blue-700",
  "from-purple-100 via-purple-400 to-pink-700",
  "from-amber-100 via-orange-300 to-orange-700",
  "from-red-100 via-rose-300 to-red-700",
];
const actions = [
  {
    label: "New file",
    description: "Create a new file",
    shortcut: "N",
    Icon: SquarePlus,
  },
  {
    label: "Edit file",
    description: "Make changes",
    shortcut: "E",
    Icon: Pencil,
  },
  {
    label: "Delete file",
    description: "Move to trash",
    shortcut: "D",
    Icon: Trash2,
  },
] as const;

function renderPreviewPanel(props: ComponentProps<"div">) {
  return <div {...props} tabIndex={-1} />;
}

function FileAction({
  action,
  danger = false,
}: {
  action: (typeof actions)[number];
  danger?: boolean;
}) {
  const { label, description, shortcut, Icon } = action;
  return (
    <ListBox.Item
      id={label}
      textValue={label}
      variant={danger ? "danger" : "default"}
    >
      <span
        className={
          danger ? "self-start pt-1 text-danger" : "self-start pt-1 text-muted"
        }
      >
        <Icon size={15} aria-hidden="true" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <Label>{label}</Label>
        <Description>{description}</Description>
      </div>
      <Kbd variant="light">
        <Kbd.Abbr keyValue="command" />
        {danger && <Kbd.Abbr keyValue="shift" />}
        <Kbd.Content>{shortcut}</Kbd.Content>
      </Kbd>
    </ListBox.Item>
  );
}

function CollageControls() {
  return (
    <div className="flex min-w-0 flex-col gap-10">
      <TextField isRequired type="email">
        <Label>Your email</Label>
        <Input placeholder="john@email.com" />
        <Description>We won't share your email</Description>
      </TextField>
      <Select isRequired placeholder="Select one">
        <Label>State</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {states.map((state) => (
              <ListBox.Item key={state} id={state}>
                {state}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
      <div className="flex items-center justify-between gap-2 px-2">
        <Checkbox aria-label="Checkbox" defaultSelected>
          <Checkbox.Content>
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
          </Checkbox.Content>
        </Checkbox>
        <Switch aria-label="Switch" defaultSelected>
          <Switch.Content>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Content>
        </Switch>
        <RadioGroup
          aria-label="Radio options"
          orientation="horizontal"
          defaultValue="second"
        >
          <div className="flex gap-7">
            <Radio value="first" aria-label="First option">
              <Radio.Content>
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
              </Radio.Content>
            </Radio>
            <Radio value="second" aria-label="Second option">
              <Radio.Content>
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
              </Radio.Content>
            </Radio>
          </div>
        </RadioGroup>
        <Spinner color="accent" aria-label="Loading" />
      </div>
      <div className="px-1">
        <Slider defaultValue={250} maxValue={500}>
          <Label>Price</Label>
          <Slider.Output>
            {({ state }) => priceFormat.format(state.values[0])}
          </Slider.Output>
          <Slider.Track>
            <Slider.Fill />
            <Slider.Thumb />
          </Slider.Track>
        </Slider>
      </div>
      <Tabs defaultSelectedKey="1D">
        <Tabs.ListContainer>
          <Tabs.List aria-label="Time range">
            {periods.map((period) => (
              <Tabs.Tab key={period} id={period}>
                {period}
                <Tabs.Indicator />
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs.ListContainer>
        <div className="sr-only">
          {periods.map((period) => (
            <Tabs.Panel key={period} id={period} render={renderPreviewPanel}>
              Selected range: {period}
            </Tabs.Panel>
          ))}
        </div>
      </Tabs>
      <Tabs defaultSelectedKey="chats">
        <Tabs.ListContainer>
          <Tabs.List aria-label="Message type">
            <Tabs.Tab id="chats">
              <span className="flex items-center gap-1.5">
                <MessageCircle size={14} aria-hidden="true" />
                Chats
              </span>
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="emails">
              <span className="flex items-center gap-1.5">
                <Mail size={14} aria-hidden="true" />
                Emails
              </span>
              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
        <div className="sr-only">
          <Tabs.Panel id="chats" render={renderPreviewPanel}>
            Chats selected
          </Tabs.Panel>
          <Tabs.Panel id="emails" render={renderPreviewPanel}>
            Emails selected
          </Tabs.Panel>
        </div>
      </Tabs>
      <div className="rounded-3xl bg-surface p-2 text-surface-foreground">
        <ListBox
          aria-label="File actions"
          selectionMode="none"
          onAction={(key) => toast(`${key} · demo`)}
        >
          <ListBox.Section>
            <Header>Actions</Header>
            {actions.slice(0, 2).map((action) => (
              <FileAction key={action.label} action={action} />
            ))}
          </ListBox.Section>
          <Separator />
          <ListBox.Section>
            <Header>Danger zone</Header>
            <FileAction action={actions[2]} danger />
          </ListBox.Section>
        </ListBox>
      </div>
    </div>
  );
}

function GradientAvatar({ gradient }: { gradient: string }) {
  return (
    <Avatar aria-hidden="true">
      <Avatar.Fallback>
        <span className={`block size-full bg-linear-to-br ${gradient}`} />
      </Avatar.Fallback>
    </Avatar>
  );
}

function VerifyAccount() {
  const [code, setCode] = useState("4320");
  return (
    <section aria-labelledby="collage-verify" className="space-y-1">
      <h2 id="collage-verify" className="font-medium">
        Verify account
      </h2>
      <p className="text-muted">We've sent a code to a****@gmail.com</p>
      <InputOTP
        maxLength={6}
        value={code}
        onChange={setCode}
        aria-label="Verification code"
      >
        <InputOTP.Group>
          <InputOTP.Slot index={0} />
          <InputOTP.Slot index={1} />
          <InputOTP.Slot index={2} />
        </InputOTP.Group>
        <InputOTP.Separator />
        <InputOTP.Group>
          <InputOTP.Slot index={3} />
          <InputOTP.Slot index={4} />
          <InputOTP.Slot index={5} />
        </InputOTP.Group>
      </InputOTP>
      <div className="flex flex-wrap items-center gap-x-1 pt-2 text-muted">
        Didn't receive a code?
        <Button
          size="sm"
          variant="ghost"
          onPress={() => {
            setCode("");
            toast("Demo code reset");
          }}
        >
          Resend
        </Button>
      </div>
    </section>
  );
}

function CollageProfile() {
  return (
    <Card>
      <Card.Header>
        <div className="flex items-center gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-background text-foreground">
            <HeroUILogo size={14} />
          </span>
          <div>
            <h2 className="flex items-center gap-0.5 font-semibold">
              HeroUI
              <BadgeCheck
                size={16}
                className="fill-warning text-warning-foreground"
                aria-label="Verified"
              />
            </h2>
            <p className="text-muted">@hero_ui</p>
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="font-medium">
          <p>Building the future of UI for web &amp; mobile.</p>
          <p className="flex items-center gap-1.5">
            <Rocket size={16} className="text-accent" aria-hidden="true" />
            (YC S24)
          </p>
        </div>
      </Card.Content>
      <Card.Footer>
        <div className="flex flex-wrap gap-2 text-muted">
          <span>
            <strong className="text-foreground">4</strong> Following
          </span>
          <span>
            <strong className="text-foreground">97.1K</strong> Followers
          </span>
        </div>
      </Card.Footer>
    </Card>
  );
}

function CollageMiddle() {
  return (
    <div className="flex min-w-0 flex-col gap-10">
      <div className="mx-auto flex w-full max-w-71 min-w-0 flex-col gap-9">
        <div className="self-center">
          <AvatarGroup aria-label="Seven community members">
            {avatarColors.map((color) => (
              <GradientAvatar key={color} gradient={color} />
            ))}
            <AvatarGroup.Count>+2</AvatarGroup.Count>
          </AvatarGroup>
        </div>
        <VerifyAccount />
        <div className="grid grid-cols-3 gap-x-1.5 gap-y-2 px-1">
          {buttonVariants.map((variant) => (
            <Button
              key={variant}
              aria-label={`Click me · ${variant}`}
              size="sm"
              variant={variant}
              onPress={() => toast(`${variant} button pressed`)}
            >
              Click me
            </Button>
          ))}
        </div>
      </div>
      <CollageProfile />
      <Alert>
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>You have 2 credits left</Alert.Title>
          <Alert.Description>
            Get a paid plan for more credits
          </Alert.Description>
        </Alert.Content>
        <Button variant="tertiary" onPress={() => toast("Upgrade · demo")}>
          Upgrade
        </Button>
      </Alert>
      <div className="mx-auto w-full max-w-75">
        <Switch defaultSelected>
          <Switch.Content>
            <div className="flex w-full items-start justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <Label>Allow notifications</Label>
                <Description>
                  Receive push notifications from HeroUI
                </Description>
              </div>
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </div>
          </Switch.Content>
        </Switch>
      </div>
    </div>
  );
}

function InlineDialog({
  title,
  icon,
  children,
  onClose,
  centered = false,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  onClose: () => void;
  centered?: boolean;
}) {
  return (
    <Card>
      <div className="absolute top-3 right-3">
        <CloseButton aria-label={`Close ${title}`} onPress={onClose} />
      </div>
      <div
        className={`flex flex-col gap-3 ${centered ? "items-center p-1 text-center" : "p-2"}`}
      >
        <span
          className={`grid size-10 place-items-center rounded-full ${centered ? "bg-default text-default-foreground" : "bg-warning/15 text-warning"}`}
        >
          {icon}
        </span>
        <h2 className="font-medium">{title}</h2>
        {children}
      </div>
    </Card>
  );
}

function SignupPreview({ onClose }: { onClose: () => void }) {
  return (
    <InlineDialog
      title="Create an account"
      icon={<UserRound size={16} aria-hidden="true" />}
      onClose={onClose}
      centered
    >
      <p className="text-muted">
        Start your free 7-day trial.
        <br />
        No credit card required.
      </p>
      <div className="grid w-full gap-2">
        <Modal>
          <Button fullWidth>Get Started</Button>
          <Modal.Backdrop>
            <Modal.Container>
              <Modal.Dialog>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Heading>Create an account</Modal.Heading>
                </Modal.Header>
                <Modal.Body>
                  <p>This is a component preview.</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button slot="close">Done</Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
        <div className="my-1.5 flex items-center gap-2 text-xs text-muted">
          <span className="flex-1">
            <Separator />
          </span>
          OR
          <span className="flex-1">
            <Separator />
          </span>
        </div>
        <Button
          variant="tertiary"
          fullWidth
          onPress={() => toast("Google sign-in · demo")}
        >
          <span
            aria-hidden="true"
            className="bg-conic-[#4285f4_0deg_110deg,#34a853_110deg_180deg,#fbbc05_180deg_235deg,#ea4335_235deg_300deg,#4285f4_300deg] bg-clip-text font-bold text-transparent"
          >
            G
          </span>
          Continue with Google
        </Button>
        <Button
          variant="tertiary"
          fullWidth
          onPress={() => toast("Apple sign-in · demo")}
        >
          <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M17.1 12.3c0-2 1.6-3 1.7-3.1-1-1.4-2.5-1.6-3.1-1.6-1.3-.2-2.6.8-3.3.8-.7 0-1.8-.8-2.9-.7-1.5 0-2.9.9-3.7 2.2-1.6 2.7-.4 6.7 1.1 8.9.8 1.1 1.7 2.3 2.8 2.2 1.1 0 1.5-.7 2.9-.7s1.8.7 2.9.7c1.2 0 2-1.1 2.7-2.2.9-1.2 1.2-2.4 1.3-2.5-.1 0-2.4-.9-2.4-4ZM14.9 6.3c.6-.8 1.1-1.8 1-2.9-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1 .1 2-.5 2.7-1.3Z" />
          </svg>
          Continue with Apple
        </Button>
      </div>
    </InlineDialog>
  );
}

const communities = [
  {
    name: "Indie Hackers",
    count: 148,
    author: "John",
    avatar: 4,
    position: "left bottom",
  },
  {
    name: "AI Builders",
    count: 362,
    author: "Martha",
    avatar: 0,
    position: "right 15%",
  },
] as const;

function CollageRight() {
  const [signupOpen, setSignupOpen] = useState(true);
  const [changesOpen, setChangesOpen] = useState(true);
  const finish = (message: string) => {
    setChangesOpen(false);
    toast(message);
  };
  return (
    <div className="mx-auto flex w-full max-w-85 min-w-0 flex-col gap-5 @[42rem]/collage:col-span-2 @[58rem]/collage:col-span-1">
      <div className="mx-auto w-full max-w-80">
        {signupOpen ? (
          <SignupPreview onClose={() => setSignupOpen(false)} />
        ) : (
          <Button variant="tertiary" onPress={() => setSignupOpen(true)}>
            Show account preview
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {communities.map(({ name, count, author, avatar, position }) => (
          <Card key={name}>
            <Card.Header>
              <div
                aria-hidden="true"
                className="mb-2 size-14 rounded-xl bg-cover"
                style={{
                  backgroundImage: `url(${import.meta.env.BASE_URL}collage-communities.jpg)`,
                  backgroundPosition: position,
                  backgroundSize: "200% auto",
                }}
              />
              <Card.Title>{name}</Card.Title>
              <Card.Description>{count} members</Card.Description>
            </Card.Header>
            <Card.Footer>
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <span
                  aria-hidden="true"
                  className={`size-4 rounded-full bg-linear-to-br ${avatarColors[avatar]}`}
                />
                By {author}
              </div>
            </Card.Footer>
          </Card>
        ))}
      </div>
      {changesOpen ? (
        <InlineDialog
          title="Unsaved changes"
          icon={<Save size={16} aria-hidden="true" />}
          onClose={() => setChangesOpen(false)}
        >
          <p className="text-muted">Do you want to save or discard changes?</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button
              variant="tertiary"
              fullWidth
              onPress={() => finish("Changes discarded")}
            >
              Discard
            </Button>
            <Button fullWidth onPress={() => finish("Changes saved")}>
              Save changes
            </Button>
          </div>
        </InlineDialog>
      ) : (
        <Button variant="tertiary" onPress={() => setChangesOpen(true)}>
          Show changes preview
        </Button>
      )}
    </div>
  );
}

export function CollagePreview() {
  return (
    <section
      className="@container/collage min-w-0"
      aria-labelledby="collage-title"
    >
      <h1 id="collage-title" className="sr-only">
        Component collage
      </h1>
      <div
        lang="en"
        data-gallery-layout="collage"
        className="mx-auto grid max-w-255 min-w-0 items-start gap-x-3 gap-y-10 py-10 text-sm @[42rem]/collage:grid-cols-[minmax(0,256fr)_minmax(0,400fr)] @[58rem]/collage:grid-cols-[minmax(0,256fr)_minmax(0,400fr)_minmax(0,340fr)]"
      >
        <CollageControls />
        <CollageMiddle />
        <CollageRight />
      </div>
      <Toast.Provider />
    </section>
  );
}
