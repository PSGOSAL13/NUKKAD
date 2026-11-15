/**
 * Preview the production build locally, the way a CDN serves it:
 * gzip, the security + caching rules from public/_headers, and the 404 page.
 *
 *   npm run build && npm run preview        →  http://127.0.0.1:4173
 *
 * Also used by the end-to-end tests (tests/e2e.mjs).
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import zlib from "node:zlib";

const root = path.resolve(process.argv[2] ?? path.join(import.meta.dirname, "..", "out"));
const port = Number(process.argv[3] ?? process.env.PORT ?? 4173);
if (!fs.existsSync(path.join(root, "index.html"))) {
  console.error(`No build found in ${root}. Run "npm run build" first.`);
  process.exit(1);
}

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".glb": "model/gltf-binary",
};
const compressible = /\.(html|js|css|svg|json|txt|xml)$/;

// Apply _headers like Cloudflare Pages / Netlify (later, more specific rules override earlier ones).
const rules = [];
const headersFile = path.join(root, "_headers");
if (fs.existsSync(headersFile)) {
  let current = null;
  for (const line of fs.readFileSync(headersFile, "utf8").split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    if (!/^\s/.test(line)) {
      const pattern = line
        .trim()
        .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
        .replace(/\*/g, ".*");
      rules.push((current = { re: new RegExp(`^${pattern}$`), headers: {} }));
    } else if (current) {
      const i = line.indexOf(":");
      current.headers[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim();
    }
  }
}
const headersFor = (p) => Object.assign({}, ...rules.filter((r) => r.re.test(p)).map((r) => r.headers));

http
  .createServer((req, res) => {
    const p = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    let file = path.join(root, p);
    if (!file.startsWith(root)) {
      res.writeHead(403);
      return res.end();
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    let status = 200;
    if (!fs.existsSync(file)) {
      status = 404;
      file = path.join(root, "404.html");
    }
    const headers = {
      "content-type": types[path.extname(file)] ?? "application/octet-stream",
      ...headersFor(p),
    };
    // Plain http locally: drop directives that only make sense over https.
    if (headers["content-security-policy"]) {
      headers["content-security-policy"] = headers["content-security-policy"].replace(
        "; upgrade-insecure-requests",
        "",
      );
    }
    delete headers["strict-transport-security"];
    let body = fs.readFileSync(file);
    if (compressible.test(file) && /gzip/.test(req.headers["accept-encoding"] ?? "")) {
      body = zlib.gzipSync(body);
      headers["content-encoding"] = "gzip";
    }
    res.writeHead(status, headers);
    res.end(body);
  })
  .listen(port, "127.0.0.1", () => console.log(`Previewing ${root} on http://127.0.0.1:${port}`));
