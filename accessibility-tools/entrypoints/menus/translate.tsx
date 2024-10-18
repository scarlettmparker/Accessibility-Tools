import React, { useState } from 'react';

const useTranslationData = (raw_text: string) => {
    const [translationData, setTranslationData] = useState<string | undefined>(undefined);

    // fetch the translation dat
    const fetchData = async () => {
        try {
            const data = await getTranslationData(raw_text);
            if (data) {
                setTranslationData(data as string);
            }
        } catch (error) {
            console.error('Error fetching translation data:', error);
        }
    };

    return { translationData, fetchData };
};

const Translate: React.FC = React.memo(() => {
    const { translationData, fetchData } = useTranslationData('test translate page');

    // when translation data updates
    useEffect(() => {
        if (translationData) {
            console.log(translationData);
        }
    }, [translationData]);

    return (
        <div className="translate">
            <button onClick={async () => await fetchData()}>test translate page</button>
        </div>
    );
});

async function getTranslationData(raw_text: string) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: "translateText", raw_text: raw_text }, (response) => {
            resolve(response);
        });
    });
}

export default Translate;