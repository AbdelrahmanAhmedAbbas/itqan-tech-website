import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const chrome = await chromeLauncher.launch({
  chromePath: chromium.executablePath(),
  chromeFlags: ["--headless", "--no-sandbox"],
});
try {
  await mkdir("test-results/lighthouse", { recursive: true });
  for (const path of ["/"]) {
    const result = await lighthouse(`http://127.0.0.1:4173${path}`, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    });
    const name = path === "/" ? "home" : "start";
    await writeFile(`test-results/lighthouse/${name}.json`, result.report);
    const scores = Object.fromEntries(
      Object.entries(result.lhr.categories).map(([key, value]) => [
        key,
        Math.round(value.score * 100),
      ]),
    );
    console.log(
      JSON.stringify({
        path,
        scores,
        lcp: result.lhr.audits["largest-contentful-paint"].displayValue,
        cls: result.lhr.audits["cumulative-layout-shift"].displayValue,
      }),
    );
    const failures = Object.entries(result.lhr.audits).filter(
      ([, audit]) =>
        audit.score !== null &&
        audit.score < 1 &&
        ["binary", "numeric"].includes(audit.scoreDisplayMode),
    );
    console.log(
      JSON.stringify(
        failures.map(([id, audit]) => ({
          id,
          title: audit.title,
          value: audit.displayValue,
        })),
      ),
    );
  }
} finally {
  await chrome.kill();
}
