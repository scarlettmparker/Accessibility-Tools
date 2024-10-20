import React, { useEffect, useState } from 'react';
import { useElementData, useTranslationData, useUpdateTranslatedText } from '../utils/translate/translatehelper';
import languages from '../utils/json/languages.json';

const LanguageMenu = ({ selectedLanguage, setSelectedLanguage, searchQuery }: { selectedLanguage: string, setSelectedLanguage: (value: string) => void, searchQuery: string }) => {
    // filter languages based on search query
    const filteredLanguages = languages.filter(language =>
        language.language.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="translateSelectMenu">
            {filteredLanguages.map((language) => (
                <span key={language.language_code} onClick={() => setSelectedLanguage(language.language_code)}
                    className={`extButton languageButton ${selectedLanguage === language.language_code ? 'selected' : ''}`}>
                    {language.language}
                </span>
            ))}
        </div>
    );
};

export const Translate: React.FC = React.memo(() => {
    const [selectedLanguage, setSelectedLanguage] = useState(() => localStorage.getItem('selectedLanguage') || '');
    const [searchQuery, setSearchQuery] = useState(() => localStorage.getItem('languageSearchQuery') || '');
    const { elementData, originalData } = useElementData();
    const { translationData, fetchData } = useTranslationData(elementData, selectedLanguage, originalData);

    useUpdateTranslatedText(translationData);

    // save selected language to localStorage
    useEffect(() => {
        if (selectedLanguage) {
            localStorage.setItem('selectedLanguage', selectedLanguage);
        } else {
            localStorage.removeItem('selectedLanguage');
        }
    }, [selectedLanguage]);


    // fetch data only when a valid language is selected
    useEffect(() => {
        if (selectedLanguage) {
            fetchData();
        }
    }, [selectedLanguage, elementData, fetchData]);

    // clear storage when leaving the page to save space :3
    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.removeItem('selectedLanguage');
            localStorage.removeItem('originalData');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return (
        <div className="translate">
            <input type="text" placeholder="Search languages..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="languageSearchBar" />
            <LanguageMenu selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} searchQuery={searchQuery} />
        </div>
    );
});

export default Translate;
