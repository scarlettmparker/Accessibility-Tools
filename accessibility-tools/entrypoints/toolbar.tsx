import React from 'react';
import { useLoadCss } from './utils/loadcss';
import buttons from './utils/buttondata.json';
import WordLookup from './menus/wordlookup';

interface ToolbarModalProps {
    shadowRoot: ShadowRoot;
}

type Button = {
    id: number;
    name: string;
    color?: string;
    hover_color: string;
}

const BUTTON_PATH = "/assets/images/buttons/";
const BUTTON_SIZE = 58;

// render the buttons using the button data
const renderButtons = (buttons: Button[], startIndex: number, className: string, numOpenMenus: number[], setNumOpenMenus: (value: number[]) => void) => (
    // map based on the index (left or right buttons)
    buttons.map((button: Button, index: number) => (
        <MenuComponent key={index + startIndex} button={button} startIndex={startIndex} className={className}
            index={index} numOpenMenus={numOpenMenus} setNumOpenMenus={setNumOpenMenus} />
    ))
);

// hook to position a menu relative to a button in a toolbar
const useMenuPosition = (menuRef: React.RefObject<HTMLDivElement>, buttonRef: React.RefObject<HTMLDivElement>, startIndex: number, numOpenMenus: unknown) => {
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
const useAltTextPosition = (altRef: React.RefObject<HTMLDivElement>, showAltText: unknown) => {
    useEffect(() => {
        // if alt text should be shown and the reference is available, calculate and set the margin
        if (showAltText && altRef.current) {
            const altTextWidth = altRef.current.offsetWidth;
            altRef.current.style.marginLeft = `-${altTextWidth / 2 - BUTTON_SIZE / 2}px`;
        }
    }, [showAltText]);
};

// button with alt text component for the toolbar
const ButtonWithAltText: React.FC<{ button: Button, index: number, startIndex: number, className: string, numOpenMenus: number[], menuRef: React.RefObject<HTMLDivElement>,
    setNumOpenMenus: (value: number[]) => void }> = ({ button, index, startIndex, className, numOpenMenus, setNumOpenMenus, menuRef }) => {
    
    // states and refs for the alt text and button
    const [showAltText, setShowAltText] = useState(false);
    const altRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);

    // set the position of the menu based on the button
    useMenuPosition(menuRef, buttonRef, startIndex, numOpenMenus);
    useAltTextPosition(altRef, showAltText);

    return (
        <div key={index} className={`toolbarButton ${className}`} style={{ backgroundColor: button.color || 'transparent' }}
            ref={buttonRef}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = button.hover_color; setShowAltText(true); }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = button.color || 'transparent'; setShowAltText(false); }}
            onClick={() => { index !== 8 && openMenus(setNumOpenMenus, numOpenMenus, index) }}>
            {showAltText && (
                <div className="buttonAlt" ref={altRef} onMouseEnter={() => setShowAltText(false)}>
                    {button.name}
                </div>
            )}
            <img src={getButtonIcon(index)} alt={button.name} width={BUTTON_SIZE} height={BUTTON_SIZE} draggable={false} />
        </div>
    );
}

// alt text button for the toolbar
const MenuComponent: React.FC<{
    button: Button, startIndex: number, className: string, index: number, numOpenMenus: number[], setNumOpenMenus: (value: number[]) => void
}> = ({ button, startIndex, className, index, numOpenMenus, setNumOpenMenus }) => {

    // refs for the alt text and menu
    const menuRef = useRef<HTMLDivElement>(null);

    return (
        <div className="toolbarParent">
            <ButtonWithAltText button={button} index={index + startIndex} startIndex={startIndex} className={className}
            numOpenMenus={numOpenMenus} setNumOpenMenus={setNumOpenMenus} menuRef={menuRef} />
            {numOpenMenus[startIndex + index] === 1 && (
                <div className="buttonMenu" ref={menuRef}>
                    {index == 3 && (
                        <WordLookup />
                    )}
                </div>
            )}
        </div>
    )
}

function openMenus(setNumOpenMenus: (value: number[]) => void, numOpenMenus: number[], index: number) {
    // if the menu is already open, close it
    if (numOpenMenus[index] === 1) {
        setNumOpenMenus(numOpenMenus.map((value, i) => (i === index ? 0 : value)));
    } else {
        setNumOpenMenus(numOpenMenus.map((value, i) => (i === index ? 1 : 0)));
    }
}

function getButtonIcon(index: number) {
    // get the button from its index and load the icon
    let name = buttons.find((button) => button.id === index);
    let path = `${BUTTON_PATH}${name?.id}.png`;
    let url = chrome.runtime.getURL(path);

    return url;
}

export const ToolbarModal: React.FC<ToolbarModalProps> = ({ shadowRoot }) => {
    // load the css file for the modal
    const [numOpenMenus, setNumOpenMenus] = useState(Array(buttons.length - 1).fill(0));
    useLoadCss(shadowRoot, 'toolbar.css');

    return (
        <div className="toolbarWrapper">
            <div className="buttonWrapper">
                {renderButtons(buttons.slice(0, 6), 0, "leftButtons", numOpenMenus, setNumOpenMenus)}
            </div>
            <div className="rightButtonWrapper">
                {renderButtons(buttons.slice(6), 6, "rightButtons", numOpenMenus, setNumOpenMenus)}
            </div>
        </div>
    );
};

export default ToolbarModal;