import { Badge } from "@sun/components";
import type { WordEntry } from "@/generated/graphql";
import DefinitionTranslation from "./definition-translation";

type DefinitionEntryProps = {
  /**
   * Word entry to render.
   */
  entry: WordEntry;
} & React.HTMLAttributes<HTMLLIElement>;

/**
 * Renders a single WordReference entry with its translations and examples.
 */
const DefinitionEntry = (props: DefinitionEntryProps) => {
  const { entry, ...rest } = props;

  return (
    <li className="definition-entry" {...rest}>
      <div className="definition-entry-header">
        <span className="definition-entry-term">{entry.term}</span>
        {entry.wordType && <Badge>{entry.wordType}</Badge>}
        {entry.sense && <span className="definition-entry-sense">{entry.sense}</span>}
      </div>
      <ul className="definition-entry-translations">
        {entry.translations.map((translation, index) => (
          <DefinitionTranslation key={index} translation={translation} />
        ))}
      </ul>
      {entry.examples.length > 0 && (
        <ul className="definition-entry-examples">
          {entry.examples.map((example, index) => (
            <li key={index} className="definition-entry-example">
              {example}
            </li>
          ))}
        </ul>
      )}
      {entry.note && <p className="definition-entry-note">{entry.note}</p>}
    </li>
  );
};

export default DefinitionEntry;
