import React, { useState, useEffect } from 'react';
import { ButtonWithAltText } from './textmodify';
import { isReading, readSelectedText, startReading, stopReading } from '../utils/tts/ttshelper';

const TTS: React.FC = React.memo(() => {
    const [buttonText, setButtonText] = useState('Start TTS');
    const [altText, setAltText] = useState('Start Automatically Reading');

    useEffect(() => {
        return () => {
            stopReading();
        };
    }, []);

    // enable and disable the auto select tts
    const toggleReading = () => {
        isReading ? stopReading() : startReading();
        setButtonText(isReading ? 'Start TTS' : 'Stop TTS');
        setAltText(isReading ? 'Start Automatically Reading' : 'Stop Automatically Reading');
    };

    return (
        <div className="tts">
            <ButtonWithAltText className="extButton ttsButton" altText="Read Selected Text" innerText="Read Selected" onClick={() => readSelectedText()} />
            <ButtonWithAltText className="extButton ttsButton" altText={altText} innerText={buttonText} onClick={toggleReading} />
        </div>
    );
});

export default TTS;