import { useState } from "react";
import { Button, Label, Modal, TextArea, TextField } from "@heroui/react";
import { Check } from "lucide-react";
import { parseThemeCss } from "../import-css";
import type { ThemeConfig } from "../model";

interface ImportCssPanelProps {
  theme: ThemeConfig;
  onApply: (theme: ThemeConfig) => void;
  onClose: () => void;
}

/** Import only validated HeroUI tokens; never mount pasted CSS as a style block. */
export function ImportCssPanel({ theme, onApply, onClose }: ImportCssPanelProps) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  const apply = (text: string) => {
    try {
      const imported = parseThemeCss(text, theme);
      onApply(imported);
      onClose();
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Invalid CSS.");
      return false;
    }
  };

  return (
    <Modal.Backdrop isOpen onOpenChange={(open) => { if (!open) onClose(); }}>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Import CSS theme</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <div className="flex min-w-0 flex-col gap-3">
                <p className="text-sm text-muted">
                  Paste HeroUI Web or Native CSS with both light and dark blocks.
                </p>
                <TextField value={draft} onChange={(value) => { setDraft(value); setError(null); }}>
                  <Label>Theme CSS</Label>
                  <TextArea
                    variant="secondary"
                    rows={14}
                    spellCheck={false}
                    maxLength={100000}
                    onPaste={(event) => {
                      const pasted = event.clipboardData.getData("text");
                      if (!pasted) return;
                      // A complete paste applies immediately. On failure, let the text
                      // be pasted normally so the user can correct it and try again.
                      if (apply(pasted)) event.preventDefault();
                    }}
                  />
                </TextField>
                {error && <p className="text-sm text-danger" role="alert">{error}</p>}
                <p className="text-xs text-muted">
                  The editor preserves supported OKLCH colors, corner radii, and --font-sans values.
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onPress={onClose}>Cancel</Button>
              <Button variant="primary" onPress={() => apply(draft)} isDisabled={!draft.trim()}>
                <Check size={16} /> Apply CSS
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
    </Modal.Backdrop>
  );
}
