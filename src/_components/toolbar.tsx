import { Button, Card, CardBody } from "@sun/components";
import menu, { MenuEntry } from "@/content/menu";
import MenuItem from "../_components/menu-item";
import { useState } from "react";
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
        <div className="menu-item-wrapper">
          <Card>
            <CardBody>
              <MenuItem menuItem={currentMenu} t={t} />
            </CardBody>
          </Card>
        </div>
      )}
      <div className="toolbar-wrapper">
        <nav className="toolbar">
          {menuItems.map(([key]) => (
            <Button
              key={key}
              variant="secondary"
              title={`${t("toolbar.menu.title.prefix")} ${t(
                `toolbar.menu.title.${key}`,
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
