import React from "react";
import { manipulateText } from "../utils/textmodify/manipulatetext";
import { textManipulations } from "../consts/textmodify";

// main text modify modal
const TextModify: React.FC = React.memo(() => {
    return (
        <div className="textModify">
            <ModifyWrapper manipulation={0} label="Text Size" decreaseAlt="Decrease Size" increaseAlt="Increase Size" />
            <ModifyWrapper manipulation={1} label="Character Spacing" decreaseAlt="Decrease Spacing" increaseAlt="Increase Spacing" />
        </div>
    );
});

const ModifyWrapper: React.FC<{ manipulation: number, label: string, decreaseAlt: string, increaseAlt: string }> = ({ manipulation, label, decreaseAlt, increaseAlt }) => {
    return (
        <div className="modifyWrapper">
            <span className="modifyText">{label}:</span>
            <div className="textModifyRightWrapper">
                <ButtonWithAltText className="textModButton" altText={decreaseAlt}
                    innerText="-" onClick={() => { manipulateText(manipulation, -1, textManipulations); }} />
                <ButtonWithAltText className="textModButton" altText={increaseAlt}
                    innerText="+" onClick={() => { manipulateText(manipulation, 1, textManipulations); }} />
            </div>
        </div>
    );
};

// button with alt text component for the toolbar
const ButtonWithAltText: React.FC<{ className: string, altText: string, innerText: string, onClick: () => void }> = ({ className, altText, innerText, onClick }) => {
    // react states for the alt text and button
    const [showAltText, setShowAltText] = useState(false);
    const altRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);

    useAltTextPosition(altRef, showAltText, buttonRef);

    return (
        <div className={`extButton ${className}`} ref={buttonRef} onMouseEnter={() => setShowAltText(true)}
            onMouseLeave={() => setShowAltText(false)} onClick={onClick}>{innerText}
            {showAltText && (
                <div className="buttonAlt textButtonAlt" ref={altRef} onMouseEnter={() => setShowAltText(false)}>
                    {altText}
                </div>
            )}
        </div>
    );
}

// hook to position alternative text relative to a button
const useAltTextPosition = (altRef: React.RefObject<HTMLDivElement>, showAltText: boolean, buttonRef: React.RefObject<HTMLDivElement>) => {
    useEffect(() => {
        if (showAltText && altRef.current && buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            altRef.current.style.left = `${buttonRect.left}px - 50%`;
        }
    }, [showAltText]);
};

export default TextModify;