import React from 'react';
import { useLoadCss } from './utils/loadcss';
import buttons from './utils/buttondata.json';

interface ToolbarModalProps {
    shadowRoot: ShadowRoot;
}

type Button = {
    id: number;
    name: string;
    color: string;
    hover_color: string;
}

const BUTTON_PATH = "/assets/images/buttons/";
const BUTTON_SIZE = 58;

// render the buttons using the button data
const renderButtons = (buttons: Button[], startIndex: number, className: string) => (
    // map based on the index (left or right buttons)
    buttons.map((button: Button, index: number) => (
        <ButtonWithAltText key={index + startIndex} button={button} startIndex={startIndex} className={className} index={index} />
    ))
);

// alt text button for the toolbar
const ButtonWithAltText: React.FC<{ button: Button, startIndex: number, className: string, index: number }> = ({ button, startIndex, className, index }) => {
    // states for alt text
    const [showAltText, setShowAltText] = useState(false);
    const altRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (showAltText && altRef.current) {
            // offset the alt text so it is centered on the button
            const altTextWidth = altRef.current.offsetWidth;
            altRef.current.style.marginLeft = `-${altTextWidth / 2 - BUTTON_SIZE / 2}px`;
        }
    }, [showAltText]);

    return (
        <div key={index + startIndex} className={`toolbarButton ${className}`} style={{ backgroundColor: button.color || 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = button.hover_color; setShowAltText(true); }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = button.color; setShowAltText(false); }}>
            {showAltText && (
                <div className={"buttonAlt"} ref={altRef} onMouseEnter={() => setShowAltText(false)}>
                    {button.name}
                </div>
            )}
            <img src={getButtonIcon(index + startIndex)} alt={button.name} width={BUTTON_SIZE} height={BUTTON_SIZE} />
        </div>
    )
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
    useLoadCss(shadowRoot, 'toolbar.css');

    return (
        <div className="toolbarWrapper">
            <div className="buttonWrapper">
                {renderButtons(buttons.slice(0, 6), 0, "leftButtons")}
            </div>
            <div className="rightButtonWrapper">
                {renderButtons(buttons.slice(6), 6, "rightButtons")}
            </div>
        </div>
    );
};

export default ToolbarModal;