import { Button } from "@sun/components";
import { Check } from "lucide-react";
import { TFunction } from "i18next";
import { useState } from "react";
import {
  applyTheme,
  clearTheme,
  type ThemeName,
} from "@/utils/theme";

type ThemeProps = {
  /**
   * i18n translation function.
   */
  t: TFunction;
};

const THEME_ORDER: ThemeName[] = [
  "red",
  "green",
  "blue",
  "high-contrast",
  "dark",
];

/**
 * Theme picker panel.
 */
const Theme = (props: ThemeProps) => {
  const { t } = props;
  const [active, setActive] = useState<ThemeName | null>(null);

  const handleSelect = (theme: ThemeName) => {
    if (theme === active) {
      clearTheme();
      setActive(null);
      return;
    }
    applyTheme(theme);
    setActive(theme);
  };

  return (
    <main className="theme-list">
      {THEME_ORDER.map((theme) => (
        <Button
          key={theme}
          variant="secondary"
          className="theme-button"
          aria-pressed={theme === active}
          title={t(`theme.${theme}`)}
          aria-label={t(`theme.${theme}`)}
          onClick={() => handleSelect(theme)}
        >
          <span className={`theme-swatch theme-swatch-${theme}`} />
          <span className="theme-name">{t(`theme.${theme}`)}</span>
          <span className="theme-check">
            {theme === active && <Check width={16} height={16} />}
          </span>
        </Button>
      ))}
    </main>
  );
};

export default Theme;
