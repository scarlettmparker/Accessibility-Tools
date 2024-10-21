export let isReading = false;
let readTimeout: NodeJS.Timeout | null = null;

export const readSelectedText = (selection?: string) => {
    const selectedText = window.getSelection()?.toString();
    const utterance = new SpeechSynthesisUtterance(selection || selectedText);

    // set the language to the user's selected language
    // TODO: implement the language detector again :(
    const selectedLanguage = localStorage.getItem('selectedLanguage');
    if (selectedLanguage && selectedLanguage !== 'none') {
        utterance.lang = selectedLanguage;
    }
    window.speechSynthesis.speak(utterance);
};

const handleSelectionChange = () => {
    if (isReading) {
        // get the selected text and read it
        const selection = window.getSelection()?.toString().trim();
        if (selection) {
            if (readTimeout) {
                clearTimeout(readTimeout);
            }
            // ensure the text is read after a delay to give user time to select it
            readTimeout = setTimeout(() => {
                readSelectedText(selection);
                readTimeout = null;
            }, 1000);
        }
    }
};

export const startReading = () => {
    isReading = true;
    document.addEventListener('selectionchange', handleSelectionChange);
};

export const stopReading = () => {
    // stop reading and cancel the text to speech
    isReading = false;
    window.speechSynthesis.cancel();

    document.removeEventListener('selectionchange', handleSelectionChange); // ensure new text isn't picked up
    if (readTimeout) {
        clearTimeout(readTimeout);
        readTimeout = null;
    }
};
