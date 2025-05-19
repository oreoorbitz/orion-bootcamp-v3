import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import livereload from 'livereload';
import connectLivereload from 'connect-livereload';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Setup live reload
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'dist'));

liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});

app.use(connectLivereload());

// Serve static assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'dist')));

// Redirect root to index.html explicitly
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Dev server running at http://localhost:${port}`);
});
