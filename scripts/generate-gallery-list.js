/**
 * Scans public/bd/ for files whose name starts with "gallery" and writes
 * src/utils/galleryImages.generated.js so the gallery section uses those images.
 * Run automatically before dev/build (predev, prebuild).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const bdDir = path.join(projectRoot, 'public', 'bd');
const outPath = path.join(projectRoot, 'src', 'utils', 'galleryImages.generated.js');

let names = [];
try {
  if (fs.existsSync(bdDir)) {
    names = fs.readdirSync(bdDir)
      .filter((name) => name.toLowerCase().startsWith('gallery'))
      .sort();
  }
} catch (e) {
  console.warn('generate-gallery-list:', e.message);
}

const content = `/* Auto-generated: files in public/bd/ whose name starts with "gallery" */
export const GALLERY_IMAGES = ${JSON.stringify(names, null, 2)};
`;

fs.writeFileSync(outPath, content, 'utf8');
console.log('Gallery list:', names.length ? names.join(', ') : '(none found)');
