import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
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

  const downloadCss = () => {
    const blob = new Blob([css], { type: "text/css;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `heroui-theme-${platform}.css`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
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
                  Could not copy to the clipboard. Select the text or
                  download the file.
                </p>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onPress={copyCss}>
              {copied ? <Check size={16} /> : <Copy size={16} />}{" "}
              {copied ? "Copied" : "Copy CSS"}
            </Button>
            <Button variant="primary" onPress={downloadCss}>
              <Download size={16} /> Download .css
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
