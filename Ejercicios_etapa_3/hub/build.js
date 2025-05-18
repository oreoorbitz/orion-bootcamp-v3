import { Liquid } from 'liquidjs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const engine = new Liquid({
  root: [
    path.join(__dirname, 'layout'),
    path.join(__dirname, 'templates'),
    path.join(__dirname, 'snippets'),
    path.join(__dirname, 'sections')
  ],
  extname: '.liquid'
});

const buildTailwind = () => {
  return new Promise((resolve, reject) => {
    exec(
      'npx @tailwindcss/cli -i ./Ejercicios_etapa_3/hub/styles/tailwind.css -o ./Ejercicios_etapa_3/hub/dist/tailwind.css --minify',
      (error, stdout, stderr) => {
        if (error) return reject(error);
        console.log(stdout || stderr);
        resolve();
      }
    );
  });
};

const buildPages = async () => {
  const templateDir = path.join(__dirname, 'templates');
  const outputDir = path.join(__dirname, 'dist');

  await fs.mkdir(outputDir, { recursive: true });

  const files = await fs.readdir(templateDir);

  for (const file of files) {
    if (!file.endsWith('.liquid')) continue;

    const filepath = path.join(templateDir, file);
    const templateContent = await fs.readFile(filepath, 'utf-8');

    const html = await engine.renderFile(file, {});

    const outputPath = path.join(outputDir, file.replace('.liquid', '.html'));
    await fs.writeFile(outputPath, html, 'utf-8');
    console.log(`✅ Built ${outputPath}`);
  }
};

const run = async () => {
  await buildTailwind();
  await buildPages();
};

run().catch(console.error);
