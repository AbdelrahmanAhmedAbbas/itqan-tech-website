import sharp from "sharp";
import { readFile, mkdir } from "node:fs/promises";
import { siteConfig } from "../src/site.config.ts";
await mkdir("public", { recursive: true });
const c = JSON.parse(await readFile("src/i18n/en.json", "utf8"));
const escapeXml = (text) =>
  text.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
  })[char]);
const headline = c.hero.headlines[siteConfig.hero.variant] || c.hero.headlines[0];
const lines = headline.split(" ").reduce((result, word) => {
  const last = result.length - 1;
  if (last < 0 || result[last].length + word.length + 1 > 34) result.push(word);
  else result[last] += " " + word;
  return result;
}, []);
const headlineSvg = lines.map((line, index) =>
  `<text x="78" y="${280 + index * 75}">${escapeXml(line)}</text>`,
).join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#09090b"/><path d="M70 130H1130M70 535H1130" stroke="#303038"/><g fill="#185adb"><path d="M78 58h15v15H78zM98 58h15v15H98zM78 78h15v15H78z"/></g><text x="132" y="86" fill="#fafafa" font-family="sans-serif" font-size="24">ITQAN TECH</text><text x="78" y="185" fill="#d9b98f" font-family="monospace" font-size="17">${escapeXml(c.hero.eyebrow)}</text><g fill="#fafafa" font-family="sans-serif" font-size="56" letter-spacing="-2">${headlineSvg}</g><text x="78" y="490" fill="#b1b1bd" font-family="sans-serif" font-size="22">${c.common.primary}</text><text x="78" y="580" fill="#d9b98f" font-family="monospace" font-size="17">BLUEPRINT → BUILD → CARE</text></svg>`;
await sharp(Buffer.from(svg)).png().toFile("public/og-image.png");
for (const size of [32, 192, 180])
  await sharp("public/favicon.svg")
    .resize(size, size)
    .png()
    .toFile(
      size === 180
        ? "public/apple-touch-icon.png"
        : `public/favicon-${size}.png`,
    );
