import { chromium } from "@playwright/test";
import { mkdir, copyFile } from "node:fs/promises";

// Start the source apps first; this script visits public/demo views only.
const coreUrl = process.env.CORE_CAPTURE_URL || "http://127.0.0.1:4317";
const wasfaUrl = process.env.WASFA_CAPTURE_URL || "http://127.0.0.1:4318";
const browser = await chromium.launch();
const isolate = async (page, url) => {
  const origin = new URL(url).origin;
  await page.route("**/*", (route) => {
    const request = route.request().url();
    return request.startsWith(origin + "/") || /^(data|blob):/.test(request)
      ? route.continue()
      : route.abort();
  });
};
try {
  const core = await browser.newPage({
    viewport: { width: 1440, height: 1080 },
  });
  await isolate(core, coreUrl);
  await core.goto(coreUrl);
  await core.waitForSelector(".recharts-pie-sector");
  await core.evaluate(() => document.fonts.ready);
  await core.waitForTimeout(1800); // Let the source chart's entrance finish.
  await core.screenshot({ path: "/tmp/itqan-core-actual.png" });
  await mkdir("scripts/capture/sources/core-en", { recursive: true });
  await copyFile(
    "/tmp/itqan-core-actual.png",
    "scripts/capture/sources/core-en/reporting.png",
  );
  for (const [title, name] of [
    ["Expenses Distribution", "distribution"],
    ["Yearly Expenses", "yearly"],
  ]) {
    await core
      .getByRole("heading", { name: title, exact: true })
      .locator("xpath=../..")
      .screenshot({ path: `/tmp/itqan-core-${name}.png` });
  }
  for (const [route, name, reducedMotion] of [
    ["welcome", "welcome", "reduce"],
    ["demo", "demo", "no-preference"],
    ["demo", "recipe", "reduce"],
  ]) {
    const page = await browser.newPage({
      viewport: { width: 430, height: 932 },
      deviceScaleFactor: 2,
      reducedMotion,
    });
    await isolate(page, wasfaUrl);
    await page.goto(`${wasfaUrl}/${route}`);
    await page
      .getByText(
        route === "welcome" ? "Welcome to Wasfa" : "Try the import magic",
        { exact: false },
      )
      .first()
      .waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(450);
    await page.screenshot({ path: `/tmp/itqan-wasfa-${name}.png` });
    if (name !== "demo") {
      await mkdir("scripts/capture/sources/wasfa", { recursive: true });
      await copyFile(
        `/tmp/itqan-wasfa-${name}.png`,
        `scripts/capture/sources/wasfa/${name}.png`,
      );
    }
    await page.close();
  }
  console.log(
    "Captured actual Core En components and Wasfa public/demo views. No external requests were allowed.",
  );
} finally {
  await browser.close();
}
