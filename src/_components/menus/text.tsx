import { Button, Label, Select, SelectOption } from "@sun/components";
import { adjustFontSize, resetFontSize } from "@/utils/text";
import { fontFaces, setFontFace, getCurrentFontFace } from "@/utils/font-face";
import { TFunction } from "i18next";
import { useState, useEffect } from "react";

type TextProps = {
  /**
   * i18n translation function.
   */
  t: TFunction;
};

/**
 * Text adjustment menu panel.
 */
const Text = (props: TextProps) => {
  const { t } = props;
  const [selectedFont, setSelectedFont] = useState(getCurrentFontFace() || "");

  useEffect(() => {
    setFontFace(selectedFont);
  }, [selectedFont]);

  return (
    <main className="text-main">
      <section className="text-section">
        <Label>{t("text.font-size")}</Label>
        <Button
          variant="secondary"
          aria-label={t("text.reset-font-size.aria")}
          title={t("text.reset-font-size.title")}
          className="push-right"
          onClick={() => resetFontSize()}
        >
          {t("text.reset-font-size.text")}
        </Button>
        <Button
          size="icon"
          aria-label={t("text.decrease-font-size.aria")}
          title={t("text.decrease-font-size.title")}
          onClick={() => adjustFontSize("decrease")}
        >
          -
        </Button>
        <Button
          size="icon"
          aria-label={t("text.increase-font-size.aria")}
          title={t("text.increase-font-size.title")}
          onClick={() => adjustFontSize("increase")}
        >
          +
        </Button>
      </section>
      <section className="text-section">
        <Label>{t("text.font-face")}</Label>
        <Select
          value={selectedFont}
          onChange={(e) => setSelectedFont(e.target.value)}
          aria-label={t("text.font-face")}
          data-testid="font-face-select"
          className="push-right"
        >
          {fontFaces.map((font) => (
            <SelectOption key={font.value} value={font.value}>
              {font.name}
            </SelectOption>
          ))}
        </Select>
      </section>
    </main>
  );
};

export default Text;
