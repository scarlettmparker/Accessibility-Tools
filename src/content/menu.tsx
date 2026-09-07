import TextDialog from "@/_components/menus/text/text-dialog";
import TextPanel from "@/_components/menus/text/text";
import ThemeDialog from "@/_components/menus/theme/theme-dialog";
import DictionaryDialog from "@/_components/menus/dictionary/dictionary-dialog";
import { TFunction } from "i18next";

export type DialogProps = {
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

export type MenuEntry = {
  /**
   * Path to icon for menu item button.
   */
  icon?: string;

  /**
   * Panel component rendered without a dialog.
   */
  panel?: React.ComponentType<{ t: TFunction }>;

  /**
   * Dialog component for menus that open a dialog.
   */
  dialog?: React.ComponentType<DialogProps>;
};

// Re-export panels for direct use if needed
export { TextPanel, TextDialog, ThemeDialog, DictionaryDialog };

const menu: Record<string, MenuEntry> = {
  "text-to-speech": {
    icon: "text-to-speech",
  },
  text: {
    icon: "text",
    dialog: TextDialog,
    panel: TextPanel,
  },
  theme: {
    icon: "theme",
    dialog: ThemeDialog,
  },
  dictionary: {
    icon: "dictionary",
    dialog: DictionaryDialog,
  },
  translate: {
    icon: "translate",
  },
  magnify: {
    icon: "magnify",
  },
  manual: {
    icon: "manual",
  },
  settings: {
    icon: "settings",
  },
};

export default menu;
