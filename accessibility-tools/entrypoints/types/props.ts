import { Button, ParagraphData } from './types';
import { RefObject } from 'react';

// interface for button handlers props
export interface ButtonHandlersProps {
    button?: Button;
    buttonRef?: RefObject<HTMLDivElement>;
    setShowAltText?: (value: boolean) => void;
    setNumOpenMenus?: (value: number[]) => void;
    numOpenMenus?: number[];
    index?: number;
    buttonMenuRef?: React.RefObject<HTMLDivElement>;
}

export interface SearchBarProps {
    setProcessedWiktionaryData: (value: Record<string, ParagraphData>) => void;
}
