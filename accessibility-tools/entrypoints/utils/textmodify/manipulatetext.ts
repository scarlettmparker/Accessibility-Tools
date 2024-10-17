import { textManipulations } from "@/entrypoints/consts/textmodify";

export function manipulateText(manipulation: number, type: number, textManipulations: Record<string, number>): Record<string, number> {
    // get the key from the manipulation index
    const keys = Object.keys(textManipulations);
    const key = keys[manipulation];
    let savedModifications = JSON.parse(localStorage.getItem('savedTextModifications') || '{}');

    // update the negative or positive count based on the type value
    if (type === -1) {
        savedModifications[key].negative += 1;
    } else if (type === 1) {
        savedModifications[key].positive += 1;
    }

    localStorage.setItem('savedTextModifications', JSON.stringify(savedModifications));

    if (manipulation > 0) {
        applyTextManipulationsToAllElements(manipulation, type, savedModifications[key].positive - savedModifications[key].negative);
    } else {
        applyTextManipulationsToAllElements(manipulation, type);
    }
    return textManipulations;
}

export function applyTextManipulationsToAllElements(manipulation: number, type?: number, savedModification?: number) {
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
        if (element.textContent) {
            if (type !== undefined) {
                applyTextManipulations(element as HTMLElement, manipulation, type, savedModification);
            }
            if (savedModification !== undefined) {
                applySavedTextManipulations(element as HTMLElement, manipulation, savedModification);
            }
        }
    });
}

const applyTextManipulations = (element: HTMLElement, manipulation: number, type: number, savedModification?: number) => {
    // change font size
    if (manipulation === 0) {
        if (type == 1) {
            element.style.fontSize = `${parseFloat(element.style.fontSize) * textManipulations["size"]}px`;
        } else {
            element.style.fontSize = `${parseFloat(element.style.fontSize) / textManipulations["size"]}px`;
        }
    }

    // change character spacing
    if (manipulation === 1) {
        const currentLetterSpacing = element.style.letterSpacing.includes("rem") ? parseFloat(element.style.letterSpacing) : 0;
        if (savedModification) {
            element.style.letterSpacing = `${savedModification * textManipulations["character-spacing"]}px`;
            return;
        } else {
            element.style.letterSpacing = `${currentLetterSpacing + type * textManipulations["character-spacing"]}rem`;
        }
    }
};

export const applySavedTextManipulations = (element: HTMLElement, manipulation: number, savedModification: number) => {
    switch (manipulation) {
        case 0:
            // modify the text size
            if (savedModification < 0) {
                element.style.fontSize = `${parseFloat(element.style.fontSize) / Math.pow(textManipulations["size"], Math.abs(savedModification))}px`;
            } else if (savedModification > 0) {

                element.style.fontSize = `${parseFloat(element.style.fontSize) * Math.pow(textManipulations["size"], savedModification)}px`;
            }
            break;
        case 1:
            // modify the letter spacing
            if (typeof savedModification === 'number') {
                element.style.letterSpacing = `${savedModification * textManipulations["character-spacing"]}rem`;
            }
            break;
    }
};

// observer to watch for new elements
export const mutationObserverCallback = (mutationsList: MutationRecord[]) => {
    const savedModifications = localStorage.getItem('savedTextModifications');
    if (savedModifications) {
        // apply the saved modifications to new elements
        const savedTextModifications = JSON.parse(savedModifications);
        mutationsList.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        applyTextManipulationsToNewElements(node, savedTextModifications);
                    }
                });
            }
        });
    }
};

const applyTextManipulationsToNewElements = (node: Node, savedTextModifications: { [key: string]: number }) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;

        // apply modifications to the current element
        Object.keys(savedTextModifications).forEach((key, index) => {
            const value = savedTextModifications[key];
            applySavedTextManipulations(element, index, value);
        });
    }
};