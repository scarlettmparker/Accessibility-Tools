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
import { MenuEntry } from "@/content/menu";
import { centeredDialogPosition } from "@/utils/dialog-position";
import { getShadowRoot } from "@/content/shadow-root";
import MenuItem from "../_components/menu-item";

type MenuDialogProps = {
  /**
   * Menu entry to render.
   */
  menuItem: [string, MenuEntry];

  /**
   * i18n translation function.
   */
  t: TFunction;

  /**
   * Stack order among open dialogs, used to cascade initial positions.
   */
  stackIndex: number;

  /**
   * Called when the dialog is closed.
   */
  onClose: () => void;
};

const CASCADE_OFFSET_PX = 28;

/**
 * Draggable library dialog hosting a single toolbar menu.
 */
const MenuDialog = (props: MenuDialogProps) => {
  const { menuItem, t, stackIndex, onClose } = props;
  const [key] = menuItem;
  const [initialPosition] = useState(() => {
    const centered = centeredDialogPosition(
      { top: window.innerHeight / 2, left: window.innerWidth / 2 },
      20,
    );
    return {
      top: centered.top + stackIndex * CASCADE_OFFSET_PX,
      left: centered.left + stackIndex * CASCADE_OFFSET_PX,
    };
  });

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
      position={initialPosition}
      container={getShadowRoot() ?? document.body}
      onKeyDown={handleKeyDown}
    >
      <DialogHeader>
        <DialogTitle>{t(`toolbar.menu.title.${key}`)}</DialogTitle>
      </DialogHeader>
      <DialogBody data-no-drag>
        <MenuItem menuItem={menuItem} t={t} />
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

export default MenuDialog;
