interface HSL {
    h: number;
    s: number;
    l: number;
}

export const rgbToHsl = (color: string): HSL | null => {
    let r: number, g: number, b: number;

    if (color.startsWith('rgb')) {
        const rgbMatch = color.match(/\d+/g);
        if (!rgbMatch) return null;
        [r, g, b] = rgbMatch.map(num => parseInt(num) / 255);
    } else if (color.startsWith('#')) {
        const hex = color.substring(1);
        r = parseInt(hex.substring(0, 2), 16) / 255;
        g = parseInt(hex.substring(2, 4), 16) / 255;
        b = parseInt(hex.substring(4, 6), 16) / 255;
    } else {
        return null;
    }

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h: number = 0, s: number = 0, l: number = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
};

export const applyTint = (element: HTMLElement, themeHSL: HSL): void => {
    // get the background color of the element
    const computedStyle = getComputedStyle(element);
    const backgroundColor = computedStyle.backgroundColor;
    const originalHSL = rgbToHsl(backgroundColor);

    if (!originalHSL || backgroundColor === "rgba(0, 0, 0, 0)") return;

    // apply tint to the background color
    element.style.backgroundColor = originalHSL.l > 90 
        ? `hsl(${themeHSL.h}, ${themeHSL.s}%, 95%)` 
        : originalHSL.l < 10 
        ? `hsl(${themeHSL.h}, ${themeHSL.s}%, 5%)` 
        : `hsl(${themeHSL.h}, ${originalHSL.s + 20}%, ${originalHSL.l}%)`;
};

export const applyTextColor = (element: HTMLElement, themeHSL: HSL): void => {
    // get the text color of the element
    const computedStyle = getComputedStyle(element);
    const originalColor = computedStyle.color;
    const originalHSL = rgbToHsl(originalColor);

    if (!originalHSL) return;

    // apply tint to the text color
    element.style.color = originalHSL.l > 90 
        ? `hsl(${themeHSL.h}, 80%, 90%)` 
        : originalHSL.l < 10 
        ? `hsl(${themeHSL.h}, 80%, 20%)` 
        : `hsl(${themeHSL.h}, ${originalHSL.s}%, ${originalHSL.l}%)`;
};

export const changeTheme = (color: string) => {
    const themeHSL = rgbToHsl(color);
    if (!themeHSL) return;

    const isDarkTheme = color.toLowerCase() === '#232323';

    document.querySelectorAll<HTMLElement>('*').forEach(element => {
        if (isDarkTheme) {
            // different algorithm because yea
            applyDarkTheme(element, themeHSL);
        } else {
            applyTint(element, themeHSL);
            applyTextColor(element, themeHSL);
        }

        // apply tint to the border color
        const borderColor = getComputedStyle(element).borderColor;
        const borderHSL = rgbToHsl(borderColor);
        if (borderHSL) {
            element.style.borderColor = `hsl(${themeHSL.h}, ${borderHSL.s}%, ${borderHSL.l}%)`;
        }
    });
};

const applyDarkTheme = (element: HTMLElement, themeHSL: HSL): void => {
    // get the background color of the element
    const computedStyle = getComputedStyle(element);
    const backgroundColor = computedStyle.backgroundColor;
    const originalHSL = rgbToHsl(backgroundColor);

    element.style.color = 'hsl(0, 0%, 100%)';

    // can't apply dark theme to dark elements
    if (originalHSL && originalHSL.l <= 50) return;
    if (element.tagName.toLowerCase() === 'input') return;
    if (!originalHSL || backgroundColor === "rgba(0, 0, 0, 0)") return;

    // apply tint to the background
    const newColor = backgroundColor.startsWith('rgba(0, 0, 0, 0') 
        ? `hsl(${themeHSL.h}, ${originalHSL.s}%, 35%)` 
        : `hsl(0, 0%, ${100 - originalHSL.l * (100 - 13.5) / 100 + 20.5}%)`;

    element.style.backgroundColor = newColor;
};