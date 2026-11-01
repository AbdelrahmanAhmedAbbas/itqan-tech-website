import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { gzip } from "node:zlib";
import { promisify } from "node:util";

const compress = promisify(gzip);
const compressed = new Map();

const root = resolve("dist");
const port = Number(process.env.PORT || 4173);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain",
};
const redirects = {
  "/start": "/",
  "/services": "/#services",
  "/work": "/#work",
  "/how-we-work": "/#pricing",
  "/about": "/",
  "/contact": "/#loom-request",
  "/case-study/middlemen-mdos": "/work/middlemen-mdos",
  "/case-study/core-en": "/work/core-en",
  "/case-study/wasfa": "/work/wasfa",
};
createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://localhost");
    const pathname = decodeURIComponent(url.pathname);
    const state = JSON.parse(
      await readFile(resolve(root, "site-state.json"), "utf8"),
    );
    if (
      (pathname === "/work/wasfa" && !state.optionalProduct) ||
      pathname === "/case-study/wasfa"
    ) {
      response.writeHead(301, {
        Location: state.optionalProduct ? "/work/wasfa" : "/#work",
      });
      response.end();
      return;
    }
    if (pathname === "/api/visitor") {
      const { default: handler } = await import("../api/visitor.js");
      response.status = (c) => {
        response.statusCode = c;
        return response;
      };
      response.json = (d) => response.end(JSON.stringify(d));
      response.setHeader("Content-Type", "application/json");
      return handler(request, response);
    }
    if (pathname === "/api/loom-audit") {
      let raw = "";
      for await (const chunk of request) {
        raw += chunk;
        if (raw.length > 10000) {
          response.writeHead(413);
          response.end();
          return;
        }
      }
      request.body = raw;
      response.status = (c) => {
        response.statusCode = c;
        return response;
      };
      response.json = (d) => response.end(JSON.stringify(d));
      response.setHeader("Content-Type", "application/json");
      const { default: handler } = await import("../api/loom-audit.js");
      return handler(request, response);
    }
    if (redirects[pathname]) {
      const target = new URL(redirects[pathname], "http://localhost");
      response.writeHead(301, {
        Location: target.pathname + url.search + target.hash,
      });
      response.end();
      return;
    }
    let file = resolve(root, "." + pathname);
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403);
      response.end();
      return;
    }
    try {
      const info = await stat(file);
      if (info.isDirectory()) file = resolve(file, "index.html");
      await stat(file);
    } catch {
      file = resolve(root, "404.html");
      response.statusCode = 404;
    }
    response.setHeader(
      "Content-Type",
      mime[extname(file)] || "application/octet-stream",
    );
    response.setHeader("Cache-Control", "no-cache");
    const body = await readFile(file);
    // Match a normal static host's compressed text responses in local reviews.
    response.setHeader("Vary", "Accept-Encoding");
    if (
      /\.(html|js|css|svg|xml|json|txt)$/.test(file) &&
      /\bgzip\b/.test(request.headers["accept-encoding"] || "")
    ) {
      const info = await stat(file);
      const key = `${file}:${info.mtimeMs}`;
      let payload = compressed.get(key);
      if (!payload) {
        payload = await compress(body);
        compressed.set(key, payload);
      }
      response.setHeader("Content-Encoding", "gzip");
      response.end(payload);
    } else response.end(body);
  } catch {
    response.writeHead(400);
    response.end("Bad request");
  }
}).listen(port, "127.0.0.1", () =>
  console.log(`Local built-site review: http://127.0.0.1:${port}`),
);
