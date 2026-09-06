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
