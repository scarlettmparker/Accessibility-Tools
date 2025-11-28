import { MenuEntry } from "@/content/menu";

type MenuItemProps = {
  /**
   * Current menu entry.
   */
  menuItem: [string, MenuEntry];
};

/**
 * A single menu item. Takes a menu entry and constructs its layout depending on the menu item.
 */
const MenuItem = (props: MenuItemProps) => {
  const { menuItem } = props;
  const [key, menuEntry] = menuItem;

  if (!menuEntry.component) {
    console.log("NO COMPONENT FOUND for key:", key);
    return null;
  }

  const Component = menuEntry.component;
  return <Component />;
};

export default MenuItem;
