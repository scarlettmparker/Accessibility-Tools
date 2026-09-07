import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@sun/components";
import { TFunction } from "i18next";
import { useState } from "react";
import { useCenteredDialogPosition } from "@/utils/dialog-position";
import { getShadowRoot } from "@/content/shadow-root";
import Dictionary from "./dictionary";

type DictionaryDialogProps = {
  /**
   * i18n translation function.
   */
  t: TFunction;
  /**
   * Dialog title.
   */
  title: string;
  /**
   * Called when the dialog is closed.
   */
  onClose: () => void;
  /**
   * Stack order among open dialogs.
   */
  stackIndex: number;
};

/**
 * Draggable dialog hosting the dictionary panel with source link in footer.
 */
const DictionaryDialog = (props: DictionaryDialogProps) => {
  const { t, title, onClose, stackIndex } = props;
  const position = useCenteredDialogPosition(stackIndex);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  return (
    <Dialog
      open
      onOpenChange={handleOpenChange}
      draggable
      position={position}
      container={getShadowRoot() ?? document.body}
      onKeyDown={handleKeyDown}
      className="menu-dialog"
    >
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <DialogBody data-no-drag>
        <Dictionary t={t} onSourceChange={setSourceUrl} />
      </DialogBody>
      <DialogFooter className="menu-dialog-footer">
        <span className="menu-dialog-footer-left">
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noreferrer"
              title={t("dictionary.source-title")}
              aria-label={t("dictionary.source-aria")}
            >
              {t("dictionary.source")}
            </a>
          )}
        </span>
        <Button
          variant="secondary"
          onClick={onClose}
          title={t("toolbar.menu.close")}
          aria-label={t("toolbar.menu.close")}
        >
          {t("toolbar.menu.close")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default DictionaryDialog;
