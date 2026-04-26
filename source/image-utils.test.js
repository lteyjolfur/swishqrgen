import { createCanvas } from 'canvas';
import fs from 'fs';
import assert from 'assert';
import { create_image_with_text } from './image-utils.js';
import * as canvasModule from 'canvas';
import sinon from 'sinon';

describe('create_image_with_text', function () {
  it('should create an image with text', async function () {
    // Create a dummy PNG buffer
    const canvas = createCanvas(100, 100);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 100, 100);
    const pngBuffer = canvas.toBuffer();

    // Mock loadImage to return a dummy image object
    const dummyImage = { width: 100, height: 100 };
    const loadImageStub = sinon
      .stub(canvasModule, 'loadImage')
      .resolves(dummyImage);

    const outputPath = './output_images/test_image_utils.png';
    await create_image_with_text(pngBuffer, 'Hello', outputPath);
    assert(fs.existsSync(outputPath));
    fs.unlinkSync(outputPath);
    loadImageStub.restore();
  });
});
