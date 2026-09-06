import { Button } from "@sun/components";
import menu from "@/content/menu";
import MenuDialog from "../_components/menu-dialog";
import { useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Bottom toolbar opening a draggable dialog per menu.
 */
const Toolbar = () => {
  const { t } = useTranslation();
  const menuItems = Object.entries(menu);
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const handleMenuSelect = (menuItemKey: string) => {
    setOpenMenus((prev) =>
      prev.includes(menuItemKey)
        ? prev.filter((entry) => entry !== menuItemKey)
        : [...prev, menuItemKey],
    );
  };

  const handleMenuClose = (menuItemKey: string) => {
    setOpenMenus((prev) => prev.filter((entry) => entry !== menuItemKey));
  };

  return (
    <>
      {openMenus.map((menuKey, index) => (
        <MenuDialog
          key={menuKey}
          menuItem={[menuKey, menu[menuKey]]}
          t={t}
          stackIndex={index}
          onClose={() => handleMenuClose(menuKey)}
        />
      ))}
      <div className="toolbar-wrapper">
        <nav className="toolbar">
          {menuItems.map(([key, entry]) => (
            <Button
              key={key}
              variant="secondary"
              disabled={!entry.component}
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
      </div>
    </>
  );
};

export default Toolbar;
