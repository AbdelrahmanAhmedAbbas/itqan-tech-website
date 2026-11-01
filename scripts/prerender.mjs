import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
const out = process.env.SITE_OUT_DIR || "dist";
const { render, getMetadata, pagePaths, siteConfig } = await import(
  pathToFileURL(resolve(out + "-ssr/entry-server.js")).href
);

// Ship playable compositions without unused artwork or local authoring metadata.

for (const slug of ["core-en", "middlemen-mdos", "wasfa"]) {
  for (const file of [
    ".hyperframes",
    ".thumbnails",
    "AGENTS.md",
    "CLAUDE.md",
    "hyperframes.json",
    "hyperframes.lock.json",
    "meta.json",
    "package.json",
  ]) {
    await rm(join(join(out, "motion"), slug, file), {
      recursive: true,
      force: true,
    });
  }
}

const selected = new Set(pagePaths.map((p) => p.split("/").pop()));
for (const slug of ["core-en", "middlemen-mdos", "wasfa"])
  if (!selected.has(slug))
    await rm(join(join(out, "motion"), slug), { recursive: true, force: true });
await writeFile(
  join(out, "site-state.json"),
  JSON.stringify({
    optionalProduct: pagePaths.some((p) => p.endsWith("/was" + "fa")),
  }),
);
const template = await readFile(join(out, "index.html"), "utf8");
const escape = (text) =>
  String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
for (const route of [...pagePaths, "/404"]) {
  const metadata = getMetadata(route);
  const head = `<title>${escape(metadata.title)}</title>
    <meta name="description" content="${escape(metadata.description)}" />
    <meta name="robots" content="${metadata.noindex ? "noindex, follow" : "index, follow"}" />
    <link rel="canonical" href="${escape(metadata.url)}" />
    <meta property="og:type" content="${route.startsWith("/work/") ? "article" : "website"}" />
    <meta property="og:site_name" content="Itqan Tech" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:url" content="${escape(metadata.url)}" />
    <meta property="og:title" content="${escape(metadata.title)}" />
    <meta property="og:description" content="${escape(metadata.description)}" />
    <meta property="og:image" content="${escape(metadata.image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(metadata.title)}" />
    <meta name="twitter:description" content="${escape(metadata.description)}" />
    <meta name="twitter:image" content="${escape(metadata.image)}" />
    <script type="application/ld+json" id="site-schema">${JSON.stringify(metadata.structuredData).replaceAll("<", "\\u003c")}</script>`;
  const html = template
    .replace("<!--head-tags-->", head)
    .replace("<!--app-html-->", render(route));
  const file =
    route === "/404"
      ? join(out, "404.html")
      : route === "/"
        ? join(out, "index.html")
        : join(out, route, "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}
const domain = siteConfig.domain.replace(/\/$/, "");
const sitemapPaths = pagePaths.filter(
  (path) => !["/privacy", "/terms"].includes(path),
);
await writeFile(
  join(out, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPaths.map((path) => `  <url><loc>${escape(domain + (path === "/" ? "/" : path))}</loc></url>`).join("\n")}\n</urlset>\n`,
);
await writeFile(
  join(out, "robots.txt"),
  `User-agent: *\nAllow: /\nSitemap: ${domain}/sitemap.xml\n`,
);
console.log(
  `Pre-rendered ${pagePaths.length} pages and a custom 404. SEO domain: ${domain}`,
);
