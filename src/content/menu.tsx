import Text from "@/_components/menus/text";
import TextToSpeech from "@/_components/menus/text-to-speech";
import Theme from "@/_components/menus/theme";
import Dictionary from "@/_components/menus/dictionary";
import Translate from "@/_components/menus/translate";
import Magnify from "@/_components/menus/magnify";
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
    component: TextToSpeech,
  },
  text: {
    icon: "text",
    component: Text,
  },
  theme: {
    icon: "theme",
    component: Theme,
  },
  dictionary: {
    icon: "dictionary",
    component: Dictionary,
  },
  translate: {
    icon: "translate",
    component: Translate,
  },
  magnify: {
    icon: "magnify",
    component: Magnify,
  },
  manual: {
    icon: "manual",
  },
  settings: {
    icon: "settings",
  },
};

export default menu;
