import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { Button, Modal } from "@heroui/react";
import type { ThemePlatform } from "../export-css";

interface ExportPanelProps {
  css: string;
  platform: ThemePlatform;
  isOpen: boolean;
  onClose: () => void;
}

export function ExportPanel({ css, platform, isOpen, onClose }: ExportPanelProps) {
  const [copyStatus, setCopyStatus] = useState<"copied" | "error" | null>(null);
  const fileName = platform === "web" ? "globals.css" : "global.css";

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(css);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  };

  const downloadCss = () => {
    const url = URL.createObjectURL(new Blob([css], { type: "text/css;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <Modal.Backdrop
      isOpen={isOpen}
      variant="blur"
      className="overflow-hidden"
      onOpenChange={(open) => {
        if (open) return;
        setCopyStatus(null);
        onClose();
      }}
    >
      <Modal.Container placement="center" size="lg" className="animate-none! items-end p-3 sm:px-6 sm:py-[5dvh]">
        <Modal.Dialog className="h-full max-w-136">
          <Modal.CloseTrigger />
          <Modal.Header>
            <div className="flex items-center justify-between gap-2 pe-8">
              <Modal.Heading>{fileName}</Modal.Heading>
              <div className="flex shrink-0 items-center gap-1">
                <Button size="sm" isIconOnly variant="ghost" aria-label="Download CSS" onPress={downloadCss}>
                  <Download aria-hidden="true" />
                </Button>
                <Button size="sm" isIconOnly variant="ghost" aria-label="Copy CSS" onPress={copyCss}>
                  {copyStatus === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                </Button>
                <span role="status" className="sr-only">{copyStatus === "copied" ? "CSS copied to clipboard" : ""}</span>
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            {copyStatus === "error" && (
              <p className="mb-3 text-xs text-danger" role="alert">Could not copy CSS. Select the text or download the file.</p>
            )}
            <pre tabIndex={0} aria-label="Generated theme CSS" className="overflow-x-auto border-t border-separator py-4 text-xs leading-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus">
              <code>{css}</code>
            </pre>
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
