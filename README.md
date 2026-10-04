# ColorScope — Client-Side Image Color & Spectral Analyzer

A production-quality, high-density developer and designer utility inspired by **Linear**, **Raycast**, and **Figma**. Extracts dominant color clusters, percentage breakdowns, HEX/RGB/HSL tokens, and WCAG contrast ratings directly in the browser—with **zero AI APIs**, **zero external keys**, and **sub-15ms local processing**.

---

## ✨ Features

- **100% Client-Side Quantization**: Powered by an in-browser Modified Median Cut Quantization (MMCQ) engine with K-Means centroid convergence.
- **Evocative Designer Color Naming**: Automated perceptual color naming (*Autumn Ember*, *Alpine Indigo*, *Solar Gold*, etc.) using human-weighted Delta-E matching.
- **Interactive Eyedropper Loupe**: Real-time 8x hardware-accelerated circular pixel loupe with crosshair reticle, pixel coordinates, and click-to-sample inspection.
- **Color Distribution Breakdown**: Multi-segment proportional bar displaying exact normalized image coverage percentages.
- **WCAG 2.1 Accessibility Matrix**: Real-time relative luminance calculation showing AAA / AA compliance badges and optimal text contrast colors.
- **Rich Export Suite**:
  - **CSS Custom Properties**: `:root { --color-...: #...; }`
  - **JSON**: Full structured color metadata and image metrics.
  - **Tailwind CSS**: Theme configuration snippet.
  - **Vector SVG Palette Card**: Production-ready vector graphic with dark carbon framing.
  - **High-Res PNG Swatch Card**: 1200×630px presentation card generated via Canvas 2D.
- **Multi-Source Image Ingestion**:
  - Drag-and-drop any image file (PNG, JPG, WEBP, AVIF, SVG).
  - Native file picker.
  - **Clipboard snapshot paste** (`⌘V` / `Ctrl+V` anywhere in the window).
  - Built-in curated aesthetic presets (*Fuji Autumn*, *Cyberpunk Neon*, *Nordic Fjord*).
- **Keyboard Shortcuts**:
  - `U` or `⌘O` / `Ctrl+O`: Upload image
  - `⌘E` / `Ctrl+E`: Open Export Suite
  - `C`: Copy active color HEX code
  - `Esc`: Close modals

---

## 🚀 Quick Start

1. Start the local server:
   ```bash
   npm run dev
   ```
2. Open your browser at:
   ```
   http://localhost:5173/
   ```

No external build tools or internet connectivity required.
