import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';

export async function create_image_with_text(png_content, text, output_path) {
  const image = await loadImage(png_content);
  const canvas = createCanvas(image.width, image.height + 50);
  const ctx = canvas.getContext('2d');

  // Draw pink background
  const gradient = ctx.createLinearGradient(
    0,
    canvas.height - 50,
    0,
    canvas.height
  );
  gradient.addColorStop(0, '#D0385C');
  gradient.addColorStop(1, '#B62F8D');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

  // Draw PNG image
  ctx.drawImage(image, 0, 0);

  // Add text below the image
  ctx.font = '20px "Roboto"';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.fillText(text, canvas.width / 2, image.height + 30);

  // Save canvas to file
  const out = fs.createWriteStream(output_path);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  return new Promise((resolve, reject) => {
    out.on('finish', resolve);
    out.on('error', reject);
  });
}
