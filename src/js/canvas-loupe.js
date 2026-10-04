/**
 * ColorScope Interactive Pixel Magnifier & Precision Eyedropper Loupe
 * Renders an 8x hardware-accelerated circular pixel loupe with reticle and telemetry.
 */

import { rgbToHex, rgbToHsl, getWcagInfo } from './color-utils.js';
import { getClosestColorName } from './color-names.js';

export class CanvasLoupe {
  constructor(imageElement, options = {}) {
    this.image = imageElement;
    this.onColorPicked = options.onColorPicked || (() => {});
    this.container = options.container || imageElement.parentElement;
    this.enabled = true;

    this.hiddenCanvas = document.createElement('canvas');
    this.hiddenCtx = this.hiddenCanvas.getContext('2d', { willReadFrequently: true });
    this.isImageReady = false;

    this.createLoupeElement();
    this.bindEvents();
  }

  updateSource() {
    if (!this.image.complete || !this.image.naturalWidth) return;
    this.hiddenCanvas.width = this.image.naturalWidth;
    this.hiddenCanvas.height = this.image.naturalHeight;
    this.hiddenCtx.drawImage(this.image, 0, 0);
    this.isImageReady = true;
  }

  createLoupeElement() {
    this.loupeEl = document.createElement('div');
    this.loupeEl.className = 'canvas-loupe-reticle';
    this.loupeEl.style.display = 'none';

    this.loupeCanvas = document.createElement('canvas');
    this.loupeCanvas.width = 110;
    this.loupeCanvas.height = 110;
    this.loupeCanvas.className = 'loupe-magnifier-canvas';
    this.loupeCtx = this.loupeCanvas.getContext('2d');
    this.loupeCtx.imageSmoothingEnabled = false;

    this.infoTag = document.createElement('div');
    this.infoTag.className = 'loupe-telemetry';

    this.loupeEl.appendChild(this.loupeCanvas);
    this.loupeEl.appendChild(this.infoTag);
    this.container.appendChild(this.loupeEl);
  }

  bindEvents() {
    this.image.addEventListener('load', () => this.updateSource());

    this.container.addEventListener('mouseenter', () => {
      if (!this.enabled || !this.isImageReady) return;
      this.loupeEl.style.display = 'flex';
    });

    this.container.addEventListener('mouseleave', () => {
      this.loupeEl.style.display = 'none';
    });

    this.container.addEventListener('mousemove', (e) => {
      if (!this.enabled || !this.isImageReady) return;
      this.handleMouseMove(e);
    });

    this.container.addEventListener('click', (e) => {
      if (!this.enabled || !this.isImageReady) return;
      this.handleClick(e);
    });
  }

  getPixelCoords(e) {
    const rect = this.image.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const scaleX = this.image.naturalWidth / rect.width;
    const scaleY = this.image.naturalHeight / rect.height;

    const pixelX = Math.floor(clientX * scaleX);
    const pixelY = Math.floor(clientY * scaleY);

    return {
      clientX,
      clientY,
      pixelX: Math.max(0, Math.min(this.image.naturalWidth - 1, pixelX)),
      pixelY: Math.max(0, Math.min(this.image.naturalHeight - 1, pixelY))
    };
  }

  handleMouseMove(e) {
    const coords = this.getPixelCoords(e);
    const pixelX = coords.pixelX;
    const pixelY = coords.pixelY;

    // Read sampled pixel
    const pixel = this.hiddenCtx.getImageData(pixelX, pixelY, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];
    const hex = rgbToHex(r, g, b);

    // Magnify surrounding 13x13 pixel neighborhood
    const radius = 6;
    const startX = Math.max(0, pixelX - radius);
    const startY = Math.max(0, pixelY - radius);
    const sampleW = Math.min(this.image.naturalWidth - startX, radius * 2 + 1);
    const sampleH = Math.min(this.image.naturalHeight - startY, radius * 2 + 1);

    this.loupeCtx.clearRect(0, 0, 110, 110);
    this.loupeCtx.save();
    this.loupeCtx.beginPath();
    this.loupeCtx.arc(55, 55, 54, 0, Math.PI * 2);
    this.loupeCtx.clip();

    // Draw zoomed pixels
    this.loupeCtx.drawImage(
      this.hiddenCanvas,
      startX, startY, sampleW, sampleH,
      0, 0, 110, 110
    );

    // Central crosshair & reticle
    this.loupeCtx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    this.loupeCtx.lineWidth = 1.5;
    this.loupeCtx.strokeRect(50, 50, 10, 10);

    this.loupeCtx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
    this.loupeCtx.lineWidth = 1;
    this.loupeCtx.strokeRect(49, 49, 12, 12);
    this.loupeCtx.restore();

    // Telemetry label
    this.infoTag.innerHTML = `
      <span class="loupe-chip" style="background-color: ${hex};"></span>
      <span class="loupe-hex font-mono">${hex}</span>
      <span class="loupe-coords font-mono">${pixelX},${pixelY}</span>
    `;

    // Position loupe offset from cursor
    const containerRect = this.container.getBoundingClientRect();
    let posX = coords.clientX + 16;
    let posY = coords.clientY - 60;

    if (posX + 120 > containerRect.width) posX = coords.clientX - 130;
    if (posY < 10) posY = coords.clientY + 20;

    this.loupeEl.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
  }

  handleClick(e) {
    const coords = this.getPixelCoords(e);
    const pixel = this.hiddenCtx.getImageData(coords.pixelX, coords.pixelY, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];
    const hex = rgbToHex(r, g, b);
    const hsl = rgbToHsl(r, g, b);
    const name = getClosestColorName(r, g, b);
    const wcag = getWcagInfo(r, g, b);

    this.onColorPicked({
      hex,
      rgb: { r, g, b },
      rgbString: `rgb(${r}, ${g}, ${b})`,
      hsl,
      hslString: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      name,
      wcag,
      x: coords.pixelX,
      y: coords.pixelY
    });
  }
}
