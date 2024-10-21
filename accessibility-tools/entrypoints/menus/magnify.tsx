import React from 'react';
import { ButtonWithAltText } from './textmodify';

const Magnify: React.FC = React.memo(() => {
    const [buttonText, setButtonText] = useState('Show Magnifier');
    const [altText, setAltText] = useState('Magnify Screen');
    const [magnifying, setMagnifying] = useState(false);
    const [size, setSize] = useState(100);
    const [zoom, setZoom] = useState(1.0);

    // set the magnifier options
    const toggleMagnifying = () => {
        setMagnifying(!magnifying);
        setButtonText(magnifying ? 'Show Magnifier' : 'Hide Magnifier');
        setAltText(magnifying ? 'Magnify Screen' : 'Stop Magnifying Screen');
    };

    useEffect(() => {
        
    }, [magnifying, size, zoom]);

    return (
        <div className="magnify">
            <div className="magnifierSettings">
                <label>
                    Size: {size}px
                    <input className="magnifySlider" type="range" min="100" max="1000" step="2" value={size} onChange={(e) => setSize(Number(e.target.value))}/>
                </label>
                <label>
                    Zoom: {zoom.toFixed(1)}x
                    <input className="magnifySlider" type="range" min="1.0" max="10.0" step="0.5" value={zoom} onChange={(e) => setZoom(Number(e.target.value))}/>
                </label>
            </div>
            <div className="magnifyButtonWrapper">
                <ButtonWithAltText className="extButton magnifyButton" altText={altText} innerText={buttonText} onClick={toggleMagnifying} />
                <ButtonWithAltText className="extButton refreshButton" altText="Refresh Magnifier" innerText="♻" onClick={() => {}} />
            </div>
        </div>
    )
});

export default Magnify;