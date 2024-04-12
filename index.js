const fs = require('fs');
const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');

// Function to make API calls and retrieve PNGs
async function get_png_from_api(url, data) {
    try {
        const response = await axios.post(url, data, { responseType: 'arraybuffer' });
        return response.data;
    } catch (error) {
        console.error(`Failed to retrieve PNG from ${url}: ${error.message}`);
        return null;
    }
}

// Function to create a new image with text on a pink background
async function create_image_with_text(png_content, text, output_path) {

    async function save_png_to_file(png_content, filename) {
        try {
            // Write PNG content to file
            fs.writeFileSync(filename, png_content);

            console.log(`Image saved to ${filename}`);
        } catch (error) {
            console.error('Error saving image to file:', error);
        }
    }
    save_png_to_file(png_content, text + 'test.png');

    const image = await loadImage(png_content);
    const canvas = createCanvas(image.width, image.height + 50);
    const ctx = canvas.getContext('2d');

    // Draw pink background
    ctx.fillStyle = 'rgb(255, 192, 203)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw PNG image
    ctx.drawImage(image, 0, 0);

    // Add text below the image
    ctx.font = '20px "Roboto"'; // Use the loaded font
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

// Endpoint
const endpoint = "https://mpc.getswish.net/qrg-swish/api/v1/prefilled"

const swishDataRaw = [
    { value: '700', message: "TA Nybörjare Lekjudo" },
    { value: '1000', message: "TA öv 7år - 20år" },
    { value: '1200', message: "TA öv 20 år" },
    { value: '2500', message: "TA Familj" },
    { value: '200', message: "Medlemsavgift Aktiv" },
    { value: '200', message: "Medlemsavgift Familj" },
    { value: '200', message: "Stödmedlem" },
]


const makeSwishData = (amount, message) => {
    return {
        format: 'png',
        payee:
        {
            value: '1233630423',
            editable: false
        },
        amount:
        {
            value: amount,
            editable: false
        },
        message:
        {
            value: message,
            editable: false
        },
        size: 300,
        border: 2,
        transparent: false,
    }
}

// Swish info
const swishData = swishDataRaw.map(({ value, message }) => makeSwishData(value, message));

// Directory to save the created images
const outputDirectory = "./output_images";

// Make sure the output directory exists
if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
}

// Load font from the web
const fontUrl = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap'; // Example font URL
axios.get(fontUrl)
    .then(response => {
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
    .catch(error => {
        console.error(`Failed to load font from ${fontUrl}: ${error.message}`);
    });
