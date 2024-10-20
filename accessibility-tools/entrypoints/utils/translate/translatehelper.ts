import { useState, useEffect, useCallback } from 'react';

// reset elements to their original text
const resetOriginalText = (originalData: { label: string, text: string }[]) => {
    originalData.forEach(({ label, text }) => {
        const element = document.querySelector(`.${label}`);
        if (element) {
            element.textContent = text;
        }
    });
};

export const fetchTranslation = async (data: { label: string, text: string }[], language: string) => {
    // post to the server to translate on back-end
    const response = await fetch('http://localhost:8080/translate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data, language })
    });

    const result = await response.json();
    return result;
};

export const filterTranslations = (translations: { label: string, text: string }[]) => {
    return translations.filter((item: { label: string, text: string }) => item.text.length > 0);
};

export const useTranslationData = (data: { label: string, text: string }[], language: string, originalData: { label: string, text: string }[]) => {
    const [translationData, setTranslationData] = useState<{ label: string, text: string }[]>([]);

    const fetchData = useCallback(async () => {
        if (language === "none") {
            resetOriginalText(originalData);
            setTranslationData([]); // clear translation data
            return;
        }

        try {
            const result = await fetchTranslation(data, language);

            // filter out any empty translations
            if (Array.isArray(result.translated_text)) {
                setTranslationData(filterTranslations(result.translated_text));
            } else {
                console.error('Unexpected response format:', result);
            }
        } catch (error) {
            console.error('Error fetching translation data:', error);
        }
    }, [data, language, originalData]);

    return { translationData, fetchData };
};

const getElementsWithText = () => {
    // get elements from page and filter out styling
    const elements = document.querySelectorAll('body *:not(script):not(style):not(head):not(meta)');
    const data: { label: string; text: string }[] = [];
    const original: { label: string; text: string }[] = [];
    const alphanumericRegex = /[a-zA-Z0-9]/; // regex ensure data is valid

    elements.forEach((element, index) => {
        const textNodes = Array.from(element.childNodes).filter(
            (node) => node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim() !== ''
        );

        if (textNodes.length > 0) {
            const combinedText = textNodes.map((node) => node.nodeValue!.trim()).join(' ');
            if (alphanumericRegex.test(combinedText) && combinedText.includes(' ') && !combinedText.includes('NaN')) {
                // add class names to elements to put translations back in the correct place
                const className = `translate-${index}`;
                element.classList.add(className);
                data.push({ label: className, text: combinedText });
                original.push({ label: className, text: combinedText });
            }
        }
    });

    return { data, original };
};

const saveOriginalDataToLocalStorage = (originalData: { label: string, text: string }[]) => {
    localStorage.setItem('originalData', JSON.stringify(originalData));
};

const loadOriginalDataFromLocalStorage = () => {
    const savedOriginalData = localStorage.getItem('originalData');
    return savedOriginalData ? JSON.parse(savedOriginalData) : null;
};

export const useElementData = () => {
    const [elementData, setElementData] = useState<{ label: string, text: string }[]>([]);
    const [originalData, setOriginalData] = useState<{ label: string, text: string }[]>([]);

    useEffect(() => {
        // in case menu is closed and opened (this is very inefficient design but whatever)
        const savedOriginalData = loadOriginalDataFromLocalStorage();

        if (savedOriginalData) {
            setOriginalData(savedOriginalData);
            setElementData(savedOriginalData);
        } else {
            const { data, original } = getElementsWithText();
            setElementData(data);
            setOriginalData(original);

            saveOriginalDataToLocalStorage(original);
        }
    }, []);

    return { elementData, originalData };
};

export const useUpdateTranslatedText = (translationData: { label: string, text: string }[]) => {
    useEffect(() => {
        if (translationData.length > 0) {
            // update the text content of the elements
            translationData.forEach(({ label, text }) => {
                const element = document.querySelector(`.${label}`);
                if (element) {
                    element.textContent = text;
                }
            });
        }
    }, [translationData]);
};