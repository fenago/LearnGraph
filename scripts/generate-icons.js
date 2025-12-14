/**
 * PWA Icon Generator Script
 * Run with: node scripts/generate-icons.js
 *
 * This creates placeholder PNG icons for PWA.
 * For production, replace with actual designed icons.
 */

const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');

// SVG template for the icon
const createSvg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1"/>
      <stop offset="50%" style="stop-color:#8b5cf6"/>
      <stop offset="100%" style="stop-color:#ec4899"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#bgGrad)"/>
  <g transform="translate(96, 96) scale(1.25)" fill="none" stroke="white" stroke-width="20" stroke-linecap="round" stroke-linejoin="round">
    <path d="M128 48C96 48 64 80 64 112C64 128 72 144 84 156C72 168 64 184 64 200C64 232 88 256 120 264L120 304L136 304L136 264C168 256 192 232 192 200C192 184 184 168 172 156C184 144 192 128 192 112C192 80 160 48 128 48Z"/>
    <path d="M80 128C96 136 112 136 128 128"/>
    <path d="M80 176C96 184 112 184 128 176"/>
    <path d="M128 128C144 136 160 136 176 128"/>
    <path d="M128 176C144 184 160 184 176 176"/>
    <line x1="128" y1="64" x2="128" y2="240"/>
    <circle cx="64" cy="144" r="8" fill="white"/>
    <circle cx="192" cy="144" r="8" fill="white"/>
    <circle cx="88" cy="200" r="6" fill="white"/>
    <circle cx="168" cy="200" r="6" fill="white"/>
  </g>
  <circle cx="432" cy="80" r="24" fill="#34d399"/>
</svg>`;

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create SVG icons for each size (browsers will render them correctly)
sizes.forEach(size => {
  const svgContent = createSvg(size);
  const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(svgPath, svgContent);
  console.log(`Created: icon-${size}x${size}.svg`);
});

// Also create apple-touch-icon
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.svg'), createSvg(180));
console.log('Created: apple-touch-icon.svg');

console.log('\nIcon generation complete!');
console.log('\nNote: For production, convert these SVGs to PNGs using a tool like:');
console.log('  - sharp (npm package)');
console.log('  - ImageMagick: convert icon.svg -resize 192x192 icon-192x192.png');
console.log('  - Online converter: cloudconvert.com');
