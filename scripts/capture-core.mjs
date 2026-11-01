import { createServer } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import { resolve } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";
import postcss from "postcss";
import loadConfig from "tailwindcss/loadConfig.js";

const workspace = process.cwd();
const core = resolve(process.env.CORE_APP_DIR || "../core-en-platform");
const capture = resolve("scripts/capture/core");
const config = loadConfig(resolve(core, "tailwind.config.ts"));
config.content = [
  resolve(core, "components/**/*.{ts,tsx}"),
  resolve(core, "features/expenses/**/*.{ts,tsx}"),
  resolve(capture, "entry.jsx"),
];
const compiled = await postcss([tailwindcss(config), autoprefixer()]).process(
  readFileSync(resolve(core, "app/globals.css"), "utf8"),
  { from: resolve(core, "app/globals.css") },
);
writeFileSync(resolve(capture, "capture.css"), compiled.css);

const server = await createServer({
  configFile: false,
  root: capture,
  plugins: [
    {
      name: "isolate-capture-server-actions",
      enforce: "pre",
      load(id) {
        if (!id.startsWith(core) || !id.endsWith(".ts")) return;
        const source = readFileSync(id, "utf8");
        if (!/^\s*['"]use server['"]/.test(source)) return;
        const names = [
          ...source.matchAll(
            /export\s+(?:async\s+function|const|function)\s+(\w+)/g,
          ),
        ].map((match) => match[1]);
        return names
          .map(
            (name) =>
              `export const ${name} = async () => {throw new Error('Server actions are disabled in the screenshot fixture')};`,
          )
          .join("\n");
      },
    },
    react(),
  ],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: [
      {
        find: /^next\/navigation$/,
        replacement: resolve(capture, "navigation.js"),
      },
      {
        find: /^next-auth\/react$/,
        replacement: resolve(capture, "session.js"),
      },
      { find: /^next\/link$/, replacement: resolve(capture, "link.jsx") },
      { find: /^next\/image$/, replacement: resolve(capture, "image.jsx") },
      { find: /^@core\//, replacement: core + "/" },
      { find: /^@\//, replacement: core + "/" },
      { find: /^react$/, replacement: resolve(core, "node_modules/react") },
      {
        find: /^react\//,
        replacement: resolve(core, "node_modules/react") + "/",
      },
      {
        find: /^react-dom$/,
        replacement: resolve(core, "node_modules/react-dom"),
      },
      {
        find: /^react-dom\//,
        replacement: resolve(core, "node_modules/react-dom") + "/",
      },
    ],
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          config: resolve(core, "tailwind.config.ts"),
          content: [
            resolve(core, "components/**/*.{ts,tsx}"),
            resolve(core, "features/expenses/**/*.{ts,tsx}"),
          ],
        }),
        autoprefixer(),
      ],
    },
  },
  server: {
    host: "127.0.0.1",
    port: 4317,
    strictPort: true,
    fs: { allow: [workspace, core] },
  },
});
await server.listen();
console.log(
  "Core En actual components with isolated fixture data: http://127.0.0.1:4317",
);
