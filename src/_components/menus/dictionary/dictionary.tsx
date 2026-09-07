import { Card, CardBody, ScrollArea, SearchBar, Skeleton } from "@sun/components";
import { TFunction } from "i18next";
import { useState } from "react";
import type { DefineWordQuery } from "@/generated/graphql";
import { fetchDefineWord, WordDictionary } from "@/utils/api";
import DefinitionEntry from "./definition-entry";

type DictionaryProps = {
  /**
   * i18n translation function.
   */
  t: TFunction;
  /**
   * Called when the source URL changes.
   */
  onSourceChange?: (url: string | null) => void;
};

type WordData = NonNullable<DefineWordQuery["hadesQueries"]["defineWord"]>;

/**
 * Dictionary panel with a search bar that fetches monolingual English definitions.
 */
const Dictionary = (props: DictionaryProps) => {
  const { t, onSourceChange } = props;
  const [inputValue, setInputValue] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [result, setResult] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const word = inputValue.trim();
    if (!word) {
      return;
    }
    setSearchWord(word);
    setLoading(true);
    setError(null);
    setResult(null);
    onSourceChange?.(null);
    const response = await fetchDefineWord(word, WordDictionary.English);
    setLoading(false);
    if (!response.success) {
      setError(response.error ?? t("dictionary.error"));
      return;
    }
    const data = response.data?.hadesQueries?.defineWord as WordData;
    setResult(data);
    onSourceChange?.(data?.sourceUrl ?? null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void handleSearch();
    }
  };

  return (
    <main className="dictionary-panel">
      <div className="dictionary-search-row">
        <SearchBar
          value={inputValue}
          onChange={(value: string) => setInputValue(value)}
          onKeyDown={handleKeyDown}
          onSearch={() => void handleSearch()}
          placeholder={t("dictionary.placeholder")}
          aria-label={t("dictionary.placeholder")}
        />
      </div>
      {searchWord && (
        <Card className="dictionary-results" data-no-drag>
          <CardBody>
            {loading ? (
              <Skeleton className="dictionary-skeleton" />
            ) : error ? (
              <p className="dictionary-error">{error}</p>
            ) : result ? (
              result.entries.length === 0 ? (
                <p className="dictionary-empty">{t("dictionary.no-result")}</p>
              ) : (
                <ScrollArea maxHeight="22rem">
                  <ul className="dictionary-entries">
                    {result.entries.map((entry) => (
                      <li key={entry.id} className="dictionary-entry">
                        <DefinitionEntry entry={entry} />
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              )
            ) : null}
          </CardBody>
        </Card>
      )}
    </main>
  );
};

export default Dictionary;
