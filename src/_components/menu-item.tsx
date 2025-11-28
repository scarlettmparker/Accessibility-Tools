import { MenuEntry } from "@/content/menu";
import { TFunction } from "i18next";

type MenuItemProps = {
  /**
   * Current menu entry.
   */
  menuItem: [string, MenuEntry];

  /**
   * i18n translation function.
   */
  t: TFunction;
};

/**
 * A single menu item. Takes a menu entry and constructs its layout depending on the menu item.
 */
const MenuItem = (props: MenuItemProps) => {
  const { menuItem, t } = props;
  const [key, menuEntry] = menuItem;

  if (!menuEntry.component) {
    console.warn("NO COMPONENT FOUND for key:", key);
    return null;
  }

  const Component = menuEntry.component;
  return <Component t={t} />;
};

export default MenuItem;
