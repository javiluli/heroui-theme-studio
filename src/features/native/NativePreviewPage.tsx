import { Button, Label, ListBox, NumberField, Select, Spinner } from "@heroui/react";
import { RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  PREVIEW_PING,
  PREVIEW_READY,
  PREVIEW_RENDERED,
  PREVIEW_THEME,
  type PreviewThemeMessage,
} from "./runtime/src/theme-protocol";
import { getThemeVariables, type ThemeConfig, type ThemeMode } from "../theme/model";
import { DEVICE_PRESETS } from "./device-presets";

const defaultDevice = DEVICE_PRESETS[0];
const bezel = 12;
type Size = { width: number; height: number };
type DevicePreset = (typeof DEVICE_PRESETS)[number];

const previewUrl = import.meta.env.BASE_URL + "native-runtime/index.html";

export default function NativePreviewPage({
  theme,
  mode,
}: {
  theme: ThemeConfig;
  mode: ThemeMode;
}) {
  const [device, setDevice] = useState<DevicePreset | "custom">(defaultDevice);
  const [customSize, setCustomSize] = useState<Size>();
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const frame = useRef<HTMLIFrameElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState<Size>({ width: 0, height: 0 });
  const size = device === "custom" ? customSize ?? defaultDevice : device;
  const frameWidth = size.width + bezel * 2;
  const frameHeight = size.height + bezel * 2;
  const scale = Math.min(1, available.width / frameWidth, available.height / frameHeight);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const measure = () => setAvailable({ width: element.clientWidth, height: element.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const origin = window.location.origin;
    const message: PreviewThemeMessage = {
      type: PREVIEW_THEME,
      mode,
      variables: getThemeVariables(theme.overrides[mode], true),
    };
    const syncTheme = () => frame.current?.contentWindow?.postMessage(message, origin);
    const receiveReady = (event: MessageEvent) => {
      if (
        event.origin !== origin ||
        event.source !== frame.current?.contentWindow
      )
        return;
      if (event.data === PREVIEW_READY) syncTheme();
      if (event.data === PREVIEW_RENDERED) setStatus("ready");
    };
    window.addEventListener("message", receiveReady);
    if (status === "ready") syncTheme();
    else frame.current?.contentWindow?.postMessage(PREVIEW_PING, origin);
    return () => window.removeEventListener("message", receiveReady);
  }, [attempt, status, theme, mode]);

  useEffect(() => {
    if (status !== "loading") return;
    const timer = window.setTimeout(() => setStatus("error"), 20000);
    return () => window.clearTimeout(timer);
  }, [attempt, status]);

  const reload = () => {
    setStatus("loading");
    setAttempt((current) => current + 1);
  };

  return (
    <section
      aria-labelledby="native-preview-title"
      className="flex h-full min-h-0 min-w-0 flex-col gap-(--studio-inset)"
    >
      <header className="flex min-h-11 flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h1
            id="native-preview-title"
            className="text-xl font-semibold tracking-tight"
          >
            HeroUI Native
          </h1>
          <p className="hidden text-sm text-muted sm:block">
            Preview your theme on React Native components.
          </p>
        </div>
        <Button
          size="lg"
          isIconOnly
          variant="ghost"
          aria-label="Reload preview"
          onPress={reload}
        >
          <RefreshCw size={16} aria-hidden="true" />
        </Button>
      </header>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 rounded-[calc(var(--radius)+var(--spacing)*2)] bg-surface p-2">
        <div className="@container/devices shrink-0 px-2 pt-1">
          <div className={device === "custom"
            ? "grid max-w-xl grid-cols-[minmax(0,1.35fr)_repeat(2,minmax(0,1fr))] items-center gap-2 @min-[28rem]/devices:grid-cols-[minmax(0,1.9fr)_repeat(2,minmax(0,1fr))]"
            : "max-w-64"}>
            <Select fullWidth variant="secondary" selectedKey={device === "custom" ? device : device.id}
              onSelectionChange={(key) => {
                if (key === "custom") {
                  setCustomSize((current) => current ?? { width: size.width, height: size.height });
                  setDevice(key);
                } else {
                  const preset = DEVICE_PRESETS.find(({ id }) => id === key);
                  if (preset) setDevice(preset);
                }
              }}>
              <Label className="sr-only">Device size</Label>
              <Select.Trigger>
                <Select.Value>
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span>{device === "custom" ? "Custom" : device.label}</span>
                    <span className={`whitespace-nowrap text-xs text-muted ${device === "custom" ? "hidden @min-[28rem]/devices:inline" : ""}`}>
                      {size.width} × {size.height} px
                    </span>
                  </span>
                </Select.Value>
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {DEVICE_PRESETS.map(({ id, label, width, height }) => (
                    <ListBox.Item key={id} id={id} textValue={label}>
                      <Label>{label}</Label>
                      <span className="ms-2 text-xs text-muted">{width} × {height}</span>
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                  <ListBox.Item id="custom">Custom<ListBox.ItemIndicator /></ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>
            {device === "custom" && (["width", "height"] as const).map((dimension) => {
              const label = dimension === "width" ? "Width" : "Height";
              return (
                <NumberField key={dimension} fullWidth variant="secondary" aria-label={`${label} (px)`}
                  minValue={160} maxValue={4096} step={1} formatOptions={{ useGrouping: false }}
                  value={size[dimension]}
                  onChange={(value) => {
                    if (Number.isFinite(value)) {
                      setCustomSize((current) => ({ ...(current ?? size), [dimension]: value }));
                    }
                  }}>
                  <NumberField.Group className="flex h-10 items-center gap-1 ps-2 sm:h-9">
                    <span className="shrink-0 text-xs text-muted" aria-hidden="true">
                      <span className="@min-[28rem]/devices:hidden">{label[0]}</span>
                      <span className="hidden @min-[28rem]/devices:inline">{label}</span>
                    </span>
                    <NumberField.Input className="min-w-0 flex-1 px-1" />
                  </NumberField.Group>
                </NumberField>
              );
            })}
          </div>
        </div>

        <div
          ref={stage}
          className="grid min-h-0 min-w-0 flex-1 place-items-center overflow-clip rounded-(--radius) bg-background"
        >
          <div className="relative" style={{ width: frameWidth * scale, height: frameHeight * scale }}>
            {/* Fit the shell without changing the iframe's logical viewport. */}
            <div className="absolute top-0 left-0 origin-top-left overflow-hidden rounded-[2.65rem] border-8 border-[#1e2024] bg-[#090a0b] p-1"
              style={{ width: frameWidth, height: frameHeight, transform: `scale(${scale})` }}>
              <div className="relative h-full overflow-hidden rounded-[1.95rem] bg-background">
                <iframe
                  key={attempt}
                  ref={frame}
                  title="HeroUI Native preview"
                  aria-describedby="native-preview-platform-note"
                  src={previewUrl}
                  className={`block h-full w-full border-0 ${status === "ready" ? "" : "invisible"}`}
                  onLoad={() =>
                    frame.current?.contentWindow?.postMessage(
                      PREVIEW_PING,
                      window.location.origin,
                    )
                  }
                  onError={() => setStatus("error")}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-2 left-1/2 h-4 w-20 -translate-x-1/2 rounded-full bg-[#1e2024]"
                />
                {status !== "ready" && (
                  <div
                    role="status"
                    className="absolute inset-0 grid place-content-center gap-3 px-6 text-center text-sm"
                  >
                    {status === "loading" ? (
                      <div className="flex items-center gap-2 text-muted">
                        <Spinner size="sm" /> Loading preview…
                      </div>
                    ) : (
                      <>
                        <p>The Native preview couldn’t load in this browser.</p>
                        <Button variant="secondary" size="sm" onPress={reload}>Reload</Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <p id="native-preview-platform-note" className="shrink-0 px-2 text-xs text-muted">
          Runs in Expo Web. Touch gestures, on-screen keyboards, and system dialogs can behave differently on iOS and Android.
        </p>
      </div>
    </section>
  );
}
