import { Dialog } from "heroui-native";
import { useLayoutEffect, useRef, type ComponentRef, type ReactNode } from "react";
import { Platform, ScrollView, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const isWeb = Platform.OS === "web";

interface PreviewDialogProps {
  title: string;
  description: string;
  onDismiss: () => void;
  focusKey?: string;
  children: ReactNode;
}

export function PreviewDialog(props: PreviewDialogProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const gutter = width < 280 || height < 360 ? 10 : 20;
  const top = insets.top + gutter;
  const bottom = insets.bottom + gutter;
  return (
    <Dialog.Portal style={{ paddingTop: top, paddingBottom: bottom, paddingHorizontal: gutter }}>
      <Dialog.Overlay />
      <DialogPanel {...props} maxHeight={Math.max(0, height - top - bottom)} />
    </Dialog.Portal>
  );
}

function DialogPanel({ title, description, onDismiss, focusKey, children, maxHeight }: PreviewDialogProps & {
  maxHeight: number;
}) {
  const panelRef = useRef<ComponentRef<typeof Dialog.Content>>(null);

  useLayoutEffect(() => {
    if (!isWeb) return;
    const panel = panelRef.current as unknown as HTMLElement | null;
    if (!panel) return;
    const origin = document.activeElement;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onDismiss();
        return;
      }
      if (event.key !== "Tab") return;

      const controls = Array.from(panel.querySelectorAll<HTMLElement>("button, input, [tabindex]"))
        .filter((element) => element.tabIndex >= 0 && !element.matches(":disabled,[aria-disabled=true]") && element.getClientRects().length > 0);
      const next = event.shiftKey ? controls.at(-1) : controls[0];
      const boundary = event.shiftKey ? controls[0] : controls.at(-1);
      if (!panel.contains(document.activeElement) || document.activeElement === boundary) {
        event.preventDefault();
        (next ?? panel).focus();
      }
    };
    document.addEventListener("keydown", handleKey, true);
    return () => {
      document.removeEventListener("keydown", handleKey, true);
      const destination = origin instanceof HTMLElement && origin.isConnected && origin !== document.body
        ? origin
        : document.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
      destination?.focus({ preventScroll: true });
    };
  }, [onDismiss]);

  useLayoutEffect(() => {
    if (!isWeb) return;
    const panel = panelRef.current as unknown as HTMLElement | null;
    // Focusing without scrolling keeps the browser from moving the embedded frame.
    panel?.querySelector<HTMLElement>("input,textarea")?.focus({ preventScroll: true });
    if (panel && !panel.contains(document.activeElement)) {
      panel.querySelector<HTMLElement>("button")?.focus({ preventScroll: true });
    }
  }, [focusKey]);

  return (
    <Dialog.Content
      ref={panelRef}
      isSwipeable={!isWeb}
      style={{ alignSelf: "center", width: "100%", maxWidth: 440, maxHeight, padding: 0 }}
    >
      <View className="flex-row items-start gap-2 border-b border-separator px-4 py-3">
        <View className="min-w-0 flex-1 self-center"><Dialog.Title>{title}</Dialog.Title></View>
        <View className="shrink-0">
          <Dialog.Close variant="ghost" accessibilityLabel="Close dialog" />
        </View>
      </View>
      <ScrollView style={{ flexGrow: 0, flexShrink: 1 }} contentContainerClassName="gap-4 p-4"
        keyboardShouldPersistTaps="handled">
        <Dialog.Description>{description}</Dialog.Description>
        {children}
      </ScrollView>
    </Dialog.Content>
  );
}
