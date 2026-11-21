// A small static file server for game/ so the game can be played locally without a build
// step: `node serve.ts` (or `node serve.ts --port 9000`), then open http://localhost:8080.
import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('./game', import.meta.url)));
const flag = process.argv.indexOf('--port');
const port = flag === -1 ? 8080 : Number(process.argv[flag + 1]) || 8080;

const types: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

createServer((request, response) => {
  const path = decodeURIComponent((request.url ?? '/').split('?')[0]);
  const target = resolve(join(root, normalize(path === '/' ? '/index.html' : path)));
  const inside = target === root || target.startsWith(root + sep);
  let size = -1;
  try {
    const info = statSync(target);
    if (info.isFile()) size = info.size;
  } catch {
    size = -1;
  }
  if (!inside || size < 0) {
    response.writeHead(404, { 'content-type': 'text/plain' });
    response.end('not found');
    return;
  }
  response.writeHead(200, { 'content-type': types[extname(target)] ?? 'application/octet-stream', 'content-length': size, 'cache-control': 'no-store' });
  createReadStream(target).pipe(response);
}).listen(port, () => console.log(`Forger's Eye: http://localhost:${port}`));
