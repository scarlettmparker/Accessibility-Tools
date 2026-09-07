import type { WordTranslation } from "@/generated/graphql";

type DefinitionTranslationProps = {
  /**
   * Translation to render.
   */
  translation: WordTranslation;
} & React.HTMLAttributes<HTMLLIElement>;

/**
 * Renders a single translation with its notes.
 */
const DefinitionTranslation = (props: DefinitionTranslationProps) => {
  const { translation, ...rest } = props;

  return (
    <li className="definition-translation" {...rest}>
      <span className="definition-translation-term">{translation.term}</span>
      {translation.wordType && (
        <span className="definition-translation-type">{translation.wordType}</span>
      )}
      {translation.usageNotes.length > 0 && (
        <span className="definition-translation-usage">({translation.usageNotes.join(", ")})</span>
      )}
    </li>
  );
};

export default DefinitionTranslation;
