import { spawnSync } from "node:child_process";
const out = process.env.SITE_OUT_DIR || "dist";
for (const args of [
  ["scripts/prepare-site.mjs"],
  ["scripts/prepare-captures.mjs"],
  ["scripts/generate-motion.mjs"],
  ["scripts/generate-posters.mjs"],
  ["node_modules/vite/bin/vite.js", "build", "--outDir", out],
  [
    "node_modules/vite/bin/vite.js",
    "build",
    "--ssr",
    "src/entry-server.jsx",
    "--outDir",
    `${out}-ssr`,
  ],
  ["scripts/prerender.mjs"],
]) {
  const result = spawnSync(process.execPath, args, {
    stdio: "inherit",
    env: process.env,
  });
  if (result.status !== 0) process.exit(result.status || 1);
}
