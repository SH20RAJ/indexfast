import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, '..', 'public');

// ⚡ Lightning bolt SVG path on black background with rounded corners
function createIconSvg(size) {
  const radius = Math.round(size * 0.2);
  // Lightning bolt path scaled to fit within the icon
  // Centered within the viewBox
  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#09090b"/>
  <g transform="translate(${size * 0.25}, ${size * 0.1}) scale(${size / 512})">
    <path d="M280 20 L120 260 L200 260 L160 480 L380 200 L280 200 Z" fill="#FACC15"/>
  </g>
</svg>`;
}

// OG Image: IndexFast branding with lightning bolt
function createOgSvg() {
  return `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#09090b"/>
      <stop offset="100%" stop-color="#18181b"/>
    </linearGradient>
    <linearGradient id="bolt" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FDE68A"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <!-- Lightning bolt icon -->
  <g transform="translate(440, 80) scale(0.9)">
    <path d="M280 20 L120 260 L200 260 L160 480 L380 200 L280 200 Z" fill="url(#bolt)" opacity="0.15"/>
  </g>
  <g transform="translate(100, 80) scale(0.65)">
    <path d="M280 20 L120 260 L200 260 L160 480 L380 200 L280 200 Z" fill="url(#bolt)"/>
  </g>
  <!-- IndexFast text -->
  <text x="420" y="340" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="96" fill="white">IndexFast</text>
  <!-- Tagline -->
  <text x="420" y="410" font-family="Arial, Helvetica, sans-serif" font-size="32" fill="#a1a1aa">Get indexed in minutes, not weeks.</text>
  <!-- URL -->
  <text x="420" y="550" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#52525b">indexfast.strivio.world</text>
</svg>`;
}

// All required icon sizes
const iconSizes = [
  { size: 16,   name: 'favicon-16x16.png' },
  { size: 32,   name: 'favicon-32x32.png' },
  { size: 48,   name: 'favicon-48x48.png' },
  { size: 64,   name: 'icon-64.png' },
  { size: 72,   name: 'icon-72.png' },
  { size: 96,   name: 'icon-96.png' },
  { size: 128,  name: 'icon-128.png' },
  { size: 144,  name: 'icon-144.png' },
  { size: 152,  name: 'icon-152.png' },
  { size: 167,  name: 'icon-167.png' },
  { size: 180,  name: 'apple-touch-icon.png' },
  { size: 192,  name: 'icon-192.png' },
  { size: 256,  name: 'icon-256.png' },
  { size: 384,  name: 'icon-384.png' },
  { size: 512,  name: 'icon-512.png' },
];

async function generate() {
  // Generate all icon sizes
  for (const { size, name } of iconSizes) {
    const svg = createIconSvg(size);
    await sharp(Buffer.from(svg))
      .png()
      .toFile(path.join(outputDir, name));
    console.log(`✅ ${name} (${size}x${size})`);
  }

  // Generate maskable icon (with extra padding for safe zone)
  const maskableSize = 512;
  const maskableSvg = `
<svg width="${maskableSize}" height="${maskableSize}" viewBox="0 0 ${maskableSize} ${maskableSize}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${maskableSize}" height="${maskableSize}" fill="#09090b"/>
  <g transform="translate(${maskableSize * 0.3}, ${maskableSize * 0.18}) scale(${maskableSize / 640})">
    <path d="M280 20 L120 260 L200 260 L160 480 L380 200 L280 200 Z" fill="#FACC15"/>
  </g>
</svg>`;
  await sharp(Buffer.from(maskableSvg))
    .png()
    .toFile(path.join(outputDir, 'icon-maskable-512.png'));
  console.log('✅ icon-maskable-512.png (512x512, maskable)');

  await sharp(Buffer.from(maskableSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(outputDir, 'icon-maskable-192.png'));
  console.log('✅ icon-maskable-192.png (192x192, maskable)');

  // Generate OG image
  const ogSvg = createOgSvg();
  await sharp(Buffer.from(ogSvg))
    .png()
    .toFile(path.join(outputDir, 'og-image.png'));
  console.log('✅ og-image.png (1200x630)');

  // Also generate as jpg for smaller file size
  await sharp(Buffer.from(ogSvg))
    .jpeg({ quality: 90 })
    .toFile(path.join(outputDir, 'og-image.jpg'));
  console.log('✅ og-image.jpg (1200x630)');

  // Generate Twitter card image (same as OG but can be different)
  await sharp(Buffer.from(ogSvg))
    .png()
    .toFile(path.join(outputDir, 'twitter-image.png'));
  console.log('✅ twitter-image.png (1200x630)');

  console.log('\n🎉 All images generated successfully!');
}

generate().catch(console.error);
