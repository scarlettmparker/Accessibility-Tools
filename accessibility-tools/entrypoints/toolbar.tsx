import React from 'react';
import { useLoadCss } from './utils/loadcss';

interface ToolbarModalProps {
    shadowRoot: ShadowRoot;
}

export const ToolbarModal: React.FC<ToolbarModalProps> = ({ shadowRoot }) => {
    // load the css file for the modal
    useLoadCss(shadowRoot, 'toolbar.css');
    return (
        <div className="toolbarWrapper" />
    );
};

export default ToolbarModal;
