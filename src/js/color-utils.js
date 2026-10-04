/**
 * ColorScope Color Mathematics & Conversions Utility
 * 100% Client-side, pure JavaScript, zero external dependencies.
 */

export function clamp(val, min = 0, max = 255) {
  return Math.min(max, Math.max(min, val));
}

export function rgbToHex(r, g, b) {
  const toHex = (c) => clamp(Math.round(c)).toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hexToRgb(hex) {
  let clean = hex.replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360 / 360;
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;

  if (s === 0) {
    const val = Math.round(l * 255);
    return { r: val, g: val, b: val };
  }

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
  };
}

/**
 * Approximate OKLCH from standard sRGB
 */
export function rgbToOklch(r, g, b) {
  // Linearize sRGB
  const linearize = (c) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const lr = linearize(r);
  const lg = linearize(g);
  const lb = linearize(b);

  // Convert to LMS
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  // Non-linear cube root
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  // Convert to OKLab
  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  // Convert to OKLCH
  const C = Math.sqrt(a * a + b_ * b_);
  let H = Math.atan2(b_, a) * (180 / Math.PI);
  if (H < 0) H += 360;

  return {
    l: (L * 100).toFixed(1) + '%',
    c: C.toFixed(3),
    h: Math.round(H)
  };
}

/**
 * WCAG 2.1 Relative Luminance calculation
 */
export function getRelativeLuminance(r, g, b) {
  const sRGB = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

/**
 * WCAG 2.1 Contrast Ratio between two RGB colors (returns e.g. 4.54)
 */
export function getContrastRatio(rgb1, rgb2) {
  const lum1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Returns WCAG rating and best text color (white or black)
 */
export function getWcagInfo(r, g, b) {
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };
  const ratioWhite = getContrastRatio({ r, g, b }, white);
  const ratioBlack = getContrastRatio({ r, g, b }, black);

  const bestIsWhite = ratioWhite >= ratioBlack;
  const bestRatio = bestIsWhite ? ratioWhite : ratioBlack;
  const textColor = bestIsWhite ? '#FFFFFF' : '#000000';

  let badge = 'FAIL';
  let badgeClass = 'contrast-fail';
  if (bestRatio >= 7.0) {
    badge = 'AAA';
    badgeClass = 'contrast-aaa';
  } else if (bestRatio >= 4.5) {
    badge = 'AA';
    badgeClass = 'contrast-aa';
  } else if (bestRatio >= 3.0) {
    badge = 'AA Large';
    badgeClass = 'contrast-aa-lg';
  }

  return {
    ratio: bestRatio.toFixed(2) + ':1',
    ratioValue: bestRatio,
    badge,
    badgeClass,
    textColor,
    ratioWhite: ratioWhite.toFixed(2) + ':1',
    ratioBlack: ratioBlack.toFixed(2) + ':1'
  };
}

/**
 * Color temperature determination
 */
export function getColorTemperature(r, g, b) {
  const { h, s } = rgbToHsl(r, g, b);
  if (s < 10) return 'Neutral';
  if ((h >= 0 && h <= 65) || h >= 320) return 'Warm';
  if (h >= 160 && h <= 280) return 'Cool';
  return 'Balanced';
}

/**
 * Harmonious color schemes generator
 */
export function getColorHarmonies(r, g, b) {
  const { h, s, l } = rgbToHsl(r, g, b);

  const makeScheme = (offsets) =>
    offsets.map((deg) => {
      const targetH = ((h + deg) % 360 + 360) % 360;
      const rgb = hslToRgb(targetH, s, l);
      return {
        hex: rgbToHex(rgb.r, rgb.g, rgb.b),
        rgb,
        h: targetH
      };
    });

  return {
    complementary: makeScheme([180])[0],
    analogous: makeScheme([-30, 30]),
    triadic: makeScheme([120, 240]),
    splitComplementary: makeScheme([150, 210]),
    tetradic: makeScheme([90, 180, 270])
  };
}

/**
 * Generates Tailwind / UI style tonal scale (50-900)
 */
export function generateTonalRamp(r, g, b) {
  const { h, s } = rgbToHsl(r, g, b);
  const steps = [
    { name: '50', l: 96 },
    { name: '100', l: 90 },
    { name: '200', l: 80 },
    { name: '300', l: 70 },
    { name: '400', l: 60 },
    { name: '500', l: 50 },
    { name: '600', l: 40 },
    { name: '700', l: 30 },
    { name: '800', l: 20 },
    { name: '900', l: 12 },
    { name: '950', l: 7 }
  ];

  return steps.map((step) => {
    const rgb = hslToRgb(h, s, step.l);
    return {
      step: step.name,
      hex: rgbToHex(rgb.r, rgb.g, rgb.b),
      rgb
    };
  });
}
