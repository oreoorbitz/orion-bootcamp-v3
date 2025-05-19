import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import livereload from 'livereload';
import connectLivereload from 'connect-livereload';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

const generalOutputPath = path.resolve(__dirname, './../1_general');
const assetsOutputPath = path.resolve(__dirname, './../assets');
const rootIndexPath = path.resolve(__dirname, './../index.html');

// Live reload watcher
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

app.use(connectLivereload());

app.use('/assets', express.static(assetsOutputPath));
app.use('/1_general', express.static(generalOutputPath));

app.get('/', (req, res) => {
  res.sendFile(rootIndexPath);
});

app.listen(port, () => {
  console.log(`Dev server running at http://localhost:${port}`);
});
