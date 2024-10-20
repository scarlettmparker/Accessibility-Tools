// save original colours of all elements in the document
export const saveOriginalColors = ({ setOriginalColors }: { setOriginalColors: React.Dispatch<React.SetStateAction<{ colors: Map<string, string>; elements: HTMLElement[]; }>> }) => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('*'));
    const colorsMap = new Map<string, string>();

    elements.forEach(element => {
        const computedStyle = getComputedStyle(element);
        // store original colours for each element
        colorsMap.set(element.tagName + element.className + element.id, computedStyle.color);
        colorsMap.set(`${element.tagName}-bg`, computedStyle.backgroundColor);
        colorsMap.set(`${element.tagName}-border`, computedStyle.borderColor);
    });

    setOriginalColors({ colors: colorsMap, elements });
};

// reset the original colours of the elements
export const resetTheme = (element: HTMLElement, originalColors: Map<string, string>): void => {
    const key = element.tagName + element.className + element.id;

    // get the original color of the element from the map
    const resetStyle = (styleProperty: string, suffix: string = '') => {
        const originalColor = originalColors.get(`${key}${suffix}`);
        element.style[styleProperty as any] = originalColor || '';
    };

    resetStyle('color');
    resetStyle('backgroundColor', '-bg');
    resetStyle('borderColor', '-border');

    Array.from(element.children).forEach(child => {
        resetTheme(child as HTMLElement, originalColors);
    });
};
