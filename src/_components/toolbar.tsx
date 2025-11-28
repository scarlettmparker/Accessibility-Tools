import Button from "@/components/button";
import menu, { MenuEntry } from "@/content/menu";
import MenuItem from "../_components/menu-item";
import { useState } from "react";
import Slot from "@/components/slot";
import { useTranslation } from "react-i18next";

/**
 * Main entry component for the toolbar.
 */
const Toolbar = () => {
  const { t } = useTranslation();
  const menuItems = Object.entries(menu);
  const [currentMenuKey, setCurrentMenuKey] = useState<string | null>(null);

  /**
   * Handle menu select, deselect current menu if clicked twice.
   */
  const handleMenuSelect = (menuItemKey: string) => {
    setCurrentMenuKey((prev) => (prev === menuItemKey ? null : menuItemKey));
  };

  const currentMenu = currentMenuKey
    ? ([currentMenuKey, menu[currentMenuKey]] as [string, MenuEntry])
    : null;

  return (
    <>
      {currentMenu && (
        <Slot className="menu-item-wrapper">
          <MenuItem menuItem={currentMenu} t={t} />
        </Slot>
      )}
      <Slot className="toolbar-wrapper">
        <nav className="toolbar">
          {menuItems.map(([key], idx) => (
            // TODO: use i18n and aria-labels
            <Button
              key={idx}
              variant="secondary"
              title={`${t("toolbar.menu.title.prefix")} ${t(
                `toolbar.menu.title.${key}`
              )}`}
              aria-label={t(`toolbar.menu.title.${key}`)}
              onClick={() => handleMenuSelect(key)}
            >
              {t(`toolbar.menu.title.${key}`)}
            </Button>
          ))}
        </nav>
      </Slot>
    </>
  );
};

export default Toolbar;
