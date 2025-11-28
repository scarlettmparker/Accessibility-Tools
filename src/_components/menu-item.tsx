import { MenuEntry } from "@/content/menu";

type MenuItemProps = {
  /**
   * Current menu entry.
   */
  menu: [string, MenuEntry];
};

/**
 * A single menu item. Takes a menu entry and constructs its layout depending on the menu item.
 */
const MenuItem = (props: MenuItemProps) => {
  const { menu } = props;
  return <div className="menu-item">{menu[0]}</div>;
};

export default MenuItem;
