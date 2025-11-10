// Lightweight runtime theming using logo colors
// Loads two images, computes average RGB for each,
// then exposes CSS variables and a gradient used across the app.

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

function averageColor(img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const width = 64;
  const height = Math.max(1, Math.round((img.height / img.width) * width));
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);
  const { data } = ctx.getImageData(0, 0, width, height);
  let r = 0, g = 0, b = 0, a = 0, count = 0;
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3] / 255;
    // Skip nearly transparent or near-black pixels (likely background)
    if (alpha < 0.2) continue;
    const pr = data[i];
    const pg = data[i + 1];
    const pb = data[i + 2];
    if (pr < 8 && pg < 8 && pb < 8) continue;
    r += pr * alpha;
    g += pg * alpha;
    b += pb * alpha;
    a += alpha;
    count++;
  }
  if (!count || a === 0) return { r: 102, g: 126, b: 234 }; // fallback bluish
  return { r: Math.round(r / a), g: Math.round(g / a), b: Math.round(b / a) };
}

function rgbToHex({ r, g, b }) {
  const toHex = (v) => v.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mix(c1, c2, t) {
  const m = (a, b) => Math.round(a + (b - a) * t);
  return { r: m(c1.r, c2.r), g: m(c1.g, c2.g), b: m(c1.b, c2.b) };
}

function luminance({ r, g, b }) {
  const srgb = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function ensureContrast(color, dark = true) {
  // Slightly lighten/darken to ensure it pops on dark UI
  const factor = dark ? 1.15 : 0.85;
  const adj = {
    r: Math.max(0, Math.min(255, Math.round(color.r * factor))),
    g: Math.max(0, Math.min(255, Math.round(color.g * factor))),
    b: Math.max(0, Math.min(255, Math.round(color.b * factor)))
  };
  // Prefer brighter accent if resulting luminance is too low
  if (luminance(adj) < 0.15) {
    return mix(adj, { r: 255, g: 255, b: 255 }, 0.25);
  }
  return adj;
}

export async function initBrandTheme(primarySrc, secondarySrc) {
  try {
    const [img1, img2] = await Promise.all([loadImage(primarySrc), loadImage(secondarySrc)]);
    const c1 = ensureContrast(averageColor(img1), true);
    const c2 = ensureContrast(averageColor(img2), true);

    const cMid = mix(c1, c2, 0.5);
    const primaryHex = rgbToHex(c1);
    const secondaryHex = rgbToHex(c2);
    const midHex = rgbToHex(cMid);

    const root = document.documentElement;
    root.style.setProperty('--brand-primary', primaryHex);
    root.style.setProperty('--brand-secondary', secondaryHex);
    root.style.setProperty('--brand-mid', midHex);
    root.style.setProperty('--brand-gradient', `linear-gradient(135deg, ${primaryHex} 0%, ${midHex} 50%, ${secondaryHex} 100%)`);
    root.style.setProperty('--brand-glow', `${primaryHex}33`);
    root.style.setProperty('--brand-on', '#f8fafc'); // on-brand text
  } catch (e) {
    // Leave existing CSS fallbacks
    console.warn('Brand theme initialization failed, using defaults.', e);
  }
}


