interface HSL {
    h: number;
    s: number;
    l: number;
}

const rgbToHsl = (color: string): HSL | null => {
    let r: number, g: number, b: number;

    if (color.startsWith('rgb')) {
        // get the rgb values
        const rgbMatch = color.match(/\d+/g);
        if (!rgbMatch) return null;
        [r, g, b] = rgbMatch.map(num => parseInt(num) / 255);
    } else if (color.startsWith('#')) {
        const hex = color.substring(1);

        // get the rgb from the hex value
        r = parseInt(hex.substring(0, 2), 16) / 255;
        g = parseInt(hex.substring(2, 4), 16) / 255;
        b = parseInt(hex.substring(4, 6), 16) / 255;
    } else {
        return null;
    }

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;

    if (max !== min) {
        // calculate the hue and saturation
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

// apply the background colours
const applyTint = (themeHSL: HSL, originalHSL: HSL): string => {
    return originalHSL.l > 90
        ? `hsl(${themeHSL.h}, ${themeHSL.s}%, 95%)`
        : originalHSL.l < 10
            ? `hsl(${themeHSL.h}, ${themeHSL.s}%, 5%)`
            : `hsl(${themeHSL.h}, ${originalHSL.s + 20}%, ${originalHSL.l}%)`;
};

// apply the text colours
const applyTextColor = (themeHSL: HSL, textColor: HSL): string => {
    return textColor.l > 90
        ? `hsl(${themeHSL.h}, 80%, 30%)`
        : textColor.l < 10
            ? `hsl(${themeHSL.h}, 80%, 20%)`
            : `hsl(${themeHSL.h}, ${textColor.s}%, ${textColor.l}%)`;
};

// super special code for the dark theme
const applyDarkTheme = (element: HTMLElement, themeHSL: HSL, originalHSL: HSL, backgroundColor: string): void => {
    element.style.color = 'hsl(0, 0%, 100%)';
    if (backgroundColor === "rgba(0, 0, 0, 0)") return;
    element.style.backgroundColor = backgroundColor.startsWith('rgba(0, 0, 0, 0')
        ? `hsl(${themeHSL.h}, ${originalHSL.s}%, 35%)`
        : `hsl(0, 0%, ${100 - originalHSL.l * (100 - 13.5) / 100 + 20.5}%)`;
};

const changeElementStyles = (element: HTMLElement, themeHSL: HSL, isDarkTheme: boolean): void => {
    // get all of this here for efficiency
    const computedStyle = getComputedStyle(element);
    const backgroundColor = computedStyle.backgroundColor;
    const originalHSL = rgbToHsl(backgroundColor);
    const textColor = rgbToHsl(computedStyle.color);

    if (!originalHSL) return;

    if (isDarkTheme) {
        applyDarkTheme(element, themeHSL, originalHSL, backgroundColor);
    } else {
        if (backgroundColor && !(backgroundColor === "rgba(0, 0, 0, 0)") && !(element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
            element.style.backgroundColor = applyTint(themeHSL, originalHSL);
        }
        if (textColor) {
            element.style.color = applyTextColor(themeHSL, textColor);
        }
    }
};

export const changeTheme = (color: string) => {
    const themeHSL = rgbToHsl(color);
    if (!themeHSL) return;

    const isDarkTheme = color.toLowerCase() === '#232323';
    const elements = document.querySelectorAll<HTMLElement>('*');

    elements.forEach(element => changeElementStyles(element, themeHSL, isDarkTheme));
};
