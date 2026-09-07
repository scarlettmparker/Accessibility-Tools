import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@sun/components";
import { TFunction } from "i18next";
import { useCenteredDialogPosition } from "@/utils/dialog-position";
import { getShadowRoot } from "@/content/shadow-root";
import Theme from "./theme";

type ThemeDialogProps = {
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
 * Draggable dialog hosting the theme panel.
 */
const ThemeDialog = (props: ThemeDialogProps) => {
  const { t, title, onClose, stackIndex } = props;
  const position = useCenteredDialogPosition(stackIndex);

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
        <Theme t={t} />
      </DialogBody>
      <DialogFooter>
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

export default ThemeDialog;
