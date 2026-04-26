import { createCanvas } from 'canvas';
import fs from 'fs';
import assert from 'assert';
import { create_image_with_text } from './image-utils.js';
import * as canvasModule from 'canvas';
import sinon from 'sinon';

describe('create_image_with_text', function () {
  it('should create an image with text', async function () {
    // Create a real PNG buffer
    const canvas = createCanvas(100, 100);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 100, 100);
    const pngBuffer = canvas.toBuffer();

    const outputPath = './output_images/test_image_utils.png';
    await create_image_with_text(pngBuffer, 'Hello', outputPath);
    assert(fs.existsSync(outputPath));
    // Optionally, check that the file is a PNG by reading the first 8 bytes
    const fileBuffer = fs.readFileSync(outputPath);
    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    assert(
      fileBuffer[0] === 0x89 &&
        fileBuffer[1] === 0x50 &&
        fileBuffer[2] === 0x4e &&
        fileBuffer[3] === 0x47
    );
    fs.unlinkSync(outputPath);
  });
});
