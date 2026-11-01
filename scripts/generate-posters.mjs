import sharp from "sharp";
import { data } from "../src/generated/site.js";
const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
for (const p of data.copy.projects) {
  const dir = `public/motion/${p.slug}/assets`;
  const main = await sharp(`${dir}/main.webp`).toBuffer();
  const screen = await sharp(main)
    .resize({
      width: p.type === "own" ? 300 : 950,
      height: p.type === "own" ? 650 : undefined,
      fit: "contain",
    })
    .png()
    .toBuffer();
  for (const theme of ["dark", "light"]) {
    const light = theme === "light",
      suffix = light ? "-light" : "";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900"><rect width="1440" height="900" fill="${light ? "#edf0f6" : "#0c111b"}"/><text x="90" y="78" font-family="sans-serif" font-size="26" fill="${light ? "#202b40" : "#f3f1eb"}">${esc(p.name)}</text><text x="1350" y="80" text-anchor="end" font-family="sans-serif" font-size="23" fill="${light ? "#805b2e" : "#d9b98f"}">REAL APPLICATION · DEMO DATA</text><path d="M90 832H1350" stroke="${light ? "#c7cfdd" : "#ffffff22"}"/><text x="90" y="876" font-family="sans-serif" font-size="23" fill="${light ? "#526079" : "#b5bdcc"}">${esc(data.copy.common.captureDisclaimer)}</text></svg>`;
    const poster = await sharp(Buffer.from(svg))
      .composite([
        { input: screen, left: p.type === "own" ? 570 : 245, top: 120 },
      ])
      .png()
      .toBuffer();
    await sharp(poster)
      .webp({ quality: 88 })
      .toFile(`${dir}/poster${suffix}.webp`);
    await sharp(poster)
      .resize({ width: 720 })
      .webp({ quality: 85 })
      .toFile(`${dir}/poster-small${suffix}.webp`);
  }
}
