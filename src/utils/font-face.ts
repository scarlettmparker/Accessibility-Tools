const initialFontFace = getComputedStyle(document.body).fontFamily;

export const fontFaces = [
  { name: "Default", value: initialFontFace },
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Comic Sans MS", value: "Comic Sans MS, cursive" },
  { name: "Courier New", value: "Courier New, monospace" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Helvetica", value: "Helvetica, sans-serif" },
  { name: "Impact", value: "Impact, sans-serif" },
  { name: "Lucida Sans", value: "Lucida Sans, sans-serif" },
  { name: "Tahoma", value: "Tahoma, sans-serif" },
  { name: "Times New Roman", value: "Times New Roman, serif" },
  { name: "Trebuchet MS", value: "Trebuchet MS, sans-serif" },
  { name: "Verdana", value: "Verdana, sans-serif" },
];

let currentFontFace = "";

export function setFontFace(fontValue: string): void {
  currentFontFace = fontValue;
  document.body.style.fontFamily = fontValue;
}

export function getCurrentFontFace(): string {
  return currentFontFace;
}
