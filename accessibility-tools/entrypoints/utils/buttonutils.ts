import { ButtonHandlersProps } from '../types/props';

// mouse enter handler
export const handleMouseEnter = ({ button, buttonRef, setShowAltText, numOpenMenus, index, buttonMenuRef }: ButtonHandlersProps) => {
    if (button && buttonRef?.current && setShowAltText) {
        buttonRef.current.style.backgroundColor = button.hover_color;
        setShowAltText(true);
    }

    // i looove making unoptimized web apps!
    if (numOpenMenus?.some((value, i) => value === 1 && i >= 6) && index && index < 6 && buttonMenuRef) {
        buttonMenuRef.current?.style.setProperty('z-index', '3');
    }
};

// mouse leave handler
export const handleMouseLeave = ({ button, buttonRef, setShowAltText }: ButtonHandlersProps) => {
    if (button && buttonRef?.current && setShowAltText) {
        buttonRef.current.style.backgroundColor = button.color || 'transparent';
        setShowAltText(false);
    }
};

// mouse down handler
export const handleMouseDown = ({ button, buttonRef }: ButtonHandlersProps) => {
    if (button && buttonRef?.current) {
        buttonRef.current.style.backgroundColor = button.click_color || 'transparent';
    }
};

// mouse up handler
export const handleMouseUp = ({ button, buttonRef }: ButtonHandlersProps) => {
    if (button && buttonRef?.current) {
        buttonRef.current.style.backgroundColor = button.hover_color;
    }
};

// click handler
export const handleClick = ({ setNumOpenMenus, numOpenMenus, index, buttonMenuRef }: ButtonHandlersProps) => {
    if (setNumOpenMenus && numOpenMenus && index !== undefined) {
        if (index !== 8) openMenus(setNumOpenMenus, numOpenMenus, index);
    }
    if (index && index < 6 && buttonMenuRef) {
        buttonMenuRef.current?.style.setProperty('z-index', '-1');
    }
};

function openMenus(setNumOpenMenus: (value: number[]) => void, numOpenMenus: number[], index: number) {
    // if the menu is already open, close it
    if (numOpenMenus[index] === 1) {
        setNumOpenMenus(numOpenMenus.map((value, i) => (i === index ? 0 : value)));
    } else {
        setNumOpenMenus(numOpenMenus.map((value, i) => (i === index ? 1 : 0)));
    }
}