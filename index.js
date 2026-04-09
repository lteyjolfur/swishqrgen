import fs from "fs";
import axios from "axios";
import { createCanvas, loadImage } from "canvas";

// Function to make API calls and retrieve PNGs
export async function get_png_from_api(url, data) {
  try {
    const response = await axios.post(url, data, {
      responseType: "arraybuffer",
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to retrieve PNG from ${url}: ${error.message}`);
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
      // If the response is not binary, print as text
      try {
        console.error("Body:", error.response.data.toString());
      } catch {
        console.error("Body: <binary data>");
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received. Request:", error.request);
    } else {
      // Something happened in setting up the request
      console.error("Error config:", error.config);
    }
    // Optionally, log the request data
    console.error("Request data:", data);
    return null;
  }
}

// Function to create a new image with text on a pink background
export async function create_image_with_text(png_content, text, output_path) {
  // Load the PNG image from the buffer
  const image = await loadImage(png_content);
  const canvas = createCanvas(image.width, image.height + 50);
  const ctx = canvas.getContext("2d");

  // Draw pink background
  const gradient = ctx.createLinearGradient(
    0,
    canvas.height - 50,
    0,
    canvas.height,
  );
  gradient.addColorStop(0, "#D0385C"); // Bottom left
  gradient.addColorStop(1, "#B62F8D"); // Top right
  ctx.fillStyle = gradient;
  ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

  // Draw PNG image
  ctx.drawImage(image, 0, 0);

  // Add text below the image
  ctx.font = '20px "Roboto"'; // Use the loaded font
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width / 2, image.height + 30);

  // Save canvas to file
  const out = fs.createWriteStream(output_path);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  return new Promise((resolve, reject) => {
    out.on("finish", resolve);
    out.on("error", reject);
  });
}

// Endpoint
const endpoint = "https://mpc.getswish.net/qrg-swish/api/v1/prefilled";

const swishDataRaw = [
  { value: "700", message: "TA Nybörjare Lekjudo" },
  { value: "1200", message: "TA öv 7år u 20år" },
  { value: "1400", message: "TA öv 20 år" },
  { value: "3000", message: "TA Familj" },
  { value: "200", message: "Medlemsavgift Aktiv" },
  // { value: '3000', message: "Medlemsavgift Familj" },
  { value: "200", message: "Stödmedlem" },
];

export const makeSwishData = (amount, message) => {
  return {
    format: "png",
    payee: {
      value: amount,
      editable: false,
    },
    message: {
      value: message,
      editable: false,
    },
    size: 300,
    border: 2,
    transparent: false,
  };
};

// Swish info
const swishData = swishDataRaw.map(({ value, message }) =>
  makeSwishData(value, message),
);

// Directory to save the created images
const outputDirectory = "./output_images";

// Make sure the output directory exists
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory);
}

// Load font from the web
const fontUrl =
  "https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap"; // Example font URL
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
