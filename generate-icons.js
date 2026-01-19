const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
}

sizes.forEach(size => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Set background
    ctx.fillStyle = '#4f46e5';
    ctx.fillRect(0, 0, size, size);

    // Draw simple wallet icon
    ctx.fillStyle = 'white';
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.3;

    // Wallet body
    ctx.fillRect(centerX - radius, centerY - radius * 0.6, radius * 2, radius * 1.2);

    // Money symbol
    ctx.font = `${size * 0.4}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('$', centerX, centerY + size * 0.15);

    // Save as PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(iconsDir, `icon-${size}.png`), buffer);
    console.log(`Generated icon-${size}.png`);
});

console.log('All PWA icons generated successfully!');