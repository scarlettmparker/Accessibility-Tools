// save original colours of all elements in the document
export const saveOriginalColors = ({ setOriginalColors }: { setOriginalColors: React.Dispatch<React.SetStateAction<{ colors: Map<string, string>; elements: HTMLElement[]; }>> }) => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('*'));
    const colorsMap = new Map<string, string>();

    elements.forEach(element => {
        const computedStyle = getComputedStyle(element);
        const key = element.tagName + (element.className ? '.' + element.className : '') + (element.id ? '#' + element.id : '');

        // store original colors for each element
        colorsMap.set(key + '-color', computedStyle.color);
        colorsMap.set(key + '-bg', computedStyle.backgroundColor);
        colorsMap.set(key + '-border', computedStyle.borderColor);

        // Handle links and inputs with pseudo-classes and dynamic styles
        if (element.tagName === 'A') {
            ['hover', 'focus', 'visited'].forEach(pseudo => {
                const pseudoStyle = getComputedStyle(element, `:${pseudo}`);
                colorsMap.set(`${key}:${pseudo}-color`, pseudoStyle.color);
                colorsMap.set(`${key}:${pseudo}-bg`, pseudoStyle.backgroundColor);
                colorsMap.set(`${key}:${pseudo}-border`, pseudoStyle.borderColor);
            });
        }

        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            // Capture specific placeholder color for inputs/textareas
            const placeholderColor = computedStyle.getPropertyValue('::placeholder');
            if (placeholderColor) {
                colorsMap.set(`${key}-placeholder`, placeholderColor);
            }
        }
    });

    setOriginalColors({ colors: colorsMap, elements });
};

// reset the original colours of the elements
export const resetTheme = (element: HTMLElement, originalColors: Map<string, string>): void => {
    const key = element.tagName + (element.className ? '.' + element.className : '') + (element.id ? '#' + element.id : '') + element.getAttribute('name');

    // function to reset specific style properties
    const resetStyle = (styleProperty: string, suffix: string = '') => {
        const originalColor = originalColors.get(`${key}${suffix}`);
        
        // only reset if originalColor is valid and not transparent or undefined
        if (originalColor && originalColor !== 'rgba(0, 0, 0, 0)' && originalColor !== 'transparent') {
            element.style[styleProperty as any] = originalColor;
        } else {
            element.style[styleProperty as any] = '';
        }
    };

    resetStyle('color');
    resetStyle('backgroundColor', '-bg');
    resetStyle('borderColor', '-border');

    // recursively reset for child elements
    Array.from(element.children).forEach(child => {
        resetTheme(child as HTMLElement, originalColors);
    });
};