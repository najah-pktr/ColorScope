/**
 * ColorScope Palette Export Engine & Clipboard Utilities
 * Supports JSON, CSS Variables, SCSS, Tailwind CSS, SVG Card, and PNG Swatch downloads.
 */

/**
 * Copies text to clipboard and triggers visual feedback
 */
export async function copyToClipboard(text, triggerEl, feedbackMessage = 'Copied to clipboard!') {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    showToast(feedbackMessage, 'success');

    if (triggerEl) {
      triggerEl.classList.add('copied-pulse');
      setTimeout(() => triggerEl.classList.remove('copied-pulse'), 1000);
    }
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    showToast('Failed to copy to clipboard', 'error');
  }
}

/**
 * Toast Notification Dispatcher
 */
export function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;

  const iconSvg = type === 'success'
    ? `<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>`
    : `<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <span class="toast-text">${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('toast-show');
  });

  setTimeout(() => {
    toast.classList.remove('toast-show');
    toast.addEventListener('transitionend', () => toast.remove());
  }, 2200);
}

/**
 * Triggers file download in browser
 */
function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Slugifies string for CSS/JS variable names
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

/**
 * Export as JSON
 */
export function exportAsJson(paletteData, imageName = 'colorscope-palette') {
  const exportPayload = {
    generator: 'ColorScope Client-Side Spectral Analyzer',
    exportedAt: new Date().toISOString(),
    image: {
      name: imageName,
      resolution: `${paletteData.metadata.originalWidth}x${paletteData.metadata.originalHeight}`,
      aspectRatio: paletteData.metadata.aspectRatio,
      totalPixels: paletteData.metadata.totalPixels,
      brightnessCategory: paletteData.metadata.brightnessCategory,
      overallTone: paletteData.metadata.overallTone
    },
    dominantColor: {
      hex: paletteData.dominant.hex,
      name: paletteData.dominant.name,
      percentage: paletteData.dominant.percentage + '%'
    },
    palette: paletteData.colors.map((c) => ({
      name: c.name,
      hex: c.hex,
      rgb: c.rgb,
      rgbString: c.rgbString,
      hsl: c.hsl,
      hslString: c.hslString,
      oklch: c.oklch,
      percentage: c.percentage + '%',
      role: c.role,
      wcag: {
        ratioAgainstBestText: c.wcag.ratio,
        badge: c.wcag.badge,
        recommendedTextColor: c.wcag.textColor
      }
    }))
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  downloadFile(jsonString, `${slugify(imageName)}-palette.json`, 'application/json');
  showToast('Downloaded JSON palette!', 'success');
  return jsonString;
}

/**
 * Export as CSS Custom Properties
 */
export function exportAsCss(paletteData, imageName = 'colorscope') {
  let css = `/**\n * ColorScope Generated Palette\n * Source: ${imageName}\n * Generated: ${new Date().toLocaleDateString()}\n */\n\n:root {\n`;

  paletteData.colors.forEach((c) => {
    const slug = slugify(c.name);
    css += `  --color-${slug}: ${c.hex}; /* ${c.percentage}% - ${c.rgbString} */\n`;
  });

  css += `\n  /* HSL Representations */\n`;
  paletteData.colors.forEach((c) => {
    const slug = slugify(c.name);
    css += `  --color-${slug}-hsl: ${c.hsl.h} ${c.hsl.s}% ${c.hsl.l}%;\n`;
  });

  css += `}\n`;
  downloadFile(css, `${slugify(imageName)}-colors.css`, 'text/css');
  showToast('Downloaded CSS variables!', 'success');
  return css;
}

/**
 * Export as Tailwind Config
 */
export function exportAsTailwind(paletteData) {
  let tw = `// tailwind.config.js snippet\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n`;
  paletteData.colors.forEach((c) => {
    const slug = slugify(c.name);
    tw += `        '${slug}': '${c.hex}', // ${c.percentage}%\n`;
  });
  tw += `      }\n    }\n  }\n};\n`;
  return tw;
}

/**
 * Export as Vector SVG Palette Card
 */
export function exportAsSvg(paletteData, imageName = 'ColorScope Palette') {
  const cardWidth = 1000;
  const cardHeight = 600;
  const swatchCount = paletteData.colors.length;
  const swatchWidth = (cardWidth - 80 - (swatchCount - 1) * 16) / swatchCount;

  let swatchesSvg = '';
  paletteData.colors.forEach((c, i) => {
    const x = 40 + i * (swatchWidth + 16);
    swatchesSvg += `
      <g transform="translate(${x}, 180)">
        <rect width="${swatchWidth}" height="240" rx="8" fill="${c.hex}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
        <text x="12" y="32" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="600" fill="${c.wcag.textColor}">${c.percentage}%</text>
        <text x="0" y="270" font-family="'Geist', sans-serif" font-size="14" font-weight="600" fill="#F8FAFC">${c.name}</text>
        <text x="0" y="292" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="500" fill="#38BDF8">${c.hex}</text>
        <text x="0" y="312" font-family="'JetBrains Mono', monospace" font-size="11" fill="#94A3B8">${c.rgbString}</text>
      </g>
    `;
  });

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Bedrock Canvas -->
  <rect width="${cardWidth}" height="${cardHeight}" rx="16" fill="#090A0F"/>
  <rect x="0.5" y="0.5" width="${cardWidth - 1}" height="${cardHeight - 1}" rx="15.5" stroke="#252A36" stroke-width="1"/>

  <!-- Subtle Radial Ambient Glow -->
  <circle cx="500" cy="100" r="300" fill="${paletteData.dominant.hex}" fill-opacity="0.12" filter="blur(80px)"/>

  <!-- Header -->
  <text x="40" y="65" font-family="'Geist', sans-serif" font-size="24" font-weight="600" fill="#F8FAFC" letter-spacing="-0.02em">ColorScope</text>
  <text x="40" y="90" font-family="'JetBrains Mono', monospace" font-size="12" fill="#94A3B8">ANALYSIS • ${imageName} • ${paletteData.metadata.originalWidth}×${paletteData.metadata.originalHeight}px</text>
  <text x="${cardWidth - 40}" y="65" text-anchor="end" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="500" fill="#38BDF8">${paletteData.dominant.percentage}% DOMINANT: ${paletteData.dominant.hex}</text>

  <!-- Divider -->
  <line x1="40" y1="120" x2="${cardWidth - 40}" y2="120" stroke="#252A36" stroke-width="1"/>

  <!-- Swatches -->
  ${swatchesSvg}

  <!-- Footer Telemetry -->
  <line x1="40" y1="520" x2="${cardWidth - 40}" y2="520" stroke="#252A36" stroke-width="1"/>
  <text x="40" y="555" font-family="'JetBrains Mono', monospace" font-size="11" fill="#64748B">EXTRACTED VIA CLIENT-SIDE QUANTIZATION • NO EXTERNAL API • ZERO DATA UPLOADED</text>
  <text x="${cardWidth - 40}" y="555" text-anchor="end" font-family="'JetBrains Mono', monospace" font-size="11" fill="#64748B">PROCESSED IN ${paletteData.metadata.processingTimeMs}ms</text>
</svg>`;

  downloadFile(svgContent, `${slugify(imageName)}-palette.svg`, 'image/svg+xml');
  showToast('Downloaded Vector SVG card!', 'success');
  return svgContent;
}

/**
 * Export high-resolution PNG Card using Canvas 2D
 */
export async function exportAsPng(paletteData, imageName = 'ColorScope Palette') {
  const width = 1200;
  const height = 630;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#090A0F';
  ctx.fillRect(0, 0, width, height);

  // Border
  ctx.strokeStyle = '#252A36';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, width - 2, height - 2);

  // Glow
  const grad = ctx.createRadialGradient(width / 2, 80, 10, width / 2, 80, 400);
  grad.addColorStop(0, `${paletteData.dominant.hex}25`);
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Title
  ctx.fillStyle = '#F8FAFC';
  ctx.font = '600 28px Geist, sans-serif';
  ctx.fillText('ColorScope', 50, 70);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '14px "JetBrains Mono", monospace';
  ctx.fillText(`SPECTRAL ANALYSIS • ${imageName} • ${paletteData.metadata.originalWidth}×${paletteData.metadata.originalHeight}px`, 50, 100);

  // Divider
  ctx.strokeStyle = '#252A36';
  ctx.beginPath();
  ctx.moveTo(50, 130);
  ctx.lineTo(width - 50, 130);
  ctx.stroke();

  // Swatches
  const swatchCount = paletteData.colors.length;
  const gap = 20;
  const swatchWidth = (width - 100 - (swatchCount - 1) * gap) / swatchCount;

  paletteData.colors.forEach((c, i) => {
    const x = 50 + i * (swatchWidth + gap);
    const y = 160;
    const swatchHeight = 280;

    // Swatch box
    ctx.fillStyle = c.hex;
    ctx.beginPath();
    ctx.roundRect(x, y, swatchWidth, swatchHeight, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Percentage tag inside swatch
    ctx.fillStyle = c.wcag.textColor;
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.fillText(`${c.percentage}%`, x + 12, y + 28);

    // Meta below swatch
    ctx.fillStyle = '#F8FAFC';
    ctx.font = '600 15px Geist, sans-serif';
    ctx.fillText(c.name, x, y + swatchHeight + 35);

    ctx.fillStyle = '#38BDF8';
    ctx.font = '14px "JetBrains Mono", monospace';
    ctx.fillText(c.hex, x, y + swatchHeight + 60);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText(c.rgbString, x, y + swatchHeight + 82);
  });

  // Footer
  ctx.strokeStyle = '#252A36';
  ctx.beginPath();
  ctx.moveTo(50, 560);
  ctx.lineTo(width - 50, 560);
  ctx.stroke();

  ctx.fillStyle = '#64748B';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('100% IN-BROWSER SPECTRAL QUANTIZATION • ZERO SERVER LATENCY', 50, 595);

  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slugify(imageName)}-palette.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Downloaded High-Res PNG Card!', 'success');
    }
  }, 'image/png');
}
