type Rgb = {
  /**
   * Red channel, 0-255.
   */
  r: number;
  /**
   * Green channel, 0-255.
   */
  g: number;
  /**
   * Blue channel, 0-255.
   */
  b: number;
  /**
   * Alpha channel, 0-1.
   */
  a: number;
};

type Hsl = {
  /**
   * Hue in degrees, 0-360.
   */
  h: number;
  /**
   * Saturation, 0-1.
   */
  s: number;
  /**
   * Lightness, 0-1.
   */
  l: number;
};

/**
 * Parses an rgb()/rgba() CSS colour into channels.
 *
 * @param value the CSS colour string
 * @returns the channels, or null when unparseable
 */
export function parseCssColor(value: string): Rgb | null {
  const match = value.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/,
  );
  if (!match) {
    return null;
  }
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] === undefined ? 1 : Number(match[4]),
  };
}

/**
 * Clamps a channel to the 0-255 range.
 *
 * @param value the raw channel value
 * @returns the clamped, rounded channel
 */
export function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

/**
 * Converts RGB channels to HSL.
 *
 * @param rgb the RGB channels
 * @returns the HSL equivalent
 */
export function rgbToHsl(rgb: Rgb): Hsl {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) {
    return { h: 0, s: 0, l };
  }
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) {
    h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
  } else if (max === g) {
    h = ((b - r) / d + 2) * 60;
  } else {
    h = ((r - g) / d + 4) * 60;
  }
  return { h, s, l };
}

/**
 * Converts HSL to RGB channels.
 *
 * @param hsl the HSL values
 * @param alpha the alpha channel to carry through
 * @returns the RGB equivalent
 */
export function hslToRgb(hsl: Hsl, alpha: number): Rgb {
  const h = hsl.h / 360;
  const { s, l } = hsl;
  if (s === 0) {
    const v = clampChannel(l * 255);
    return { r: v, g: v, b: v, a: alpha };
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const channel = (t: number): number => {
    let wrapped = t;
    if (wrapped < 0) wrapped += 1;
    if (wrapped > 1) wrapped -= 1;
    if (wrapped < 1 / 6) return p + (q - p) * 6 * wrapped;
    if (wrapped < 1 / 2) return q;
    if (wrapped < 2 / 3) return p + (q - p) * (2 / 3 - wrapped) * 6;
    return p;
  };
  return {
    r: clampChannel(channel(h + 1 / 3) * 255),
    g: clampChannel(channel(h) * 255),
    b: clampChannel(channel(h - 1 / 3) * 255),
    a: alpha,
  };
}

/**
 * Measures how close a colour is to gray.
 *
 * @param rgb the RGB channels
 * @returns 1 for pure gray, 0 for fully saturated
 */
export function grayness(rgb: Rgb): number {
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  return 1 - (max - min) / 255;
}

/**
 * Serializes channels back to a CSS colour string.
 *
 * @param rgb the RGB channels
 * @returns the css rgb()/rgba() string
 */
export function toCssColor(rgb: Rgb): string {
  if (rgb.a >= 1) {
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
}
