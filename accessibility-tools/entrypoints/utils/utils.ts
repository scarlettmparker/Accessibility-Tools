import buttons from './json/buttondata.json';

const BUTTON_PATH = "/assets/images/buttons/";

export function getButtonIcon(index: number) {
    // get the button from its index and load the icon
    let name = buttons.find((button) => button.id === index);
    let path = `${BUTTON_PATH}${name?.id}.png`;
    let url = chrome.runtime.getURL(path);

    return url;
}

// hook to position a menu relative to a button in a toolbar
export const useMenuPosition = (menuRef: React.RefObject<HTMLDivElement>, buttonRef: React.RefObject<HTMLDivElement>, startIndex: number, numOpenMenus: unknown) => {
    useEffect(() => {
        // if both menu and button refs are available set the menu position
        if (menuRef.current && buttonRef.current) {
            const toolbarWidth = buttonRef.current.parentElement?.offsetWidth || 0;
            if (startIndex === 6) {
                menuRef.current.style.left = `${toolbarWidth - menuRef.current.offsetWidth / 2 - 14}px`;
            }
        }
    }, [numOpenMenus]);
};

// hook to position alternative text relative to a button
export const useAltTextPosition = (altRef: React.RefObject<HTMLDivElement>, showAltText: unknown, buttonSize: number) => {
    useEffect(() => {
        // if alt text should be shown and the reference is available, calculate and set the margin
        if (showAltText && altRef.current) {
            const altTextWidth = altRef.current.offsetWidth;
            altRef.current.style.marginLeft = `-${altTextWidth / 2 - buttonSize / 2}px`;
        }
    }, [showAltText]);
};