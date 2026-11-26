import { useState } from "react";
import { Button, Label, Modal, TextArea, TextField } from "@heroui/react";
import { Check } from "lucide-react";
import { MINIMAL_THEME_CSS, parseThemeCss } from "../import-css";
import type { ThemePlatform } from "../export-css";
import type { ThemeConfig } from "../model";

interface ImportCssPanelProps {
  platform: ThemePlatform;
  onApply: (theme: ThemeConfig) => void;
  onClose: () => void;
}

/** Import only validated HeroUI tokens; never mount pasted CSS as a style block. */
export function ImportCssPanel({
  platform,
  onApply,
  onClose,
}: ImportCssPanelProps) {
  const [draft, setDraft] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const apply = (text: string) => {
    try {
      const imported = parseThemeCss(text);
      onApply(imported);
      setDraft(text);
      setFeedback({ type: "success", message: "Theme CSS applied." });
      return true;
    } catch (cause) {
      setFeedback({
        type: "error",
        message: cause instanceof Error ? cause.message : "Invalid CSS.",
      });
      return false;
    }
  };

  return (
    <Modal.Backdrop
      isOpen
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Modal.Container>
        <Modal.Dialog>
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>Import CSS theme</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <div className="flex min-w-0 flex-col gap-3">
              <p className="text-sm text-muted">
                Paste HeroUI CSS to replace the current customizations.
              </p>
              <TextField
                value={draft}
                onChange={(value) => {
                  setDraft(value);
                  setFeedback(null);
                }}
              >
                <Label>Theme CSS</Label>
                <TextArea
                  variant="secondary"
                  rows={14}
                  placeholder={MINIMAL_THEME_CSS[platform]}
                  spellCheck={false}
                  maxLength={100000}
                  onPaste={(event) => {
                    const pasted = event.clipboardData.getData("text");
                    if (!pasted) return;
                    // Valid pasted CSS applies immediately. On failure, let the text
                    // be pasted normally so the user can correct it and try again.
                    if (apply(pasted)) event.preventDefault();
                  }}
                />
              </TextField>
              {feedback?.type === "error" && (
                <p className="text-sm text-danger" role="alert">
                  {feedback.message}
                </p>
              )}
              {feedback?.type === "success" && (
                <p className="text-sm text-success" role="status">
                  {feedback.message}
                </p>
              )}
              <p className="text-xs text-muted">
                Supported declarations retain their CSS values, including var()
                and calc().
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button size="lg" variant="tertiary" onPress={onClose}>
              Close
            </Button>
            <Button
              size="lg"
              variant="primary"
              onPress={() => apply(draft)}
              isDisabled={!draft.trim()}
            >
              <Check size={16} /> Apply CSS
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
