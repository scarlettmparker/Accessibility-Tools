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

const fetchTranslationBatch = async (batch: { label: string, text: string }[], language: string) => {
    const response = await fetch('http://localhost:8080/translate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: batch, language })
    });

    const result = await response.json();
    return result;
};

export const fetchTranslation = async (data: { label: string, text: string }[], language: string) => {
    const batchSize = 100;
    const batches = [];

    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        batches.push(fetchTranslationBatch(batch, language));
    }

    const results = await Promise.all(batches);
    return results.flatMap(result => result.translated_text);
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
            if (Array.isArray(result)) {
                setTranslationData(filterTranslations(result));
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
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    const data: { label: string; text: string }[] = [];
    const original: { label: string; text: string }[] = [];
    const alphanumericRegex = /[a-zA-Z0-9]/; // regex ensure data is valid
    let node: Node | null;
    let index = 0;

    const processNodes = () => {
        let count = 0;
        // process 100 nodes per frame to avoid blocking the main thread
        while ((node = walker.nextNode()) && count < 100) {
            const parentElement = node.parentElement;
            if (parentElement && !parentElement.matches('script, style, head, meta') && node.nodeValue?.trim() !== '') {
                if (Array.from(parentElement.classList).some(className => className.startsWith('translate-'))) {
                    continue;
                }
                const combinedText = node.nodeValue!.trim();
                if (alphanumericRegex.test(combinedText) && combinedText.includes(' ') && !combinedText.includes('NaN')) {
                    const className = `translate-${index}`;
                    parentElement.classList.add(className);
                    data.push({ label: className, text: combinedText });
                    original.push({ label: className, text: combinedText });
                    index++;
                }
            }
            count++;
        }

        if (node) {
            requestAnimationFrame(processNodes);
        }
    };

    requestAnimationFrame(processNodes);

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