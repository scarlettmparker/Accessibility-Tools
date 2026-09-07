import { useState } from "react";

const CASCADE_OFFSET_PX = 28;

/**
 * Computes a draggable dialog's top-left so it is horizontally centred on the
 * given point and kept within the viewport.
 */
export function centeredDialogPosition(
  center: { top: number; left: number },
  widthRem: number,
): { top: number; left: number } {
  const fontSize =
    typeof document !== "undefined"
      ? parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
      : 16;
  const width = widthRem * fontSize;
  const margin = 8;
  return {
    top: Math.max(margin, Math.min(center.top, window.innerHeight - margin)),
    left: Math.max(
      margin,
      Math.min(center.left - width / 2, window.innerWidth - width - margin),
    ),
  };
}

/**
 * Stable initial position for a stacked draggable dialog.
 *
 * @param stackIndex the stacking order among open dialogs
 * @param widthRem the dialog width in rem
 * @returns the initial top-left position
 */
export function useCenteredDialogPosition(stackIndex: number, widthRem = 24): { top: number; left: number } {
  const [position] = useState(() => {
    const centered = centeredDialogPosition(
      { top: window.innerHeight / 2, left: window.innerWidth / 2 },
      widthRem,
    );
    return {
      top: centered.top + stackIndex * CASCADE_OFFSET_PX,
      left: centered.left + stackIndex * CASCADE_OFFSET_PX,
    };
  });
  return position;
}
