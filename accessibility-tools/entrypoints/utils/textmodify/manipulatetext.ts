import { textManipulations } from "@/entrypoints/consts/textmodify";

const styleCache = new Map<HTMLElement, CSSStyleDeclaration>();
const manipulationClasses = ['initial-font-size-modified', 'initial-line-height-modified', 'initial-letter-spacing-modified'];

function getCachedComputedStyle(element: HTMLElement): CSSStyleDeclaration {
    if (!styleCache.has(element)) {
        styleCache.set(element, window.getComputedStyle(element));
    }
    return styleCache.get(element)!;
}

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

    applyTextManipulationsToAllElements(manipulation, type);
    return textManipulations;
}

export function applyTextManipulationsToAllElements(manipulation: number, type?: number, savedModification?: number) {
    const elements = document.querySelectorAll('*:not(script):not(style):not(meta):not(title):not(link):not(br):not(hr):not(img):not(input):not(textarea):not(select):not(option):not(area):not(map):not(canvas):not(svg):not(iframe):not(object):not(embed):not(audio):not(video)');
    elements.forEach(element => {
        if (element.textContent) {
            if (type !== undefined) {
                applyTextManipulations(element as HTMLElement, manipulation, type);
            }
            if (savedModification !== undefined) {
                applySavedTextManipulations(element as HTMLElement, manipulation, savedModification);
            }
        }
    });
}

const applyTextManipulations = (element: HTMLElement, manipulation: number, type: number) => {
    const computedStyle = getCachedComputedStyle(element);

    // change font size
    if (manipulation === 0) {
        if (type == 1) {
            element.style.fontSize = `${parseFloat(element.style.fontSize) * textManipulations["size"]}px`;
        } else {
            element.style.fontSize = `${parseFloat(element.style.fontSize) / textManipulations["size"]}px`;
        }
    }

    // change line height
    if (manipulation === 1) {
        const currentLineHeight = element.style.lineHeight || computedStyle.lineHeight || "1.4";
        element.style.lineHeight = `${parseFloat(currentLineHeight) + type * textManipulations["line-height"]}em`;
    }

    // change character spacing
    if (manipulation === 2) {
        const currentLetterSpacing = element.style.letterSpacing.includes("em")
            ? parseFloat(element.style.letterSpacing)
            : 0;
        element.style.letterSpacing = `${currentLetterSpacing + type * textManipulations["character-spacing"]}em`;
    }

    // add the class to prevent re-application
    element.classList.add(manipulationClasses[manipulation]);
};

export const applySavedTextManipulations = (element: HTMLElement, manipulation: number, savedModification: number) => {
    const computedStyle = getCachedComputedStyle(element);

    if (element && (element.classList.contains(manipulationClasses[manipulation]) || element.classList.contains('modification-applied'))) {
        return;
    }

    switch (manipulation) {
        case 0:
            if (savedModification < 0) {
                element.style.fontSize = `${parseFloat(element.style.fontSize) / Math.pow(textManipulations["size"], Math.abs(savedModification))}px`;
            } else if (savedModification > 0) {
                element.style.fontSize = `${parseFloat(element.style.fontSize) * Math.pow(textManipulations["size"], savedModification)}px`;
            }
            break;
        case 1:
            const currentLineHeight = element.style.lineHeight || computedStyle.lineHeight || "1.4";
            //element.style.lineHeight = `${parseFloat(currentLineHeight) + savedModification}em`;
            break;
        case 2:
            element.style.letterSpacing = `${savedModification}em`;
            break;
    }

    element.classList.add(manipulationClasses[manipulation]);
};

// observer to watch for new elements
export const observer = new MutationObserver((mutationsList) => {
    const savedModifications = localStorage.getItem('savedTextModifications');
    if (savedModifications) {
        // apply the saved modifications to new elements
        const savedTextModifications = JSON.parse(savedModifications);
        mutationsList.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // applyTextManipulationsToNewElements(node, savedTextModifications);
                    }
                });
            }
        });
    }
});

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