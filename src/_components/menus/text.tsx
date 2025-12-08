import Button from "@/components/button";
import Label from "@/components/label";
import { adjustFontSize } from "@/utils/text";
import { TFunction } from "i18next";

type TextProps = {
  t: TFunction;
};

const Text = (props: TextProps) => {
  const { t } = props;

  return (
    <main className="text-main">
      <section className="text-section">
        <Label>{t("text.font-size")}</Label>
        <Button
          size="icon"
          aria-label={t("text.decrease-font-size.aria")}
          title={t("text.decrease-font-size.title")}
          style={{ marginLeft: "auto" }}
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
    </main>
  );
};

export default Text;
