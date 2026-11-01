import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { data as site } from "../src/generated/site.js";
const duration = 12;
const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll('"', "&quot;");
await mkdir("public/motion", { recursive: true });
await copyFile(
  "node_modules/@hyperframes/core/dist/hyperframe.runtime.iife.js",
  "public/motion/runtime.js",
);
for (const project of site.copy.projects) {
  const dir = `public/motion/${project.slug}`;
  await mkdir(`${dir}/compositions`, { recursive: true });
  await copyFile("public/fonts/inter-400.woff2", `${dir}/assets/inter.woff2`);
  await copyFile(
    "node_modules/gsap/dist/gsap.min.js",
    `${dir}/assets/gsap.min.js`,
  );
  if (project.type === "own") {
    await ownProductScene(dir, project);
    continue;
  }
  const manifest = JSON.parse(
    await readFile(`${dir}/assets/layers.json`, "utf8"),
  );
  const mdos = project.slug === "middlemen-mdos";
  const scale = 950 / manifest.width,
    origin = { x: 245, y: 120 };
  const destinations = mdos
    ? {
        toolbar: [130, 125, 1180, -2],
        tabs: [140, 215, 1140, 1],
        filters: [150, 285, 1090, -1],
        table: [165, 395, 1060, 1],
        "panel-a": [105, 530, 565, -4],
        "panel-b": [780, 535, 550, 4],
        quality: [790, 700, 420, 3],
      }
    : {
        toolbar: [140, 130, 1160, -2],
        tabs: [140, 225, 1120, 1],
        "panel-a": [100, 295, 545, -5],
        "panel-b": [800, 270, 545, 5],
        filters: [170, 655, 1060, -1],
        table: [220, 735, 1000, 2],
      };
  const layers = manifest.layers.map((layer) => {
    const [left, top, width, height] = layer.rect,
      [x, y, w, rotation] = destinations[layer.id];
    return {
      ...layer,
      width: width * scale,
      height: height * scale,
      start: { x: origin.x + left * scale, y: origin.y + top * scale },
      end: {
        x,
        y,
        scale: w / (width * scale),
        rotation,
        rotationY: x < 720 ? 8 : -8,
        rotationX: 3,
        z: 50,
        opacity: 1,
      },
    };
  });
  const image = (id, file, style, extra = "") =>
    `<div id="${id}" class="ui-piece" style="${style}" data-layout-allow-overflow ${extra}><img src="assets/${file}.webp" alt="${esc(project.name)} application screenshot, demo data" data-var-src="${id}-source"></div>`;
  const bars = !mdos
    ? `<div class="bar-mask" id="bar-mask">${manifest.micros.map((r, i) => `<img class="micro-bar" id="micro-${i}" src="assets/micro-${i}.webp" alt="" style="left:${r[0] - 730 - 109}px;top:${r[1] - 156 - 112}px;width:${r[2]}px;height:${r[3]}px">`).join("")}</div>`
    : "";
  let markup = image(
    "capture-main",
    "main",
    `left:0;top:0;width:950px;height:${manifest.height * scale}px;border-radius:10px;`,
  );
  markup += layers
    .map((l) =>
      image(
        l.id,
        l.id,
        `left:0;top:0;width:${l.width}px;height:${l.height}px;`,
        l.id === "panel-b" && !mdos ? "data-layout-allow-overlap" : "",
      ).replace(
        "</div>",
        l.id === "panel-b" && !mdos ? `${bars}</div>` : "</div>",
      ),
    )
    .join("");
  if (mdos) {
    markup += image(
      "pipeline",
      "pipeline",
      "left:0;top:0;width:950px;height:146px;",
    );
    markup += Array.from({ length: 3 }, (_, i) =>
      image(
        `micro-${i}`,
        `micro-${i}`,
        "left:0;top:0;width:245px;height:182px;",
      ),
    ).join("");
    markup += image(
      "mobile",
      "mobile",
      "left:0;top:0;width:220px;height:418px;border:5px solid #182333;border-radius:28px;",
    );
  }
  let animation = `
 tl.fromTo('#capture-main',{x:245,y:120,scale:1,rotation:0,rotationY:0,opacity:1},{x:245,y:120,scale:1,rotation:0,rotationY:0,opacity:1,duration:.01},0);
 tl.fromTo('#camera',{x:0,y:0,scale:1,rotationY:0},{x:-12,y:8,scale:1.045,rotationY:-3,duration:1.3,ease:'power2.inOut'},0);
 tl.to('#capture-main',{opacity:.08,scale:.94,rotationY:6,duration:.8,ease:'power3.out'},1.35);
 tl.to('#camera',{x:0,y:0,scale:.96,rotationY:0,duration:1.4,ease:'power3.inOut'},1.35);
 `;
  layers.forEach((l, i) => {
    animation += `tl.fromTo('#${l.id}',${JSON.stringify({ ...l.start, scale: 1, rotation: 0, rotationX: 0, rotationY: 0, z: 0, opacity: 0 })},${JSON.stringify({ ...l.end, duration: 1.6, delay: 0, ease: "power4.out" })},${1.4 + i * 0.09});\n`;
  });
  const a = layers.find((l) => l.id === "panel-a"),
    b = layers.find((l) => l.id === "panel-b");
  animation += `tl.to(['#toolbar','#tabs','#filters','#table'${mdos ? ",'#quality'" : ""}],{opacity:.08,z:0,duration:.6},3.6);
 tl.to('#panel-a',{x:105,y:230,scale:${610 / a.width},rotation:0,rotationY:0,rotationX:0,z:0,duration:1.2,ease:'power3.inOut'},3.65);
 tl.to('#panel-b',{x:755,y:230,scale:${610 / b.width},rotation:0,rotationY:0,rotationX:0,z:0,duration:1.2,ease:'power3.inOut'},3.8);
 `;
  if (!mdos) {
    // These are exact screenshot bar crops, moving above their original chart region.
    animation += `tl.fromTo('#bar-mask',{opacity:0},{opacity:1,duration:.1},4.7);
  tl.fromTo('.micro-bar',{scaleY:0,transformOrigin:'50% 100%'},{scaleY:1,duration:1.3,stagger:.12,ease:'power3.out'},4.8);
  tl.to('#panel-a',{x:125,y:235,rotation:-3,scale:${650 / a.width},duration:1.3,ease:'power2.inOut'},6.7);
  tl.to('#panel-b',{x:800,y:275,rotation:3,scale:${540 / b.width},duration:1.3,ease:'power2.inOut'},6.7);
  tl.to('#table',{x:220,y:700,opacity:1,scale:${1000 / layers.find((l) => l.id === "table").width},rotation:0,rotationY:0,rotationX:0,duration:1.2,ease:'power3.out'},6.8);
  tl.to('#bar-mask',{opacity:0,duration:.3},8.7);`;
  } else {
    animation += `tl.to('#panel-a',{x:105,y:230,scale:${620 / a.width},rotation:-3,duration:1.2,ease:'power3.inOut'},5.8);
  tl.to('#panel-b',{x:775,y:190,scale:${530 / b.width},rotation:2,opacity:.5,duration:1.2},5.8);
  tl.fromTo('#pipeline',{x:160,y:610,opacity:0,scale:.85,rotationY:-8},{x:130,y:630,opacity:.2,scale:1,rotationY:0,duration:1,ease:'power3.out'},5.9);
  `;
    for (let i = 0; i < 3; i++)
      animation += `tl.fromTo('#micro-${i}',{x:${130 + i * 165},y:660,scale:.66,opacity:0,rotation:0},{x:${130 + i * 280},y:${585 - i * 22},scale:1,opacity:1,rotation:${-4 + i * 3},duration:1.3,ease:'power4.out'},${6 + i * 0.15});\n`;
    animation += `tl.fromTo('#mobile',{x:1250,y:500,opacity:0,rotation:12,scale:.68},{x:1090,y:300,opacity:1,rotation:-5,scale:1,duration:1.5,ease:'power4.out'},6.35);
  tl.to('#mobile',{y:270,rotation:0,duration:1.2,ease:'power2.inOut'},8);`;
  }
  layers.forEach(
    (l, i) =>
      (animation += `tl.to('#${l.id}',${JSON.stringify({ ...l.start, scale: 1, rotation: 0, rotationX: 0, rotationY: 0, z: 0, opacity: 0, duration: 1.35, ease: "power3.inOut" })},${9.5 + i * 0.025});\n`),
  );
  animation += `tl.to('#capture-main',{x:245,y:120,scale:1,rotation:0,rotationY:0,opacity:1,duration:1.35,ease:'power3.inOut'},9.7);
 tl.to('#camera',{x:0,y:0,scale:1,rotationY:0,duration:1.2,ease:'power3.inOut'},9.7);
 ${mdos ? "tl.to(['#pipeline','#micro-0','#micro-1','#micro-2','#mobile'],{opacity:0,y:700,scale:.8,duration:1.1,ease:'power3.inOut'},9.3);" : ""}
 tl.fromTo('#scene-progress',{scaleX:0},{scaleX:1,duration:12,ease:'none'},0);`;
  for (const theme of ["dark"]) {
    const light = theme === "light",
      file = light ? "light" : "index",
      scene = light ? "scene-light" : "scene";
    const bg = light ? "#edf0f6" : "#0c111b",
      fg = light ? "#202b40" : "#f3f1eb",
      accent = light ? "#805b2e" : "#d9b98f";
    await writeFile(
      `${dir}/${file}.html`,
      `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=1440, height=900"><title>${esc(project.name)} — real application walkthrough</title><script src="assets/gsap.min.js"></script><style>html,body{margin:0;width:1440px;height:900px;overflow:hidden;background:${bg}}#main{position:relative;width:1440px;height:900px;overflow:hidden}.clip{position:absolute;inset:0}</style></head><body><div id="main" data-composition-id="main" data-width="1440" data-height="900" data-duration="${duration}"><div id="screenshot-scene" class="clip" data-composition-id="screenshot-scene" data-composition-src="compositions/${scene}.html" data-start="0" data-duration="${duration}" data-width="1440" data-height="900" data-track-index="0" data-track-kind="graphics"></div></div><script>window.__timelines=window.__timelines||{};window.__timelines.main=gsap.timeline({paused:true}).to({hold:0},{hold:1,duration:${duration}});</script></body></html>`,
    );
    await writeFile(
      `${dir}/compositions/${scene}.html`,
      `<!doctype html><html lang="en"><body><template><style>
  @font-face{font-family:CaptureInter;src:url('assets/inter.woff2') format('woff2');font-weight:400;font-display:swap}
  *{box-sizing:border-box}#root{position:absolute;inset:0;overflow:hidden;background:var(--film-bg,${bg});color:var(--film-fg,${fg});font-family:CaptureInter,sans-serif}
  .grid{position:absolute;inset:0;background-image:linear-gradient(${light ? "#36496a09" : "#ffffff05"} 1px,transparent 1px),linear-gradient(90deg,${light ? "#36496a09" : "#ffffff05"} 1px,transparent 1px);background-size:60px 60px}
  .heading{position:absolute;left:90px;top:48px;font-size:26px;z-index:5}.tag{position:absolute;right:90px;top:54px;font-size:23px;color:var(--film-accent,${accent});z-index:5}
  .camera-window{position:absolute;inset:100px 55px 90px;overflow:hidden;perspective:1800px}#camera{position:absolute;left:-55px;top:-100px;width:1440px;height:900px;transform-origin:50% 50%;transform-style:preserve-3d}
  .ui-piece{position:absolute;overflow:hidden;border:1px solid ${light ? "#b7c2d4" : "#ffffff38"};border-radius:8px;background:#fff;box-shadow:0 20px 55px ${light ? "#253b6023" : "#0007"};transform-origin:0 0}.ui-piece>img{display:block;width:100%;height:100%;object-fit:fill}
  .bar-mask{position:absolute;left:${109 * scale}px;top:${112 * scale}px;width:${252 * scale}px;height:${252 * scale}px;background:#fff;opacity:0;overflow:hidden;transform-origin:0 0}
  .bar-mask .micro-bar{position:absolute;object-fit:fill;max-width:none}
  #panel-b .bar-mask{left:${109 * scale}px;top:${112 * scale}px; width:${252 * scale}px;height:${252 * scale}px}
  ${manifest.micros.map((r, i) => `#micro-${i}{left:${(r[0] - 730 - 109) * scale}px!important;top:${(r[1] - 156 - 112) * scale}px!important;width:${r[2] * scale}px!important;height:${r[3] * scale}px!important;}`).join("")}
  .foot{position:absolute;left:90px;bottom:24px;font-size:23px;color:var(--film-muted,${light ? "#526079" : "#b5bdcc"});z-index:5}.rule{position:absolute;bottom:68px;left:90px;width:1260px;height:2px;background:${light ? "#c7cfdd" : "#ffffff18"}}.rule span{display:block;height:100%;background:var(--film-accent,${accent});transform-origin:left center}
  </style><div id="root" data-composition-id="screenshot-scene" data-width="1440" data-height="900" data-duration="${duration}" data-layout-allow-overlap><div class="grid" aria-hidden="true"></div><div class="heading" data-var-text="project-label">${esc(project.name)}</div><div class="tag">REAL APPLICATION · DEMO DATA</div><div class="camera-window" data-layout-allow-overflow><div id="camera" data-layout-allow-overlap data-layout-allow-overflow>${markup}</div></div><div class="rule"><span id="scene-progress"></span></div><div class="foot">${esc(site.copy.common.captureDisclaimer)}</div></div><script>(()=>{const tl=gsap.timeline({paused:true});${animation}window.__timelines=window.__timelines||{};window.__timelines['screenshot-scene']=tl;})();</script></template></body></html>`,
    );
  }
}
console.log(
  "Generated 12-second real-application HyperFrames: exploded panels, chart bars, pipeline cards and camera moves, in both themes.",
);

async function ownProductScene(dir, project) {
  await writeFile(
    `${dir}/index.html`,
    `<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>${esc(project.name)}</title><script src="assets/gsap.min.js"></script><style>html,body{margin:0;width:1440px;height:900px;overflow:hidden;background:#0c111b}.clip{position:absolute;inset:0}#main{position:relative;width:1440px;height:900px}</style></head><body><div id="main" data-composition-id="main" data-width="1440" data-height="900" data-duration="12"><div id="screenshot-scene" class="clip" data-composition-id="screenshot-scene" data-composition-src="compositions/scene.html" data-start="0" data-duration="12" data-width="1440" data-height="900" data-track-index="0" data-track-kind="graphics"></div></div><script>window.__timelines=window.__timelines||{};window.__timelines.main=gsap.timeline({paused:true}).to({hold:0},{hold:1,duration:12});</script></body></html>`,
  );
  const markup = [
    ["capture-main", "main", 200],
    ["panel-a", "detail-a", 570],
    ["panel-b", "detail-b", 940],
  ]
    .map(
      ([id, file, x]) =>
        `<div id="${id}" class="phone" style="left:${x}px"><img src="assets/${file}.webp" alt="${esc(project.name)} actual application screen"></div>`,
    )
    .join("");
  await writeFile(
    `${dir}/compositions/scene.html`,
    `<!doctype html><html lang="en"><body><template><style>@font-face{font-family:CaptureInter;src:url('assets/inter.woff2') format('woff2');font-weight:400;font-display:swap}*{box-sizing:border-box}#root{position:absolute;inset:0;overflow:hidden;background:var(--film-bg,#0c111b);color:var(--film-fg,#f3f1eb);font-family:CaptureInter,sans-serif}.heading{position:absolute;left:90px;top:48px;font-size:26px}.tag{position:absolute;right:90px;top:54px;font-size:23px;color:var(--film-accent,#d9b98f)}.phone{position:absolute;top:130px;width:300px;height:650px;border-radius:24px;overflow:hidden;border:1px solid #62718a;background:#fff;transform-origin:center}.phone img{width:100%;height:100%;object-fit:cover;object-position:top}.foot{position:absolute;left:90px;bottom:24px;font-size:23px;color:var(--film-muted,#b5bdcc)}</style><div id="root" data-composition-id="screenshot-scene" data-width="1440" data-height="900" data-duration="12" data-layout-allow-overlap><div class="heading">${esc(project.name)}</div><div class="tag">OUR OWN PRODUCT · ACTUAL SCREENS</div>${markup}<div class="foot">${esc(project.summary)}</div></div><script>const tl=gsap.timeline({paused:true});tl.fromTo('#capture-main',{x:0,y:0,rotation:0,scale:1},{x:-50,y:25,rotation:-8,scale:.92,duration:1.6,ease:'power3.inOut'},.8);tl.fromTo('#panel-a',{y:0,rotation:0},{y:-20,rotation:0,duration:1.8,ease:'power3.inOut'},1);tl.fromTo('#panel-b',{x:0,y:0,rotation:0},{x:35,y:35,rotation:7,scale:.92,duration:1.6,ease:'power3.inOut'},1.2);tl.to('#panel-a',{x:0,y:15,scale:1.08,duration:1.4,ease:'power3.inOut'},4);tl.to('#panel-b',{x:-60,y:-15,rotation:0,scale:1.05,duration:1.4,ease:'power3.inOut'},6.5);tl.to(['#capture-main','#panel-a','#panel-b'],{x:0,y:0,rotation:0,scale:1,duration:1.5,ease:'power3.inOut'},9.5);window.__timelines=window.__timelines||{};window.__timelines['screenshot-scene']=tl;</script></template></body></html>`,
  );
}
