import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import livereload from 'livereload';
import connectLivereload from 'connect-livereload';
import chokidar from 'chokidar';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

const generalOutputPath = path.resolve(__dirname, './../1_general');
const assetsOutputPath = path.resolve(__dirname, './../assets');
const rootIndexPath = path.resolve(__dirname, './../index.html');

// Start live reload server
const liveReloadServer = livereload.createServer();
liveReloadServer.watch([
  generalOutputPath,
  assetsOutputPath,
  rootIndexPath
]);

liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});

// Auto-build on liquid file changes
const watchPaths = [
  path.join(__dirname, 'templates'),
  path.join(__dirname, 'layout'),
  path.join(__dirname, 'sections'),
  path.join(__dirname, 'snippets'),
  path.join(__dirname, 'modules'),
  path.join(__dirname, 'javascript'),
  path.join(__dirname, 'elements'),
  path.join(__dirname, 'tags_html'),
];

chokidar.watch(watchPaths, {
  persistent: true,
  ignoreInitial: true,
  usePolling: true
}).on('all', (event, filePath) => {
  if (filePath.endsWith('.liquid') || filePath.endsWith('.js')) {
    console.log(`🔄 Change detected in ${filePath}, rebuilding...`);
    exec('node Ejercicios_etapa_3/hub/build.js', (err, stdout, stderr) => {
      if (err) {
        console.error('❌ Build error:', stderr);
      } else {
        console.log('✅ Build complete');
      }
    });
  }
});

app.use(connectLivereload());

app.use('/assets', express.static(assetsOutputPath));
app.use('/1_general', express.static(generalOutputPath));

app.get('/', (req, res) => {
  res.sendFile(rootIndexPath);
});

app.listen(port, () => {
  console.log(`Dev server running at http://localhost:${port}`);
});
