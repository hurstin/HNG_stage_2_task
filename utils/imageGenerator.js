import Jimp from 'jimp';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CACHE_DIR = path.join(__dirname, '..', 'cache');
const IMAGE_PATH = path.join(CACHE_DIR, 'summary.png');

export const generateSummaryImage = async (
  totalCountries,
  topGdpCountries,
  lastRefreshedAt
) => {
  try {
    // Ensure the cache directory exists
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    const imageWidth = 800;
    const imageHeight = 600;
    const image = new Jimp(imageWidth, imageHeight, 0x000000ff); // Black background

    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    const smallFont = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);

    let y = 50;
    const x = 50;

    image.print(font, x, y, `Country Data Summary`);
    y += 60;

    image.print(smallFont, x, y, `Total Countries: ${totalCountries}`);
    y += 30;

    image.print(smallFont, x, y, `Top 5 Countries by Estimated GDP:`);
    y += 30;

    topGdpCountries.forEach((country, index) => {
      image.print(
        smallFont,
        x + 20,
        y,
        `${index + 1}. ${
          country.name
        }: $${country.estimated_gdp.toLocaleString()}`
      );
      y += 25;
    });
    y += 30;

    image.print(
      smallFont,
      x,
      y,
      `Last Refreshed: ${
        lastRefreshedAt ? new Date(lastRefreshedAt).toLocaleString() : 'N/A'
      }`
    );

    await image.writeAsync(IMAGE_PATH);
    console.log(`Summary image generated at ${IMAGE_PATH}`);
  } catch (error) {
    console.error('Error generating summary image:', error);
  }
};
