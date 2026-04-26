import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export async function create_image_with_text(png_content, text, output_path) {
  const image = await loadImage(png_content);

  const padding = 28;
  const gap = 18;
  const labelHeight = 64;
  const cardRadius = 26;
  const labelRadius = 18;
  const shadowBlur = 22;
  const shadowOffsetY = 8;

  const canvasWidth = image.width + padding * 2;
  const canvasHeight = image.height + padding * 2 + gap + labelHeight + 8;

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  // Transparent background
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Card shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.14)';
  ctx.shadowBlur = shadowBlur;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = shadowOffsetY;

  roundRect(ctx, 8, 8, canvasWidth - 16, canvasHeight - 16, cardRadius);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
  ctx.fill();
  ctx.restore();

  // Card background
  roundRect(ctx, 8, 8, canvasWidth - 16, canvasHeight - 16, cardRadius);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
  ctx.fill();

  // Subtle border
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // QR image
  const imageX = padding;
  const imageY = padding;
  ctx.drawImage(image, imageX, imageY);

  // Label pill
  const labelX = padding;
  const labelY = imageY + image.height + gap;
  const labelWidth = image.width;

  const gradient = ctx.createLinearGradient(
    labelX,
    labelY,
    labelX + labelWidth,
    labelY + labelHeight
  );
  gradient.addColorStop(0, '#D0385C');
  gradient.addColorStop(1, '#B62F8D');

  roundRect(ctx, labelX, labelY, labelWidth, labelHeight, labelRadius);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Label text
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '600 22px "Inter", "Roboto", "Arial", sans-serif';
  ctx.fillText(text, canvasWidth / 2, labelY + labelHeight / 2 + 1);

  // Save file
  const out = fs.createWriteStream(output_path);
  const stream = canvas.createPNGStream();
  stream.pipe(out);

  return new Promise((resolve, reject) => {
    out.on('finish', resolve);
    out.on('error', reject);
  });
}
