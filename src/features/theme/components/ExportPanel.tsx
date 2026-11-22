import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button, Modal } from "@heroui/react";
import type { ThemePlatform } from "../export-css";

interface ExportPanelProps {
  css: string;
  platform: ThemePlatform;
  onClose: () => void;
}

/** HeroUI Modal owns its backdrop, focus trap, animation and component styles. */
export function ExportPanel({ css, platform, onClose }: ExportPanelProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  };

  return (
    <Modal.Backdrop
      isOpen
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Modal.Container size="lg">
        <Modal.Dialog>
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>
              Export CSS · {platform === "web" ? "Web" : "Native"}
            </Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted">
                {platform === "web"
                  ? "Add this block to your global CSS after @heroui/styles. Load your custom font if you use one."
                  : "Add this block to global.css after heroui-native/styles. Load fonts in Expo and configure each weight."}
              </p>
              <pre className="max-h-[55vh] overflow-auto rounded-(--radius) border border-border bg-background p-4 text-xs whitespace-pre-wrap">
                <code>{css}</code>
              </pre>
              {copyError && (
                <p className="text-xs text-danger" role="alert">
                  Could not copy to the clipboard. Select the CSS text and copy it manually.
                </p>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onPress={copyCss}>
              {copied ? <Check size={16} /> : <Copy size={16} />}{" "}
              {copied ? "Copied" : "Copy CSS"}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
