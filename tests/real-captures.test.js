import test from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
for (const [slug, file, crop] of [
  ["core-en", "reporting.png", { left: 0, top: 80, width: 1440, height: 1000 }],
  [
    "middlemen-mdos",
    "inventory.png",
    { left: 220, top: 56, width: 1220, height: 888 },
  ],
])
  test(`${slug} public screen preserves actual source-application pixels`, async () => {
    const source = await sharp(`scripts/capture/sources/${slug}/${file}`)
      .extract(crop)
      .resize(360)
      .removeAlpha()
      .raw()
      .toBuffer();
    const published = await sharp(`public/motion/${slug}/assets/main.webp`)
      .resize(360)
      .removeAlpha()
      .raw()
      .toBuffer();
    assert.equal(source.length, published.length);
    const error =
      source.reduce(
        (sum, value, i) => sum + Math.abs(value - published[i]),
        0,
      ) / source.length;
    assert(
      error < 4,
      `Screenshot diverges from source (${error.toFixed(2)} average error)`,
    );
  });
