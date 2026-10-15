import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

// Local-only preview of the generated files. No SPA fallback: invalid routes are 404.
const root = fileURLToPath(new URL('../.output/public/', import.meta.url))
const port = Number(process.env.PORT || 3103)
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.ico': 'image/x-icon' }
await stat(resolve(root, 'index.html'))
createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }).end(); return }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    const path = resolve(root, '.' + pathname)
    if (!(path + sep).startsWith(root) || pathname.includes('\0')) { res.writeHead(400).end(); return }
    let found
    for (const candidate of [path, resolve(path, 'index.html')]) {
      try { if ((await stat(candidate)).isFile()) { found = candidate; break } } catch { /* next candidate */ }
    }
    const target = found || resolve(root, '404.html')
    const body = await readFile(target)
    res.writeHead(found ? 200 : 404, {
      'Content-Type': `${mime[extname(target)] || 'application/octet-stream'}; charset=utf-8`,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    })
    res.end(req.method === 'HEAD' ? undefined : body)
  } catch { res.writeHead(400).end('Invalid request') }
}).listen(port, '127.0.0.1', () => console.log(`Static preview: http://127.0.0.1:${port}`))
