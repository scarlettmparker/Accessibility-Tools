import React, { useState, useEffect, useCallback } from 'react';

const useTranslationData = (data: { label: string, text: string }[], language: string) => {
    const [translationData, setTranslationData] = useState<{ label: string, text: string }[]>([]);

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8080/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data, language })
            });
            const result = await response.json();

            // filter out empty translations
            if (Array.isArray(result.translated_text)) {
                setTranslationData(result.translated_text.filter((item: { label: string, text: string }) => item.text.length > 0));
            } else {
                console.error('Unexpected response format:', result);
            }
        } catch (error) {
            console.error('Error fetching translation data:', error);
        }
    }, [data, language]); // added dependencies

    return { translationData, fetchData };
};

const Translate: React.FC = React.memo(() => {
    const [elementData, setElementData] = useState<{ label: string, text: string }[]>([]);

    useEffect(() => {
        // get all elements on the page that contain text
        const elements = document.querySelectorAll('body *:not(script):not(style):not(head):not(meta)');
        const data: { label: string; text: string }[] = [];
        const alphanumericRegex = /[a-zA-Z0-9]/;

        elements.forEach((element, index) => {
            // get all text nodes from the element
            const textNodes = Array.from(element.childNodes).filter(
                (node) => node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim() !== ''
            );

            // check for valid text nodes
            if (textNodes.length > 0) {
                const combinedText = textNodes.map((node) => node.nodeValue!.trim()).join(' ');
                if (alphanumericRegex.test(combinedText) && combinedText.includes(' ') && !combinedText.includes('NaN')) {
                    // add classes to elements if they're valid text nodes
                    const className = `translate-${index}`;
                    element.classList.add(className);
                    data.push({ label: className, text: combinedText });
                }
            }
        });

        setElementData(data);
    }, []);

    const { translationData, fetchData } = useTranslationData(elementData, 'el');

    useEffect(() => {
        fetchData();
    }, [elementData, fetchData]);

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

    return (
        <div className="translate">
            <button onClick={async () => await fetchData()}>test translate page</button>
        </div>
    );
});

export default Translate;
