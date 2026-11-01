import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { data } from "../src/generated/site.js";
// These are source-application screenshots. Crops preserve original UI pixels.
const sources = "scripts/capture/sources";
const definitions = {
  "core-en": {
    source: "reporting.png",
    crop: { left: 0, top: 80, width: 1440, height: 1000 },
    layers: [
      { id: "toolbar", rect: [32, 16, 1376, 76] },
      { id: "tabs", rect: [32, 112, 1376, 40] },
      { id: "panel-a", rect: [32, 156, 678, 502] },
      { id: "panel-b", rect: [730, 156, 678, 502] },
      { id: "filters", rect: [32, 678, 1376, 64] },
      { id: "table", rect: [32, 758, 1376, 156] },
    ],
    detailA: [32, 156, 678, 502],
    detailB: [730, 156, 678, 502],
    micros: [
      [840, 382, 33, 136],
      [881, 351, 33, 167],
      [923, 320, 33, 198],
      [964, 289, 33, 229],
      [1006, 382, 33, 136],
      [1048, 351, 33, 167],
    ],
  },
  "middlemen-mdos": {
    source: "inventory.png",
    crop: { left: 220, top: 56, width: 1220, height: 888 },
    layers: [
      { id: "toolbar", rect: [24, 20, 1172, 60] },
      { id: "tabs", rect: [24, 90, 1172, 40] },
      { id: "filters", rect: [24, 138, 1172, 74] },
      { id: "table", rect: [24, 228, 1172, 110] },
      { id: "panel-a", rect: [24, 354, 578, 305] },
      { id: "panel-b", rect: [618, 354, 578, 159] },
      { id: "quality", rect: [618, 528, 578, 262] },
    ],
    detailA: [24, 354, 578, 305],
    detailB: [618, 354, 578, 159],
  },
};
for (const project of data.copy.projects) {
  const dir = `public/motion/${project.slug}/assets`;
  await mkdir(dir, { recursive: true });
  const definition = definitions[project.slug];
  if (!definition) {
    await sharp(`${sources}/${project.slug}/welcome.png`)
      .resize({ width: 680 })
      .webp({ quality: 90 })
      .toFile(`${dir}/main.webp`);
    await sharp(`${sources}/${project.slug}/recipe.png`)
      .resize({ width: 680 })
      .webp({ quality: 90 })
      .toFile(`${dir}/detail-a.webp`);
    await sharp(`${sources}/${project.slug}/recipe.png`)
      .extract({ left: 40, top: 550, width: 780, height: 1050 })
      .resize({ width: 680 })
      .webp({ quality: 90 })
      .toFile(`${dir}/detail-b.webp`);
    continue;
  }
  const main = await sharp(`${sources}/${project.slug}/${definition.source}`)
    .extract(definition.crop)
    .png()
    .toBuffer();
  await sharp(main).webp({ quality: 90 }).toFile(`${dir}/main.webp`);
  const crop = async (name, rect) =>
    sharp(main)
      .extract({ left: rect[0], top: rect[1], width: rect[2], height: rect[3] })
      .webp({ quality: 92 })
      .toFile(`${dir}/${name}.webp`);
  await crop("detail-a", definition.detailA);
  await crop("detail-b", definition.detailB);
  for (const layer of definition.layers) await crop(layer.id, layer.rect);
  for (const [i, rect] of (definition.micros || []).entries())
    await crop(`micro-${i}`, rect);
  if (project.slug === "middlemen-mdos") {
    await sharp(`${sources}/${project.slug}/mobile.png`)
      .extract({ left: 0, top: 330, width: 1206, height: 2292 })
      .resize({ width: 620 })
      .webp({ quality: 88 })
      .toFile(`${dir}/mobile.webp`);
    await sharp(`${sources}/${project.slug}/pipeline.png`)
      .extract({ left: 244, top: 390, width: 1172, height: 180 })
      .webp({ quality: 90 })
      .toFile(`${dir}/pipeline.webp`);
    for (let i = 0; i < 3; i++)
      await sharp(`${sources}/${project.slug}/pipeline.png`)
        .extract({ left: 244 + i * 198, top: 423, width: 179, height: 133 })
        .webp({ quality: 92 })
        .toFile(`${dir}/micro-${i}.webp`);
  }
  const manifest = {
    width: definition.crop.width,
    height: definition.crop.height,
    layers: definition.layers,
    micros: definition.micros || [],
    source: "Source application / demo data",
  };
  await writeFile(`${dir}/layers.json`, JSON.stringify(manifest, null, 2));
}
console.log(
  "Prepared real application screenshots and independently animated UI crops.",
);
