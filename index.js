import fs from 'fs';
import axios from 'axios';
import { get_png_from_api } from './source/api.js';
import { create_image_with_text } from './source/image-utils.js';
import { makeSwishData } from './source/data-utils.js';

// Endpoint
const endpoint = 'https://mpc.getswish.net/qrg-swish/api/v1/prefilled';

const swishDataRaw = [
  { value: '700', message: 'TA Nybörjare Lekjudo' },
  { value: '1200', message: 'TA öv 7år u 20år' },
  { value: '1400', message: 'TA öv 20 år' },
  { value: '3000', message: 'TA Familj' },
  { value: '200', message: 'Medlemsavgift Aktiv' },
  // { value: '3000', message: "Medlemsavgift Familj" },
  { value: '200', message: 'Stödmedlem' },
];

// Swish info
const swishData = swishDataRaw.map(({ value, message }) =>
  makeSwishData(value, message)
);

// Directory to save the created images
const outputDirectory = './output_images';

// Make sure the output directory exists
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory);
}

// Load font from the web
const fontUrl =
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap'; // Example font URL
axios
  .get(fontUrl)
  .then((response) => {
    const font = response.data;
    // Here, you can parse the font CSS or use it directly in ctx.font

    // Iterate over API URLs and texts
    swishData.forEach(async (priceGroup) => {
      const text = priceGroup.message.value;
      // Make API call to get PNG content
      const pngContent = await get_png_from_api(endpoint, priceGroup);
      if (pngContent) {
        // Create image with text
        const outputFileName = `${text}.png`; // Use text as filename (you might want to sanitize this)
        const outputPath = `${outputDirectory}/${outputFileName}`;
        await create_image_with_text(pngContent, text, outputPath);
        console.log(`Image with text "${text}" created at ${outputPath}`);
      }
    });
  })
  .catch((error) => {
    console.error(`Failed to load font from ${fontUrl}: ${error.message}`);
  });
