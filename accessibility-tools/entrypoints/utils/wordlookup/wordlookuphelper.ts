import { PARTS_OF_SPEECH } from "../../consts/wordlookup";
import { parse } from 'node-html-parser';
import { HTMLElement as ParsedHTMLElement } from 'node-html-parser';
import { ParagraphData } from "../../types/types";

// custom hook to fetch wiktionary data
export const useWiktionaryData = (word: string) => {
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

// fetch the wiktionary data for a word
async function getWiktionaryData(word: string): Promise<string | undefined> {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: "fetchWiktionaryData", word: word }, (response) => {
            resolve(response);
        });
    });
}

export function parseWiktionaryData(data: string, word: string) {
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
