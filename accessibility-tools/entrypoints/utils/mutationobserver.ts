import { applySavedTextManipulations } from "./textmodify/manipulatetext";

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