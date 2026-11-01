import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
const build = (env) => {
  const r = spawnSync(process.execPath, ["scripts/build.mjs"], {
    env: { ...process.env, ...env },
    encoding: "utf8",
    maxBuffer: 8e6,
  });
  if (r.status !== 0) throw Error(r.stdout + r.stderr);
};
try {
  let out = "test-results/flags/anonymous";
  build({
    SITE_OUT_DIR: out,
    SITE_SHOW_CLIENT_NAMES: "false",
    SITE_SHOW_EMAIL_FIELD: "false",
  });
  const core = await readFile(`${out}/work/core-en/index.html`, "utf8");
  assert(
    core.includes("An engineering company&#x27;s management system") ||
      core.includes("An engineering company&#39;s management system") ||
      core.includes("An engineering company's management system"),
  );
  assert(!core.includes("Core En"));
  assert(!core.includes("Middlemen"));
  const home = await readFile(`${out}/index.html`, "utf8");
  assert(!home.includes('name="email"'));
  assert(!home.includes("Core En"));
  assert(!home.includes("Middlemen"));
  console.log(
    "PASS anonymous client names and four-field form, including SSR metadata",
  );
  out = "test-results/flags/product";
  build({ SITE_OUT_DIR: out, SITE_SHOW_WASFA: "true" });
  const product = await readFile(`${out}/work/wasfa/index.html`, "utf8");
  assert(product.includes("Our own product"));
  assert(
    (await readFile(`${out}/sitemap.xml`, "utf8")).includes("/work/wasfa"),
  );
  console.log("PASS optional product enabled: page, label and sitemap");
  out = "test-results/flags/production";
  build({ SITE_OUT_DIR: out, SITE_BUILD_TARGET: "production" });
  const html = await readFile(`${out}/index.html`, "utf8");
  assert(!html.includes("[CONFIRM"));
  assert(!html.includes("[PENDING"));
  console.log("PASS production hides unresolved placeholders");
} finally {
  build({ SITE_OUT_DIR: "dist" });
  console.log("Restored default preview build");
}
