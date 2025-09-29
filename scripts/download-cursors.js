import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cursors = {
  'default.png': 'https://raw.githubusercontent.com/sdl60660/mac-cursors/main/default.png',
  'default@2x.png': 'https://raw.githubusercontent.com/sdl60660/mac-cursors/main/default%402x.png',
  'pointer.png': 'https://raw.githubusercontent.com/sdl60660/mac-cursors/main/pointer.png',
  'pointer@2x.png': 'https://raw.githubusercontent.com/sdl60660/mac-cursors/main/pointer%402x.png',
  'text.png': 'https://raw.githubusercontent.com/sdl60660/mac-cursors/main/text.png',
  'text@2x.png': 'https://raw.githubusercontent.com/sdl60660/mac-cursors/main/text%402x.png'
};

const cursorsDir = path.join(__dirname, 'public', 'cursors');

// Create cursors directory if it doesn't exist
if (!fs.existsSync(cursorsDir)) {
  fs.mkdirSync(cursorsDir, { recursive: true });
}

// Download each cursor
Object.entries(cursors).forEach(([filename, url]) => {
  const filePath = path.join(cursorsDir, filename);
  https.get(url, (response) => {
    const fileStream = fs.createWriteStream(filePath);
    response.pipe(fileStream);
    fileStream.on('finish', () => {
      console.log(`Downloaded ${filename}`);
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${filename}:`, err);
  });
});