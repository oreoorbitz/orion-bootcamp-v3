import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the root directory of the project
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../'); // adjust if your tags/ file moves

const MODULE_PREFIX_PATH = path.join(ROOT, '/hub/modules/general');

export default function getMarkdownContent(name) {
  const filePath = path.join(MODULE_PREFIX_PATH, name, `${name}.md`);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Markdown file not found: ${filePath}`);
    return '⚠️ Markdown file missing.';
  }

  return fs.readFileSync(filePath, 'utf-8');
}
