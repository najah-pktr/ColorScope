/**
 * ColorScope Main Application Orchestrator
 * High-performance, client-side, zero external API keys.
 */

import { extractPalette } from './quantizer.js';
import { CanvasLoupe } from './canvas-loupe.js';
import {
  copyToClipboard,
  exportAsJson,
  exportAsCss,
  exportAsTailwind,
  exportAsSvg,
  exportAsPng,
  showToast
} from './exporter.js';
import { SAMPLE_PRESETS, getPresetDataUrl } from './sample-data.js';

class ColorScopeApp {
  constructor() {
    this.currentImage = null;
    this.currentFileName = 'fuji_autumn_dusk.jpg';
    this.currentFileSize = '342 KB';
    this.currentFormat = 'image/jpeg';
    this.currentAnalysis = null;
    this.activeColor = null;
    this.clusterCount = 6;
    this.activeExportTab = 'css';

    this.cacheDom();
    this.initCanvasLoupe();
    this.bindEvents();
    this.loadInitialPreset();
  }

  cacheDom() {
    // Canvas & Preview
    this.previewImage = document.getElementById('preview-image');
    this.previewContainer = document.getElementById('image-preview-wrapper');
    this.processingOverlay = document.getElementById('processing-overlay');
    this.fileInput = document.getElementById('file-input');
    this.dropzone = document.getElementById('dropzone');
    this.loupeToggleBtn = document.getElementById('loupe-toggle-btn');

    // Metadata
    this.metaFilename = document.getElementById('meta-filename');
    this.metaResolution = document.getElementById('meta-resolution');
    this.metaFilesize = document.getElementById('meta-filesize');
    this.metaFormat = document.getElementById('meta-format');

    // Dominant Showcase
    this.dominantShowcaseCard = document.getElementById('dominant-showcase-card');
    this.heroSwatch = document.getElementById('hero-swatch');
    this.dominantName = document.getElementById('dominant-name');
    this.dominantRole = document.getElementById('dominant-role');
    this.dominantBadge = document.getElementById('dominant-badge');
    this.contrastPill = document.getElementById('contrast-pill');

    // Value boxes
    this.valHex = document.getElementById('val-hex');
    this.valRgb = document.getElementById('val-rgb');
    this.valHsl = document.getElementById('val-hsl');

    // Distribution Bar
    this.distributionBar = document.getElementById('distribution-bar');
    this.distributionLegend = document.getElementById('distribution-legend');

    // Swatches
    this.swatchesGrid = document.getElementById('swatches-grid');
    this.swatchCountLabel = document.getElementById('swatch-count-label');

    // Cluster Pills
    this.clusterPills = document.querySelectorAll('.cluster-pill');

    // Presets
    this.presetCards = document.querySelectorAll('.preset-card');

    // Export Modal
    this.exportModal = document.getElementById('export-modal');
    this.exportCodePreview = document.getElementById('export-code-preview');
    this.exportCopyBtn = document.getElementById('modal-copy-btn');
    this.exportDownloadBtn = document.getElementById('modal-download-btn');
    this.exportTabBtns = document.querySelectorAll('.modal-tab-btn');
    this.openExportBtn = document.getElementById('open-export-btn');
    this.quickExportJsonBtn = document.getElementById('quick-export-json-btn');
    this.quickCopyTokensBtn = document.getElementById('quick-copy-tokens-btn');
    this.closeModalBtn = document.getElementById('modal-close-btn');

    // Top action
    this.headerUploadBtn = document.getElementById('header-upload-btn');
  }

  initCanvasLoupe() {
    this.loupe = new CanvasLoupe(this.previewImage, {
      container: this.previewContainer,
      onColorPicked: (sampled) => {
        this.inspectSampledColor(sampled);
      }
    });
  }

  bindEvents() {
    // File upload
    this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
    this.dropzone.addEventListener('click', () => this.fileInput.click());
    if (this.headerUploadBtn) {
      this.headerUploadBtn.addEventListener('click', () => this.fileInput.click());
    }

    // Drag and drop
    ['dragenter', 'dragover'].forEach((eventName) => {
      this.dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        this.dropzone.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach((eventName) => {
      this.dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        this.dropzone.classList.remove('drag-over');
      });
    });

    this.dropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        this.processFile(files[0]);
      }
    });

    // Window drag & drop fallback
    window.addEventListener('dragover', (e) => e.preventDefault());
    window.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e.target.closest('#dropzone')) return;
      const files = e.dataTransfer.files;
      if (files && files.length > 0 && files[0].type.startsWith('image/')) {
        this.processFile(files[0]);
      }
    });

    // Clipboard Paste (Cmd+V / Ctrl+V anywhere)
    window.addEventListener('paste', (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            this.processFile(file, 'clipboard_snapshot.png');
            showToast('Pasted image from clipboard!', 'success');
            break;
          }
        }
      }
    });

    // Loupe toggle
    this.loupeToggleBtn.addEventListener('click', () => {
      this.loupe.enabled = !this.loupe.enabled;
      this.loupeToggleBtn.classList.toggle('active', this.loupe.enabled);
      this.previewContainer.style.cursor = this.loupe.enabled ? 'crosshair' : 'default';
      showToast(this.loupe.enabled ? 'Eyedropper Loupe active' : 'Loupe deactivated', 'info');
    });

    // Cluster count selector
    this.clusterPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        this.clusterPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        this.clusterCount = parseInt(pill.dataset.count, 10);
        this.runAnalysis();
      });
    });

    // Sample Presets click
    this.presetCards.forEach((card) => {
      card.addEventListener('click', () => {
        this.presetCards.forEach((c) => c.classList.remove('active'));
        card.classList.add('active');
        const presetId = card.dataset.preset;
        this.loadPreset(presetId);
      });
    });

    // Copy readouts
    document.getElementById('box-hex')?.addEventListener('click', (e) => {
      if (this.activeColor) {
        copyToClipboard(this.activeColor.hex, e.currentTarget, `Copied ${this.activeColor.hex}`);
      }
    });
    document.getElementById('box-rgb')?.addEventListener('click', (e) => {
      if (this.activeColor) {
        copyToClipboard(this.activeColor.rgbString, e.currentTarget, `Copied ${this.activeColor.rgbString}`);
      }
    });
    document.getElementById('box-hsl')?.addEventListener('click', (e) => {
      if (this.activeColor) {
        copyToClipboard(this.activeColor.hslString, e.currentTarget, `Copied ${this.activeColor.hslString}`);
      }
    });

    // Dominant Swatch copy
    this.heroSwatch.addEventListener('click', () => {
      if (this.activeColor) {
        copyToClipboard(this.activeColor.hex, this.heroSwatch, `Copied ${this.activeColor.hex}`);
      }
    });

    // Quick Export Buttons
    this.quickExportJsonBtn?.addEventListener('click', () => {
      if (this.currentAnalysis) {
        exportAsJson(this.currentAnalysis, this.currentFileName);
      }
    });
    this.quickCopyTokensBtn?.addEventListener('click', (e) => {
      if (this.currentAnalysis) {
        const cssContent = exportAsCss(this.currentAnalysis, this.currentFileName);
        copyToClipboard(cssContent, e.currentTarget, 'Copied CSS Variables!');
      }
    });

    // Export Modal
    this.openExportBtn?.addEventListener('click', () => this.openExportModal());
    this.closeModalBtn?.addEventListener('click', () => this.closeExportModal());
    this.exportModal?.addEventListener('click', (e) => {
      if (e.target === this.exportModal) this.closeExportModal();
    });

    // Export Tab Switching
    this.exportTabBtns.forEach((tab) => {
      tab.addEventListener('click', () => {
        this.exportTabBtns.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeExportTab = tab.dataset.tab;
        this.updateExportCodePreview();
      });
    });

    this.exportCopyBtn?.addEventListener('click', (e) => {
      const code = this.exportCodePreview.innerText;
      copyToClipboard(code, e.currentTarget, 'Copied snippet to clipboard!');
    });

    this.exportDownloadBtn?.addEventListener('click', () => {
      this.handleExportDownload();
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        this.fileInput.click();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        this.openExportModal();
      } else if (e.key.toLowerCase() === 'u') {
        this.fileInput.click();
      } else if (e.key.toLowerCase() === 'c' && !e.metaKey && !e.ctrlKey) {
        if (this.activeColor) {
          copyToClipboard(this.activeColor.hex, this.heroSwatch, `Copied ${this.activeColor.hex}`);
        }
      } else if (e.key === 'Escape') {
        this.closeExportModal();
      }
    });
  }

  loadInitialPreset() {
    this.loadPreset('fuji_autumn');
  }

  loadPreset(presetId) {
    const { preset, dataUrl } = getPresetDataUrl(presetId);
    this.currentFileName = preset.filename;
    this.currentFileSize = preset.fileSize;
    this.currentFormat = preset.format;

    this.setPreviewSrc(dataUrl);
  }

  handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  processFile(file, customName) {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    this.currentFileName = customName || file.name;
    this.currentFileSize = this.formatBytes(file.size);
    this.currentFormat = file.type;

    const reader = new FileReader();
    reader.onload = (evt) => {
      this.setPreviewSrc(evt.target.result);
      showToast(`Loaded ${this.currentFileName}`, 'success');
    };
    reader.readAsDataURL(file);
  }

  setPreviewSrc(src) {
    this.showProcessing();
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      this.previewImage.src = src;
      this.currentImage = img;
      this.loupe.updateSource();
      this.runAnalysis();
    };
    img.src = src;
  }

  showProcessing() {
    this.processingOverlay.classList.add('visible');
  }

  hideProcessing() {
    this.processingOverlay.classList.remove('visible');
  }

  async runAnalysis() {
    if (!this.currentImage) return;

    try {
      this.showProcessing();
      const analysis = await extractPalette(this.currentImage, {
        colorCount: this.clusterCount,
        sampleResolution: 220
      });

      this.currentAnalysis = analysis;
      this.activeColor = analysis.dominant;

      this.renderMetadata(analysis.metadata);
      this.renderDominantShowcase(analysis.dominant);
      this.renderDistribution(analysis.colors);
      this.renderSwatches(analysis.colors);

      if (this.exportModal.classList.contains('open')) {
        this.updateExportCodePreview();
      }
    } catch (err) {
      console.error('Palette extraction failed', err);
      showToast('Error analyzing image colors', 'error');
    } finally {
      this.hideProcessing();
    }
  }

  renderMetadata(meta) {
    this.metaFilename.innerText = this.currentFileName;
    this.metaResolution.innerText = `${meta.originalWidth} × ${meta.originalHeight} px`;
    this.metaFilesize.innerText = this.currentFileSize;
    this.metaFormat.innerText = (this.currentFormat.split('/')[1] || 'IMAGE').toUpperCase();
  }

  renderDominantShowcase(color) {
    this.activeColor = color;

    // Apply color to Hero Swatch
    this.heroSwatch.style.backgroundColor = color.hex;

    // Update ambient radial backlight glow
    this.dominantShowcaseCard.style.setProperty('--active-glow-color', color.hex);

    // Update titles and badges
    this.dominantName.innerText = color.name;
    this.dominantRole.innerText = color.role;
    this.dominantBadge.innerText = `${color.percentage}% DOMINANT`;

    // Contrast pill
    this.contrastPill.innerText = `WCAG ${color.wcag.badge} (${color.wcag.ratio})`;
    this.contrastPill.className = `contrast-pill ${color.wcag.badgeClass}`;

    // Readout values
    this.valHex.innerText = color.hex;
    this.valRgb.innerText = color.rgbString;
    this.valHsl.innerText = color.hslString;
  }

  inspectSampledColor(sampled) {
    // When user clicks pixel via loupe, inspect that color in the showcase
    const inspected = {
      hex: sampled.hex,
      rgb: sampled.rgb,
      rgbString: sampled.rgbString,
      hsl: sampled.hsl,
      hslString: sampled.hslString,
      percentage: 'Sampled',
      name: sampled.name,
      role: `Manual Sample (${sampled.x}, ${sampled.y})`,
      wcag: sampled.wcag
    };

    this.renderDominantShowcase(inspected);
    showToast(`Sampled ${inspected.name} (${inspected.hex})`, 'info');
  }

  renderDistribution(colors) {
    this.distributionBar.innerHTML = '';
    this.distributionLegend.innerHTML = '';

    colors.forEach((color, i) => {
      // Bar Slice
      const slice = document.createElement('div');
      slice.className = 'distribution-slice';
      slice.style.width = `${color.percentage}%`;
      slice.style.backgroundColor = color.hex;
      slice.title = `${color.name} (${color.hex}): ${color.percentage}%`;

      slice.addEventListener('click', () => {
        this.renderDominantShowcase(color);
        this.highlightSwatchCard(i);
      });

      this.distributionBar.appendChild(slice);

      // Legend Item
      const legend = document.createElement('div');
      legend.className = 'legend-item';
      legend.innerHTML = `
        <span class="legend-dot" style="background-color: ${color.hex};"></span>
        <span>${color.percentage}%</span>
      `;
      legend.addEventListener('click', () => {
        this.renderDominantShowcase(color);
        this.highlightSwatchCard(i);
      });

      this.distributionLegend.appendChild(legend);
    });
  }

  renderSwatches(colors) {
    this.swatchesGrid.innerHTML = '';
    this.swatchCountLabel.innerText = `(${colors.length})`;

    colors.forEach((color, index) => {
      const card = document.createElement('div');
      card.className = `swatch-card ${index === 0 ? 'active' : ''}`;
      card.dataset.index = index;

      card.innerHTML = `
        <div class="swatch-color-preview" style="background-color: ${color.hex};">
          <span class="swatch-pct-tag font-mono">${color.percentage}%</span>
          <span class="contrast-pill ${color.wcag.badgeClass}" style="font-size: 9px; padding: 1px 4px;">${color.wcag.badge}</span>
        </div>
        <div class="swatch-card-info">
          <div class="swatch-card-title-row">
            <span class="swatch-card-name" title="${color.name}">${color.name}</span>
            <span class="swatch-card-hex font-mono">${color.hex}</span>
          </div>
          <div class="swatch-card-actions">
            <span class="swatch-card-meta font-mono">${color.hslString}</span>
            <button class="copy-icon-btn" title="Copy HEX" data-hex="${color.hex}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
        </div>
      `;

      // Click card to inspect
      card.addEventListener('click', (e) => {
        if (e.target.closest('.copy-icon-btn')) return;
        this.renderDominantShowcase(color);
        this.highlightSwatchCard(index);
      });

      // Copy button
      const copyBtn = card.querySelector('.copy-icon-btn');
      copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        copyToClipboard(color.hex, copyBtn, `Copied ${color.hex}`);
      });

      this.swatchesGrid.appendChild(card);
    });
  }

  highlightSwatchCard(index) {
    const cards = this.swatchesGrid.querySelectorAll('.swatch-card');
    cards.forEach((c) => c.classList.remove('active'));
    if (cards[index]) cards[index].classList.add('active');
  }

  openExportModal() {
    if (!this.currentAnalysis) return;
    this.updateExportCodePreview();
    this.exportModal.classList.add('open');
  }

  closeExportModal() {
    this.exportModal.classList.remove('open');
  }

  updateExportCodePreview() {
    if (!this.currentAnalysis) return;

    let code = '';
    const tab = this.activeExportTab;

    if (tab === 'css') {
      code = exportAsCss(this.currentAnalysis, this.currentFileName);
    } else if (tab === 'json') {
      const exportPayload = {
        generator: 'ColorScope Client-Side Spectral Analyzer',
        image: this.currentFileName,
        clusters: this.currentAnalysis.colors.length,
        colors: this.currentAnalysis.colors.map((c) => ({
          name: c.name,
          hex: c.hex,
          rgb: c.rgb,
          hsl: c.hsl,
          percentage: c.percentage + '%'
        }))
      };
      code = JSON.stringify(exportPayload, null, 2);
    } else if (tab === 'tailwind') {
      code = exportAsTailwind(this.currentAnalysis);
    } else if (tab === 'svg') {
      code = '<!-- Vector SVG Swatch Card is ready for instant download -->\nClick "Download Asset" below to save colorscope-palette.svg';
    } else if (tab === 'png') {
      code = '// High-Resolution 1200x630px Presentation Card\nClick "Download Asset" below to generate & save colorscope-palette.png';
    }

    this.exportCodePreview.innerText = code;
  }

  handleExportDownload() {
    if (!this.currentAnalysis) return;
    const tab = this.activeExportTab;

    if (tab === 'css') {
      exportAsCss(this.currentAnalysis, this.currentFileName);
    } else if (tab === 'json') {
      exportAsJson(this.currentAnalysis, this.currentFileName);
    } else if (tab === 'tailwind') {
      const code = exportAsTailwind(this.currentAnalysis);
      const blob = new Blob([code], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tailwind-colors.js`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Downloaded Tailwind config!', 'success');
    } else if (tab === 'svg') {
      exportAsSvg(this.currentAnalysis, this.currentFileName);
    } else if (tab === 'png') {
      exportAsPng(this.currentAnalysis, this.currentFileName);
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.colorscopeApp = new ColorScopeApp();
});
