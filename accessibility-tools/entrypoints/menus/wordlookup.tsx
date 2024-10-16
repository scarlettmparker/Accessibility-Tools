import React from "react";
import { parse } from 'node-html-parser';
import { HTMLElement as ParsedHTMLElement } from 'node-html-parser';
import { useEffect } from "react";

// all parts of speech on wiktionary (there are more and i will eventually add them all)
const PARTS_OF_SPEECH = {
    adposition: "Adposition",
    affix: "Affix",
    antonyms: "Antonyms",
    character: "Character",
    number: "Number",
    symbol: "Symbol",
    adjective: "Adjective",
    adverb: "Adverb",
    ambiposition: "Ambiposition",
    article: "Article",
    circumposition: "Circumposition",
    classifier: "Classifier",
    conjunction: "Conjunction",
    contraction: "Contraction",
    counter: "Counter",
    determiner: "Determiner",
    etymology: "Etymology",
    ideophone: "Ideophone",
    interjection: "Interjection",
    noun: "Noun",
    numeral: "Numeral",
    participle: "Participle",
    particle: "Particle",
    postposition: "Postposition",
    preposition: "Preposition",
    pronoun: "Pronoun",
    pronunciation: "Pronunciation",
    "proper-noun": "Proper_noun",
    verb: "Verb",
    circumfix: "Circumfix",
    "combining-form": "Combining_form",
    infix: "Infix",
    interfix: "Interfix",
    prefix: "Prefix",
    root: "Root",
    suffix: "Suffix",
    "diacritical-mark": "Diacritical_mark",
    letter: "Letter",
    ligature: "Ligature",
    "punctuation-mark": "Punctuation_mark",
    syllable: "Syllable",
    synonyms: "Synonyms",
    phrase: "Phrase",
    proverb: "Proverb",
    "prepositional-phrase": "Prepositional_phrase",
    "han-character": "Han_character",
    hanzi: "Hanzi",
    kanji: "Kanji",
    hanja: "Hanja",
    romanization: "Romanization",
    logogram: "Logogram",
    determinative: "Determinative",
    abbreviation: "Abbreviation",
    acronym: "Acronym",
    initialism: "Initialism",
    "cardinal-number": "Cardinal_number",
    "ordinal-number": "Ordinal_number",
    "cardinal-numeral": "Cardinal_numeral",
    "ordinal-numeral": "Ordinal_numeral",
    clitic: "Clitic",
    gerund: "Gerund",
    idiom: "Idiom",
}


// interface for paragraph data
interface ParagraphData {
    text: string;
    partOfSpeech: string;
}

// custom hook to fetch wiktionary data
const useWiktionaryData = (word: string) => {
    const [wiktionaryData, setWiktionaryData] = useState<string | undefined>(undefined);

    const fetchData = async () => {
        try {
            const data = await getWiktionaryData(word);
            if (data) {
                setWiktionaryData(data);
            }
        } catch (error) {
            console.error('Error fetching Wiktionary data:', error);
        }
    };

    return { wiktionaryData, fetchData };
};

interface SearchBarProps {
    setProcessedWiktionaryData: (value: Record<string, ParagraphData>) => void;
}

// search bar to get wiktionary data
const SearchBar: React.FC<SearchBarProps> = ({ setProcessedWiktionaryData }) => {
    const [inputWord, setInputWord] = useState<string>('');
    const { wiktionaryData, fetchData } = useWiktionaryData(inputWord);

    // process the wiktionary data when the input word is set
    useEffect(() => {
        if (wiktionaryData) {
            const processedData = parseWiktionaryData(wiktionaryData, inputWord);
            setProcessedWiktionaryData(processedData);
        }
    }, [wiktionaryData, setProcessedWiktionaryData]);

    const handleSearch = () => {
        fetchData();
    };

    return (
        <div className="searchBarWrapper">
            <input type="text" placeholder="Search word..." className="dictionarySearch" value={inputWord} onChange={(e) => setInputWord(e.target.value)} />
            <button onClick={handleSearch} className="extButton">Search</button>
        </div>
    );
};

// word lookup component
const WordLookup: React.FC = React.memo(() => {
    const [processedWiktionaryData, setProcessedWiktionaryData] = useState<Record<string, ParagraphData>>({});

    return (
        <div className="wiktionaryData">
            <SearchBar setProcessedWiktionaryData={setProcessedWiktionaryData} />
            {Object.keys(processedWiktionaryData).map((key) => (
                <div key={key}>
                    <div className="posTitle">{processedWiktionaryData[key].partOfSpeech}</div>
                    <div className="posBody" dangerouslySetInnerHTML={{ __html: processedWiktionaryData[key].text }} />
                </div>
            ))}
        </div>
    );
});

// fetch the wiktionary data for a word
async function getWiktionaryData(word: string): Promise<string | undefined> {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: "fetchWiktionaryData", word: word }, (response) => {
            resolve(response);
        });
    });
}

function parseWiktionaryData(data: string, word: string) {
    const root = parse(data);
    const WIKTIONARY_URL = "https://en.wiktionary.org";

    // remove all audio metadata divs
    const audioMetaElements = root.querySelectorAll('td.audiometa');
    audioMetaElements.forEach((element) => {
        element.remove();
    });

    // update all a href links
    const links = root.querySelectorAll('a');
    links.forEach((a) => {
        const href = a.getAttribute('href');
        // only update relative links
        if (href && !href.startsWith('http')) {
            // update the href to open in a new tab and point to correct url
            a.setAttribute('href', WIKTIONARY_URL + href);
            a.setAttribute('target', '_blank');
        }
    });

    const wiktionaryData: Record<string, ParagraphData> = {};

    // get the headers
    const h3Elements = root.querySelectorAll('h3');
    h3Elements.forEach((h3Element) => {
        const parentDiv = h3Element.parentNode as unknown as HTMLElement;
        if (parentDiv && parentDiv.tagName === 'DIV' && parentDiv.classList.contains('mw-heading')) {
            // get the list of elements under the h3 element
            const listElements = Object.values(getHeaderChildren(h3Element));
            listElements.forEach((paragraphData) => {
                wiktionaryData[paragraphData.text] = paragraphData;
            });
        }
    });

    const partsOfSpeechValues = Object.values(PARTS_OF_SPEECH);


    /* FILTER OUT POS, TO BE EXPANDED ON */


    // remove any non valid parts of speech from the const
    Object.entries(wiktionaryData).forEach(([key, paragraphData]) => {
        const containsPartOfSpeech = partsOfSpeechValues.some(posValue => paragraphData.partOfSpeech.includes(posValue));
        if (!containsPartOfSpeech) {
            delete wiktionaryData[key];
        }
    });


    return wiktionaryData;
}

// get the data after the headers for processing
function getHeaderChildren(header: ParsedHTMLElement): Record<string, ParagraphData> {
    const paragraphs: Record<string, ParagraphData> = {};

    let nextElement = header.parentNode?.nextElementSibling;
    let index = 0;

    while (nextElement) {
        // when the next div is found stop searching
        if (nextElement.classList && nextElement.classList.contains('mw-heading')) {
            break;
        }

        // capture additional formatting
        const htmlText = nextElement.innerHTML;

        // add to the paragraphs object
        paragraphs[`paragraph_${index}`] = {
            text: htmlText,
            partOfSpeech: header.id
        };

        index++;

        nextElement = nextElement.nextElementSibling;
    }
    return paragraphs;
}


export default WordLookup;