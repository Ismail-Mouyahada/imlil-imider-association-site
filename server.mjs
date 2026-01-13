import { serve } from 'bun';
import { readFileSync } from 'fs';
import { join } from 'path';

const port = parseInt(process.env.PORT || '8080', 10);
const distDir = './dist';

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

serve({
  port,
  hostname: '0.0.0.0',
  fetch(req) {
    let { pathname } = new URL(req.url);
    
    // Remove leading slash
    if (pathname === '/') {
      pathname = '/index.html';
    }

    const filePath = join(distDir, pathname);
    
    try {
      const file = readFileSync(filePath);
      const ext = pathname.substring(pathname.lastIndexOf('.'));
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      
      return new Response(file, {
        headers: { 'Content-Type': contentType },
      });
    } catch (err) {
      // Try serving index.html for SPA routing
      try {
        const file = readFileSync(join(distDir, 'index.html'));
        return new Response(file, {
          headers: { 'Content-Type': 'text/html' },
        });
      } catch {
        return new Response('Not Found', { status: 404 });
      }
    }
  },
});

console.log(`🚀 Server running at http://0.0.0.0:${port}`);
