/**
 * ColorScope Built-in High-Fidelity Aesthetic Presets
 * Generates rich, high-resolution test canvases locally without any network requests.
 */

export const SAMPLE_PRESETS = [
  {
    id: 'fuji_autumn',
    name: 'Fuji Autumn Dusk',
    filename: 'fuji_autumn_dusk.jpg',
    width: 1376,
    height: 768,
    fileSize: '342 KB',
    format: 'image/jpeg',
    description: 'Vibrant Japanese dusk with fiery autumn foliage, indigo lake, and misty horizons.',
    render: (ctx, w, h) => {
      // Sky gradient: Indigo to Twilight Crimson to Solar Orange to Amber
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.65);
      skyGrad.addColorStop(0, '#1B2B4A');
      skyGrad.addColorStop(0.3, '#323E5E');
      skyGrad.addColorStop(0.55, '#8E4E5A');
      skyGrad.addColorStop(0.78, '#E05A2B');
      skyGrad.addColorStop(0.92, '#E69D3B');
      skyGrad.addColorStop(1, '#F3C06B');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.65);

      // Distant Dusk Sun Glow
      const sunGrad = ctx.createRadialGradient(w * 0.58, h * 0.48, 10, w * 0.58, h * 0.48, 260);
      sunGrad.addColorStop(0, 'rgba(255, 230, 160, 0.95)');
      sunGrad.addColorStop(0.2, 'rgba(230, 157, 59, 0.7)');
      sunGrad.addColorStop(0.5, 'rgba(224, 90, 43, 0.35)');
      sunGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, w, h * 0.65);

      // Distant mountain silhouette (Mt. Fuji)
      ctx.fillStyle = '#26344E';
      ctx.beginPath();
      ctx.moveTo(w * 0.32, h * 0.58);
      ctx.lineTo(w * 0.54, h * 0.28);
      ctx.lineTo(w * 0.58, h * 0.28);
      ctx.lineTo(w * 0.78, h * 0.58);
      ctx.closePath();
      ctx.fill();

      // Fuji Snowcap Highlights (Atmospheric Mist)
      const mistGrad = ctx.createLinearGradient(0, h * 0.28, 0, h * 0.42);
      mistGrad.addColorStop(0, 'rgba(230, 240, 255, 0.85)');
      mistGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = mistGrad;
      ctx.beginPath();
      ctx.moveTo(w * 0.48, h * 0.36);
      ctx.lineTo(w * 0.54, h * 0.28);
      ctx.lineTo(w * 0.58, h * 0.28);
      ctx.lineTo(w * 0.63, h * 0.36);
      ctx.closePath();
      ctx.fill();

      // Midground Mountain Ridges
      ctx.fillStyle = '#1B273D';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.56);
      ctx.quadraticCurveTo(w * 0.22, h * 0.46, w * 0.45, h * 0.57);
      ctx.lineTo(w * 0.45, h * 0.65);
      ctx.lineTo(0, h * 0.65);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#182132';
      ctx.beginPath();
      ctx.moveTo(w * 0.48, h * 0.58);
      ctx.quadraticCurveTo(w * 0.74, h * 0.44, w, h * 0.52);
      ctx.lineTo(w, h * 0.65);
      ctx.lineTo(w * 0.48, h * 0.65);
      ctx.closePath();
      ctx.fill();

      // Lake Water (Mirror reflection)
      const lakeGrad = ctx.createLinearGradient(0, h * 0.65, 0, h);
      lakeGrad.addColorStop(0, '#121C2F');
      lakeGrad.addColorStop(0.3, '#1B2B4A');
      lakeGrad.addColorStop(0.65, '#4B6E8C');
      lakeGrad.addColorStop(1, '#181E29');
      ctx.fillStyle = lakeGrad;
      ctx.fillRect(0, h * 0.65, w, h * 0.35);

      // Lake sunset shimmering ripples
      const rippleGrad = ctx.createLinearGradient(w * 0.45, 0, w * 0.7, 0);
      rippleGrad.addColorStop(0, 'transparent');
      rippleGrad.addColorStop(0.5, 'rgba(224, 90, 43, 0.4)');
      rippleGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = rippleGrad;
      for (let r = 0; r < 24; r++) {
        const ry = h * 0.66 + r * 14;
        ctx.fillRect(w * 0.4 + (r % 3) * 15, ry, w * 0.35 - r * 6, 2.5);
      }

      // Foreground Autumn Maple Leaves & Canopy (Vibrant Autumn Ember #E05A2B and Solar Gold)
      const foliageColors = ['#E05A2B', '#E69D3B', '#8E4E5A', '#B93E1B', '#D97706', '#662230'];
      for (let i = 0; i < 90; i++) {
        const fx = (i * 47) % (w * 0.42);
        const fy = h * 0.05 + (i * 31) % (h * 0.48);
        const size = 18 + (i % 26);
        ctx.fillStyle = foliageColors[i % foliageColors.length];
        ctx.beginPath();
        ctx.arc(fx, fy, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Foreground Right Shore & Pines
      ctx.fillStyle = '#10141D';
      ctx.beginPath();
      ctx.moveTo(w * 0.72, h);
      ctx.lineTo(w * 0.78, h * 0.78);
      ctx.lineTo(w, h * 0.74);
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();

      // Right autumn trees
      for (let j = 0; j < 60; j++) {
        const rx = w * 0.75 + (j * 37) % (w * 0.25);
        const ry = h * 0.65 + (j * 23) % (h * 0.28);
        const rsize = 14 + (j % 22);
        ctx.fillStyle = foliageColors[(j + 2) % foliageColors.length];
        ctx.beginPath();
        ctx.arc(rx, ry, rsize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },
  {
    id: 'cyberpunk_neon',
    name: 'Cyberpunk Neon Tokyo',
    filename: 'cyberpunk_shinjuku_rain.png',
    width: 1440,
    height: 900,
    fileSize: '412 KB',
    format: 'image/png',
    description: 'Night cityscape with electric magenta neon, cyan laser reflections, and deep obsidian asphalt.',
    render: (ctx, w, h) => {
      // Dark city night backdrop
      ctx.fillStyle = '#080A10';
      ctx.fillRect(0, 0, w, h);

      // Deep cyan/indigo atmospheric haze
      const hazeGrad = ctx.createLinearGradient(0, 0, 0, h);
      hazeGrad.addColorStop(0, '#0F172A');
      hazeGrad.addColorStop(0.5, '#1E1B4B');
      hazeGrad.addColorStop(1, '#090D16');
      ctx.fillStyle = hazeGrad;
      ctx.fillRect(0, 0, w, h);

      // High-rise geometric buildings
      const buildingColors = ['#0C101A', '#111827', '#151C2C', '#0E1320'];
      for (let b = 0; b < 16; b++) {
        const bx = b * 95;
        const bw = 75 + (b % 4) * 15;
        const bh = h * 0.4 + (b * 63 % (h * 0.45));
        ctx.fillStyle = buildingColors[b % buildingColors.length];
        ctx.fillRect(bx, h - bh, bw, bh);

        // Building window grids
        ctx.fillStyle = b % 2 === 0 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(236, 72, 153, 0.35)';
        for (let row = 0; row < 12; row++) {
          for (let col = 0; col < 4; col++) {
            if ((row + col + b) % 3 === 0) {
              ctx.fillRect(bx + 10 + col * 14, h - bh + 25 + row * 22, 6, 9);
            }
          }
        }
      }

      // Neon Signs & Glowing Billboards
      // Neon Magenta billboard
      const magGlow = ctx.createRadialGradient(w * 0.28, h * 0.45, 10, w * 0.28, h * 0.45, 180);
      magGlow.addColorStop(0, '#EC4899');
      magGlow.addColorStop(0.3, 'rgba(219, 39, 119, 0.6)');
      magGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = magGlow;
      ctx.fillRect(w * 0.15, h * 0.3, 300, 240);

      // Cyan Neon billboard
      const cyanGlow = ctx.createRadialGradient(w * 0.72, h * 0.38, 10, w * 0.72, h * 0.38, 190);
      cyanGlow.addColorStop(0, '#06B6D4');
      cyanGlow.addColorStop(0.4, 'rgba(14, 165, 233, 0.55)');
      cyanGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = cyanGlow;
      ctx.fillRect(w * 0.58, h * 0.22, 320, 260);

      // Electric Violet Beacon
      const vioGlow = ctx.createRadialGradient(w * 0.5, h * 0.25, 5, w * 0.5, h * 0.25, 140);
      vioGlow.addColorStop(0, '#8B5CF6');
      vioGlow.addColorStop(0.5, 'rgba(99, 102, 241, 0.4)');
      vioGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = vioGlow;
      ctx.fillRect(w * 0.4, h * 0.15, 200, 180);

      // Wet Street Rain Reflections on Ground
      const wetGrad = ctx.createLinearGradient(0, h * 0.75, 0, h);
      wetGrad.addColorStop(0, '#0E131F');
      wetGrad.addColorStop(1, '#05070B');
      ctx.fillStyle = wetGrad;
      ctx.fillRect(0, h * 0.75, w, h * 0.25);

      // Street reflections of neon lights
      ctx.fillStyle = 'rgba(236, 72, 153, 0.45)';
      ctx.fillRect(w * 0.2, h * 0.76, 120, h * 0.24);

      ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.fillRect(w * 0.65, h * 0.76, 140, h * 0.24);

      ctx.fillStyle = 'rgba(250, 204, 21, 0.35)';
      ctx.fillRect(w * 0.44, h * 0.78, 60, h * 0.22);
    }
  },
  {
    id: 'nordic_minimal',
    name: 'Nordic Coastal Fjord',
    filename: 'nordic_fjord_calm.webp',
    width: 1400,
    height: 800,
    fileSize: '286 KB',
    format: 'image/webp',
    description: 'Clean architectural palette with glacial sea green, slate basalt, and warm sand birch.',
    render: (ctx, w, h) => {
      // Glacial Mist Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.6);
      skyGrad.addColorStop(0, '#D1D5DB');
      skyGrad.addColorStop(0.4, '#99F6E4');
      skyGrad.addColorStop(0.85, '#5EEAD4');
      skyGrad.addColorStop(1, '#2DD4BF');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.6);

      // Sheer Coastal Basalt Cliffs
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.1);
      ctx.lineTo(w * 0.35, h * 0.45);
      ctx.lineTo(w * 0.4, h * 0.6);
      ctx.lineTo(0, h * 0.6);
      ctx.closePath();
      ctx.fill();

      // Right Fjord Mountain
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.6);
      ctx.lineTo(w * 0.75, h * 0.25);
      ctx.lineTo(w, h * 0.35);
      ctx.lineTo(w, h * 0.6);
      ctx.closePath();
      ctx.fill();

      // Glacial Emerald Fjord Water
      const waterGrad = ctx.createLinearGradient(0, h * 0.6, 0, h);
      waterGrad.addColorStop(0, '#0D9488');
      waterGrad.addColorStop(0.5, '#115E59');
      waterGrad.addColorStop(1, '#134E4A');
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, h * 0.6, w, h * 0.4);

      // Architectural Minimalist Timber Cabin in Foreground
      ctx.fillStyle = '#D97706'; // Warm birch wood
      ctx.fillRect(w * 0.62, h * 0.52, 95, 65);
      ctx.fillStyle = '#1C1917'; // Roof
      ctx.beginPath();
      ctx.moveTo(w * 0.6, h * 0.52);
      ctx.lineTo(w * 0.67, h * 0.44);
      ctx.lineTo(w * 0.74, h * 0.52);
      ctx.closePath();
      ctx.fill();

      // Cabin warm light
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(w * 0.65, h * 0.55, 24, 28);
    }
  }
];

/**
 * Generates an image data URL from a preset definition
 */
export function getPresetDataUrl(presetId) {
  const preset = SAMPLE_PRESETS.find((p) => p.id === presetId) || SAMPLE_PRESETS[0];
  const canvas = document.createElement('canvas');
  canvas.width = preset.width;
  canvas.height = preset.height;
  const ctx = canvas.getContext('2d');
  preset.render(ctx, preset.width, preset.height);
  return {
    preset,
    dataUrl: canvas.toDataURL('image/jpeg', 0.92)
  };
}
