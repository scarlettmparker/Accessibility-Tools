import Text from "@/_components/menus/text";

export type MenuEntry = {
  /**
   * Path to icon for menu item button.
   */
  icon?: string;

  /**
   * Menu component to render.
   */
  component?: React.ComponentType;
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
