import React from 'react';
import { useLoadCss } from './utils/loadcss';
import { handleMouseEnter, handleClick, handleMouseDown, handleMouseLeave, handleMouseUp } from './utils/buttonutils';
import { Button } from './types/types';
import { mutationObserverCallback } from './utils/mutationobserver';
import { useAltTextPosition, useMenuPosition, getButtonIcon } from './utils/utils';
import { applyTextManipulationsToAllElements } from './utils/textmodify/manipulatetext';
import { textManipulations } from './consts/textmodify';
import buttons from './utils/json/buttondata.json';
import TextModify from './menus/textmodify';
import WordLookup from './menus/wordlookup';
import Translate from './menus/translate';
import Theme from './menus/theme';

interface ToolbarModalProps {
    shadowRoot: ShadowRoot;
}

const BUTTON_SIZE = 58;

const BUTTON_MENUS: { [key: number]: React.FC | undefined } = {
    1: TextModify,
    2: Theme,
    3: WordLookup,
    4: Translate
}

// render the buttons using the button data
const renderButtons = (buttons: Button[], startIndex: number, className: string, numOpenMenus: number[], setNumOpenMenus: (value: number[]) => void, buttonMenuRef: React.RefObject<HTMLDivElement>) => (
    // map based on the index (left or right buttons)
    buttons.map((button: Button, index: number) => (
        <MenuComponent key={index + startIndex} button={button} startIndex={startIndex} className={className}
            index={index} numOpenMenus={numOpenMenus} setNumOpenMenus={setNumOpenMenus} buttonMenuRef={buttonMenuRef} />
    ))
);


// button with alt text component for the toolbar
const ButtonWithAltText: React.FC<{
    button: Button, index: number, startIndex: number, className: string, numOpenMenus: number[],
    menuRef: React.RefObject<HTMLDivElement>, setNumOpenMenus: (value: number[]) => void, buttonMenuRef: React.RefObject<HTMLDivElement>
}> = ({ button, index, startIndex, className, numOpenMenus, setNumOpenMenus, menuRef, buttonMenuRef }) => {

    // react states for the alt text and button
    const [showAltText, setShowAltText] = useState(false);
    const altRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);

    useMenuPosition(menuRef, buttonRef, startIndex, numOpenMenus);
    useAltTextPosition(altRef, showAltText, BUTTON_SIZE);

    return (
        <div key={index} className={`toolbarButton ${className}`} ref={buttonRef} style={{ backgroundColor: button.color || 'transparent' }}
            onMouseEnter={() => handleMouseEnter({ button, buttonRef, setShowAltText, numOpenMenus, index, buttonMenuRef })}
            onMouseLeave={() => handleMouseLeave({ button, buttonRef, setShowAltText })}
            onMouseDown={() => handleMouseDown({ button, buttonRef })} onMouseUp={() => handleMouseUp({ button, buttonRef })}
            onClick={() => handleClick({ setNumOpenMenus, numOpenMenus, index, buttonMenuRef })}>

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
    button: Button, startIndex: number, className: string, index: number, numOpenMenus: number[], setNumOpenMenus: (value: number[]) => void, buttonMenuRef: React.RefObject<HTMLDivElement>
}> = ({ button, startIndex, className, index, numOpenMenus, setNumOpenMenus, buttonMenuRef }) => {

    // refs for the alt text and menu
    const menuRef = useRef<HTMLDivElement>(null);

    return (
        <div className="toolbarParent">
            <ButtonWithAltText button={button} index={index + startIndex} startIndex={startIndex} className={className}
                numOpenMenus={numOpenMenus} setNumOpenMenus={setNumOpenMenus} menuRef={menuRef} buttonMenuRef={buttonMenuRef} />
            <div 
                className="buttonMenu" 
                ref={menuRef} 
                style={{ display: numOpenMenus[startIndex + index] === 1 ? 'block' : 'none' }}
            >
                {BUTTON_MENUS[startIndex + index] && (() => {
                    const MenuComponent = BUTTON_MENUS[startIndex + index];
                    return MenuComponent ? <MenuComponent /> : null;
                })()}
            </div>
        </div>
    );
}

export const ToolbarModal: React.FC<ToolbarModalProps> = ({ shadowRoot }) => {
    const [numOpenMenus, setNumOpenMenus] = useState(Array(buttons.length - 1).fill(0));
    const leftButtonRef = useRef<HTMLDivElement>(null);
    const rightButtonRef = useRef<HTMLDivElement>(null);
    const savedModifications = localStorage.getItem('savedTextModifications');

    const observer = new MutationObserver(mutationObserverCallback);

    // allow menus to be closed with escape
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            setNumOpenMenus(Array(buttons.length - 1).fill(0));
        }
    };

    // start observing the document for added nodes
    useEffect(() => {
        if (savedModifications) {
            const savedTextModifications = JSON.parse(savedModifications);
            Object.keys(textManipulations).forEach((key, index) => {
                // apply the saved modifications to all elements
                const manipulationValue = savedTextModifications[key].positive - savedTextModifications[key].negative;
                applyTextManipulationsToAllElements(index, undefined, manipulationValue);
            });
        }

        observer.observe(document.body, { childList: true, subtree: true });
        document.addEventListener('keydown', handleKeyDown);
        
        return () => {
            observer.disconnect();
        };
    }, []);

    // load the css files for the toolbar
    useLoadCss(shadowRoot, 'toolbar.css');
    useLoadCss(shadowRoot, 'wordlookup.css');
    useLoadCss(shadowRoot, 'textmodify.css');
    useLoadCss(shadowRoot, 'translate_theme.css');

    let emptyTextModifications: Record<string, { negative: number, positive: number }> = {
        "size": { negative: 0, positive: 0 },
        "character-spacing": { negative: 0, positive: 0 },
    };

    useEffect(() => {
        const savedModifications = localStorage.getItem('savedTextModifications');
        if (!savedModifications) {
            localStorage.setItem('savedTextModifications', JSON.stringify(emptyTextModifications));
        }
    }, []);

    return (
        <div className="toolbarWrapper">
            <div className="buttonWrapper" ref={leftButtonRef}>
                {renderButtons(buttons.slice(0, 6), 0, "leftButtons", numOpenMenus, setNumOpenMenus, leftButtonRef)}
            </div>
            <div className="rightButtonWrapper" ref={rightButtonRef}>
                {renderButtons(buttons.slice(6), 6, "rightButtons", numOpenMenus, setNumOpenMenus, rightButtonRef)}
            </div>
        </div>
    );
};

export default ToolbarModal;
