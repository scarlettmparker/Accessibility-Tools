/**
 * Page theme engine. Colour filters render as a gel overlay.
 * Contrast and dark themes rewrite each element's computed colours.
 */
import {
  grayness,
  hslToRgb,
  parseCssColor,
  rgbToHsl,
  toCssColor,
} from "./color";

type ThemeName = "red" | "green" | "blue" | "high-contrast" | "dark";

type BaseColors = {
  /**
   * Computed text colour before theming.
   */
  color: string;
  /**
   * Computed background colour before theming.
   */
  background: string;
  /**
   * Computed text fill before theming.
   */
  textFill: string;
  /**
   * Computed SVG fill before theming.
   */
  fill: string;
};

type GelVariants = {
  /**
   * Gel for light systems.
   */
  light: string;
  /**
   * Gel for dark systems.
   */
  dark: string;
};

const FILTER_COLORS: Record<string, GelVariants> = {
  red: { light: "#a3001b", dark: "#ff5c73" },
  green: { light: "#1f6b2e", dark: "#5cc46a" },
  blue: { light: "#1b2a6b", dark: "#7c8cff" },
};

const OVERLAY_ATTRIBUTE = "data-a11y-theme-overlay";
const SKIP_SELECTOR =
  "script, style, noscript, template, head, link, meta, img, video, canvas, iframe";

const baseColors = new WeakMap<Element, BaseColors>();
const themedElements = new Set<Element>();
let observer: MutationObserver | null = null;

/**
 * Resolves the overlay element, creating it on first use.
 *
 * @returns the overlay element
 */
function ensureOverlay(): HTMLElement {
  const existing = document.querySelector(`[${OVERLAY_ATTRIBUTE}]`);
  if (existing instanceof HTMLElement) {
    return existing;
  }
  const overlay = document.createElement("div");
  overlay.setAttribute(OVERLAY_ATTRIBUTE, "");
  overlay.style.pointerEvents = "none";
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.zIndex = "2147483599";
  document.body.appendChild(overlay);
  return overlay;
}

/**
 * Shows or hides the gel overlay.
 *
 * @param color the overlay colour, or null to hide
 */
function setOverlay(color: string | null): void {
  const overlay = ensureOverlay();
  if (color === null) {
    overlay.style.display = "none";
    return;
  }
  overlay.style.display = "";
  overlay.style.backgroundColor = color;
  overlay.style.mixBlendMode = "color";
}

/**
 * Reports whether an element must be left untouched.
 *
 * @param element the element to check
 * @returns true when the element is skipped
 */
function isSkipped(element: Element): boolean {
  if (element.matches(SKIP_SELECTOR)) {
    return true;
  }
  if (element.hasAttribute(OVERLAY_ATTRIBUTE)) {
    return true;
  }
  return element.id === "accessibility-tools-host";
}

/**
 * Captures an element's pre-theme colours on first sight.
 *
 * @param element the element to capture
 * @returns the base colours
 */
function captureBase(element: Element): BaseColors {
  const cached = baseColors.get(element);
  if (cached) {
    return cached;
  }
  const computed = getComputedStyle(element);
  const base: BaseColors = {
    color: computed.color,
    background: computed.backgroundColor,
    textFill: computed.getPropertyValue("-webkit-text-fill-color"),
    fill: computed.getPropertyValue("fill"),
  };
  baseColors.set(element, base);
  return base;
}

/**
 * Pushes a colour away from mid-lightness, harder for near-grays.
 *
 * @param value the CSS colour string
 * @returns the boosted colour string
 */
function boostContrast(value: string): string {
  const rgb = parseCssColor(value);
  if (!rgb) {
    return value;
  }
  const hsl = rgbToHsl(rgb);
  const amount = 0.35 * (0.4 + 0.6 * grayness(rgb));
  const lightness =
    hsl.l >= 0.5 ? hsl.l + amount * (1 - hsl.l) : hsl.l - amount * hsl.l;
  return toCssColor(hslToRgb({ ...hsl, l: lightness }, rgb.a));
}

/**
 * Reports whether the system uses a dark colour scheme.
 *
 * @returns true for dark mode systems
 */
function prefersDarkScheme(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Lightens dark text for dark mode, leaving light text alone.
 *
 * @param value the CSS colour string
 * @returns the remapped colour, or null when already readable
 */
function normalizeTextForDark(value: string): string | null {
  const rgb = parseCssColor(value);
  if (!rgb || rgb.a <= 0) {
    return null;
  }
  const hsl = rgbToHsl(rgb);
  if (hsl.l >= 0.5) {
    return null;
  }
  const lightness = 0.88 + 0.07 * ((0.5 - hsl.l) / 0.5);
  return toCssColor(hslToRgb({ ...hsl, l: lightness }, rgb.a));
}

/**
 * Darkens light backgrounds for dark mode, leaving dark ones alone.
 *
 * @param value the CSS colour string
 * @returns the remapped colour, or null when already readable
 */
function normalizeBackgroundForDark(value: string): string | null {
  const parsed = parseCssColor(value);
  const opaque = parsed && parsed.a > 0;
  const rgb = opaque ? parsed : parseCssColor("rgb(255, 255, 255)");
  if (!rgb) {
    return null;
  }
  const hsl = rgbToHsl(rgb);
  if (hsl.l < 0.5) {
    return null;
  }
  const lightness = 0.04 + 0.06 * ((hsl.l - 0.5) / 0.5);
  return toCssColor(hslToRgb({ ...hsl, l: lightness }, opaque ? parsed.a : 1));
}

/**
 * Reports whether a colour value is fully transparent.
 *
 * @param value the CSS colour string
 * @returns true for transparent values
 */
function isTransparent(value: string): boolean {
  if (value === "transparent" || value === "rgba(0, 0, 0, 0)") {
    return true;
  }
  const rgb = parseCssColor(value);
  return rgb !== null && rgb.a <= 0;
}

/**
 * Applies the active rewrite theme to an SVG element.
 *
 * Backgrounds are skipped so icons are never boxed in. CurrentColor
 * fills follow the themed text colour on their own.
 *
 * @param element the SVG element to theme
 * @param base the pre-theme colours
 * @param theme the rewrite theme in effect
 * @returns true when anything was changed
 */
function applyToSvg(
  element: SVGElement,
  base: BaseColors,
  theme: ThemeName,
): boolean {
  let themedColor: string | null;
  let themedFill: string | null;
  if (theme === "high-contrast") {
    themedColor = boostContrast(base.color);
    themedFill = parseCssColor(base.fill) ? boostContrast(base.fill) : null;
  } else {
    themedColor = normalizeTextForDark(base.color);
    themedFill = parseCssColor(base.fill)
      ? normalizeTextForDark(base.fill)
      : null;
  }
  let changed = false;
  if (themedColor) {
    element.style.setProperty("color", themedColor, "important");
    changed = true;
  }
  if (themedFill) {
    element.style.setProperty("fill", themedFill, "important");
    changed = true;
  }
  return changed;
}

/**
 * Applies the active rewrite theme to a single element.
 *
 * @param element the element to theme
 * @param theme the rewrite theme in effect
 */
function applyToElement(element: Element, theme: ThemeName): void {
  if (isSkipped(element)) {
    return;
  }
  if (element instanceof SVGElement) {
    if (applyToSvg(element, captureBase(element), theme)) {
      themedElements.add(element);
    }
    return;
  }
  if (!(element instanceof HTMLElement)) {
    return;
  }
  const base = captureBase(element);
  if (theme === "high-contrast") {
    const color = boostContrast(base.color);
    element.style.setProperty("color", color, "important");
    if (!isTransparent(base.textFill)) {
      element.style.setProperty(
        "-webkit-text-fill-color",
        boostContrast(base.textFill),
        "important",
      );
    }
    element.style.setProperty(
      "background-color",
      boostContrast(base.background),
      "important",
    );
  } else {
    const color = normalizeTextForDark(base.color);
    const background = normalizeBackgroundForDark(base.background);
    if (color) {
      element.style.setProperty("color", color, "important");
      if (!isTransparent(base.textFill)) {
        element.style.setProperty(
          "-webkit-text-fill-color",
          normalizeTextForDark(base.textFill) ?? color,
          "important",
        );
      }
    }
    if (background) {
      element.style.setProperty("background-color", background, "important");
    }
    if (!color && !background) {
      return;
    }
  }
  themedElements.add(element);
}

/**
 * Applies the active rewrite theme to a root, its descendants, and any
 * open shadow trees below it.
 *
 * @param root the root to traverse
 * @param theme the rewrite theme in effect
 */
function applyToChildren(root: Element | ShadowRoot, theme: ThemeName): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let node = walker.nextNode();
  while (node) {
    const child = node as Element;
    applyToElement(child, theme);
    if (!isSkipped(child) && child.shadowRoot) {
      applyToChildren(child.shadowRoot, theme);
    }
    node = walker.nextNode();
  }
}

/**
 * Applies the active rewrite theme to a root and its descendants.
 *
 * @param root the root to traverse
 * @param theme the rewrite theme in effect
 */
function applyToRoot(root: Element, theme: ThemeName): void {
  applyToElement(root, theme);
  applyToChildren(root, theme);
}

/**
 * Observes new elements and themes them as they load.
 *
 * @param theme the rewrite theme in effect
 */
function observeNewElements(theme: ThemeName): void {
  if (observer) {
    return;
  }
  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          applyToRoot(node as Element, theme);
        }
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * Removes all theming and stops observing.
 */
export function clearTheme(): void {
  setOverlay(null);
  themedElements.forEach((element) => {
    if (element instanceof HTMLElement || element instanceof SVGElement) {
      element.style.removeProperty("color");
      element.style.removeProperty("background-color");
      element.style.removeProperty("-webkit-text-fill-color");
      element.style.removeProperty("fill");
    }
  });
  themedElements.clear();
  observer?.disconnect();
  observer = null;
}

/**
 * Activates a theme, replacing any previous one.
 *
 * @param theme the theme to activate
 */
export function applyTheme(theme: ThemeName): void {
  clearTheme();
  const filter = FILTER_COLORS[theme];
  if (filter) {
    setOverlay(prefersDarkScheme() ? filter.dark : filter.light);
    return;
  }
  applyToRoot(document.body, theme);
  observeNewElements(theme);
}

export type { ThemeName };
