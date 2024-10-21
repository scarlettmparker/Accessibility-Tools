import React from "react";
import { useEffect } from "react";
import { SearchBarProps } from "../types/props";
import { ParagraphData } from "../types/types";
import { parseWiktionaryData, useWiktionaryData } from "../utils/wordlookup/wordlookuphelper";

// search bar to get wiktionary data
const SearchBar: React.FC<SearchBarProps> = ({ setProcessedWiktionaryData }) => {
    const [inputWord, setInputWord] = useState<string>(() => localStorage.getItem('inputWord') || '');
    const { wiktionaryData, fetchData } = useWiktionaryData(inputWord);

    // save search input
    useEffect(() => {
        localStorage.setItem('inputWord', inputWord);
    }, [inputWord]);

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
            <button onClick={handleSearch} className="extButton wiktionaryButton">Search</button>
        </div>
    );
};

// word lookup component
const WordLookup: React.FC = React.memo(() => {
    const [processedWiktionaryData, setProcessedWiktionaryData] = useState<Record<string, ParagraphData>>({});

    // load data from localStorage on component mount
    useEffect(() => {
        const savedData = localStorage.getItem('wiktionaryData');
        if (savedData) {
            setProcessedWiktionaryData(JSON.parse(savedData));
        }
    }, []);

    // save data to localStorage whenever processedWiktionaryData changes
    useEffect(() => {
        if (Object.keys(processedWiktionaryData).length > 0) {
            localStorage.setItem('wiktionaryData', JSON.stringify(processedWiktionaryData));
        }
    }, [processedWiktionaryData]);

    return (
        <div className="wordLookup">
            <SearchBar setProcessedWiktionaryData={setProcessedWiktionaryData} />
            <div className="wiktionaryData">
                {Object.keys(processedWiktionaryData).map((key) => (
                    <div key={key}>
                        <div className="posTitle">{processedWiktionaryData[key].partOfSpeech}</div>
                        <div className="posBody" dangerouslySetInnerHTML={{ __html: processedWiktionaryData[key].text }} />
                    </div>
                ))}
            </div>
        </div>
    );
});

export default WordLookup;