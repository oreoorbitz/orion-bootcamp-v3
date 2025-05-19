import registerLinkToModule from './filters/link_to_module.js';
import registerHtmlOutput from './tags/htmlOutput.js';
import registerJavascriptInput from './tags/javascriptInput.js';
import { Liquid } from 'liquidjs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import glob from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const copyJavaScriptFiles = async () => {
  const sourceDir = path.join(__dirname, 'javascript');
  const targetDir = path.resolve(__dirname, '../assets');

  try {
    const files = await fs.readdir(sourceDir);
    for (const file of files) {
      if (!file.endsWith('.js')) continue;

      const srcPath = path.join(sourceDir, file);
      const destPath = path.join(targetDir, file);
      await fs.copyFile(srcPath, destPath);
      console.log(`📦 Copied JS: ${file}`);
    }
  } catch (err) {
    console.warn('⚠️ No JavaScript files to copy or source folder missing.');
  }
};

const engine = new Liquid({
  root: [
    path.join(__dirname, 'layout'),
    path.join(__dirname, 'templates'),
    path.join(__dirname, 'snippets'),
    path.join(__dirname, 'sections')
  ],
  extname: '.liquid'
});

// Register filters
registerLinkToModule(engine);
registerHtmlOutput(engine);
registerJavascriptInput(engine);

const buildTailwind = () => {
  return new Promise((resolve, reject) => {
    exec(
      'npx @tailwindcss/cli -i ./Ejercicios_etapa_3/hub/styles/tailwind.css -o ./Ejercicios_etapa_3/assets/tailwind.css --minify',
      (error, stdout, stderr) => {
        if (error) return reject(error);
        console.log(stdout || stderr);
        resolve();
      }
    );
  });
};

const buildModulePages = async () => {
  const modulesDir = path.join(__dirname, 'modules', 'general');
  const outputBase = path.resolve(__dirname, '../1_general');

  await fs.rm(outputBase, { recursive: true, force: true });
  await fs.mkdir(outputBase, { recursive: true });

  const files = glob.sync(`${modulesDir}/**/index.liquid`);

  for (const filepath of files) {
    const relativeModulePath = path.relative(modulesDir, path.dirname(filepath));
    const outputDir = path.join(outputBase, relativeModulePath);
    await fs.mkdir(outputDir, { recursive: true });

    const html = await engine.renderFile(filepath, {});
    const outputPath = path.join(outputDir, 'index.html');

    await fs.writeFile(outputPath, html, 'utf-8');
    console.log(`✅ Built ${outputPath}`);
  }
};

const buildRootIndex = async () => {
  const templatePath = path.join(__dirname, 'templates', 'index.liquid');
  const outputPath = path.resolve(__dirname, '../index.html');

  const html = await engine.renderFile(templatePath, {});
  await fs.writeFile(outputPath, html, 'utf-8');
  console.log(`✅ Built entrypoint: ${outputPath}`);
};

const run = async () => {
  await buildTailwind();
  await buildModulePages();
  await buildRootIndex();
  await copyJavaScriptFiles();
};

run().catch(console.error);
