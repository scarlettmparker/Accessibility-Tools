import Button from "@/components/button";
import Label from "@/components/label";
import { adjustFontSize, resetFontSize } from "@/utils/text";
import { fontFaces, setFontFace, getCurrentFontFace } from "@/utils/font-face";
import { TFunction } from "i18next";
import { useState, useEffect } from "react";

type TextProps = {
  t: TFunction;
};

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
          style={{ marginLeft: "auto" }}
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
        <Label htmlFor="font-face-select">{t("text.font-face")}</Label>
        <select
          id="font-face-select"
          value={selectedFont}
          onChange={(e) => setSelectedFont(e.target.value)}
          aria-label={t("text.font-face")}
          style={{ marginLeft: "auto" }}
        >
          {fontFaces.map((font) => (
            <option key={font.value} value={font.value}>
              {font.name}
            </option>
          ))}
        </select>
      </section>
    </main>
  );
};

export default Text;
