import registerLinkToModule from './filters/link_to_module.js';
import registerHtmlOutput from './tags/htmlOutput.js';
import registerJavascriptInput from './tags/javascriptInput.js';
import registerHtmlInput from './tags/htmlInput.js';

import { Liquid } from 'liquidjs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import glob from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── PATHS (all absolute, no reliance on CWD) ────────────────────────────────
const hubDir = __dirname;                                // .../Ejercicios_etapa_3/hub
const projectRoot = path.resolve(hubDir, '..');          // .../Ejercicios_etapa_3
const assetsDir = path.resolve(projectRoot, 'assets');   // .../Ejercicios_etapa_3/assets
const generalOutDir = path.resolve(projectRoot, '1_general');
const rootIndexHtml = path.resolve(projectRoot, 'index.html');

const tailwindInput = path.resolve(hubDir, 'styles', 'tailwind.css');
const tailwindOutput = path.resolve(assetsDir, 'tailwind.css');

// ── Utilities ───────────────────────────────────────────────────────────────
const ensureDir = async (dir) => fs.mkdir(dir, { recursive: true });

const copyJavaScriptFiles = async () => {
  const sourceDir = path.join(hubDir, 'public', 'javascript');
  await ensureDir(assetsDir);

  try {
    const files = await fs.readdir(sourceDir);
    for (const file of files) {
      if (!file.endsWith('.js')) continue;
      const srcPath = path.join(sourceDir, file);
      const destPath = path.join(assetsDir, file);
      await fs.copyFile(srcPath, destPath);
      console.log(`📦 Copied JS: ${file}`);
    }
  } catch {
    console.warn('⚠️ No JavaScript files to copy or source folder missing.');
  }
};

// Liquid engine
const engine = new Liquid({
  root: [
    path.join(hubDir, 'layout'),
    path.join(hubDir, 'templates'),
    path.join(hubDir, 'snippets'),
    path.join(hubDir, 'sections'),
  ],
  extname: '.liquid',
});

// Register filters/tags
registerLinkToModule(engine);
registerHtmlOutput(engine);
registerJavascriptInput(engine);
registerHtmlInput(engine);

// ── Tailwind: spawn npx with pinned CWD + absolute IO paths ────────────────
const buildTailwind = () =>
  new Promise((resolve, reject) => {
    const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

    const child = spawn(
      npx,
      [
        // if you use @tailwindcss/cli keep it; otherwise prefer "tailwindcss"
        'tailwindcss',
        '-i', tailwindInput,
        '-o', tailwindOutput,
        '--minify',
      ],
      {
        stdio: 'inherit',
        cwd: projectRoot, // where node_modules lives
      }
    );

    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`tailwindcss exited with code ${code}`));
    });
  });

// ── Build module pages (absolute everywhere) ────────────────────────────────
const buildModulePages = async () => {
  const modulesDir = path.join(hubDir, 'modules', 'general');
  await fs.rm(generalOutDir, { recursive: true, force: true });
  await ensureDir(generalOutDir);

  const files = glob.sync(`${modulesDir}/**/index.liquid`, { nodir: true });

  for (const filepath of files) {
    const relativeModulePath = path.relative(modulesDir, path.dirname(filepath));
    const outputDir = path.join(generalOutDir, relativeModulePath);
    await ensureDir(outputDir);

    // liquidjs accepts absolute paths; this keeps it simple
    const html = await engine.renderFile(filepath, {});
    const outputPath = path.join(outputDir, 'index.html');
    await fs.writeFile(outputPath, html, 'utf-8');
    console.log(`✅ Built ${outputPath}`);
  }
};

// ── Build root index (absolute) ────────────────────────────────────────────
const buildRootIndex = async () => {
  const templatePath = path.join(hubDir, 'templates', 'index.liquid');
  const html = await engine.renderFile(templatePath, {});
  await fs.writeFile(rootIndexHtml, html, 'utf-8');
  console.log(`✅ Built entrypoint: ${rootIndexHtml}`);
};

// ── Orchestrate ────────────────────────────────────────────────────────────
const run = async () => {
  await ensureDir(assetsDir);
  await buildTailwind();
  await buildModulePages();
  await buildRootIndex();
  await copyJavaScriptFiles();
};

run().catch((err) => {
  console.error('❌ Build failed:', err?.stack || err);
  process.exitCode = 1;
});
