import Text from "@/_components/menus/text";
import { TFunction } from "i18next";

type ComponentProps = {
  /**
   * i18n translation function.
   */
  t: TFunction;
};

export type MenuEntry = {
  /**
   * Path to icon for menu item button.
   */
  icon?: string;

  /**
   * Menu component to render.
   */
  component?: React.ComponentType<ComponentProps>;
};

const menu: Record<string, MenuEntry> = {
  "text-to-speech": {
    icon: "text-to-speech",
  },
  text: {
    icon: "text",
    component: Text,
  },
  theme: {
    icon: "theme",
  },
  dictionary: {
    icon: "dictionary",
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
