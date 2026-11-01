import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const routes = [
  "/",
  "/work/core-en",
  "/work/middlemen-mdos",
  "/privacy",
  "/terms",
];
test("theme choice persists on navigation and refresh, and works when storage is blocked", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Switch to light theme", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.goto("/work/core-en");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
    "content",
    "#F7F5F2",
  );
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, "setItem", {
      value() {
        throw Error("blocked");
      },
    });
  });
  await page.reload();
  await page
    .getByRole("button", { name: "Switch to dark theme", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
for (const theme of ["light", "dark"])
  test(`${theme} theme has readable routes, correct surfaces and no serious accessibility issues`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    if (theme === "light")
      await page
        .getByRole("button", { name: "Switch to light theme", exact: true })
        .click();
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        result.violations
          .filter((v) => ["serious", "critical"].includes(v.impact))
          .map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
        route,
      ).toEqual([]);
    }
    await page.goto("/");
    const background = await page
      .locator("#hero")
      .evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(background).toBe(
      theme === "light" ? "rgb(252, 251, 249)" : "rgb(12, 13, 16)",
    );
    for (const width of [360, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
  });
test("light theme also colors the live HyperFrames stage without changing screenshot pixels", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Switch to light theme", exact: true })
    .click();
  const player = page.locator(".hero-visual hyperframes-player");
  await expect.poll(() => player.evaluate((e) => e.ready)).toBe(true);
  await expect
    .poll(() =>
      player.evaluate((e) =>
        e.iframeElement.contentDocument.documentElement.style.getPropertyValue(
          "--film-bg",
        ),
      ),
    )
    .toBe("#edf0f6");
  await expect(page.locator(".hero-visual .hyperframe-scene")).toHaveClass(
    /is-painted/,
  );
});
test("walkthrough play control advances the animation without scrolling", async ({
  page,
}) => {
  await page.goto("/work/middlemen-mdos");
  await page.locator(".scroll-showcase").scrollIntoViewIfNeeded();
  await page
    .getByRole("button", { name: "Play animation", exact: true })
    .click();
  const player = page.locator(".scroll-showcase hyperframes-player");
  await expect.poll(() => player.evaluate((e) => e.ready)).toBe(true);
  await expect
    .poll(() => player.evaluate((e) => e.currentTime))
    .toBeGreaterThan(0.5);
  await page
    .getByRole("button", { name: "Use scroll control", exact: true })
    .click();
  await expect.poll(() => player.evaluate((e) => e.paused)).toBe(true);
});

test("light and dark preview links select a theme and stay consistent after toggling", async ({
  page,
}) => {
  await page.goto("/?theme=light");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page
    .getByRole("button", { name: "Switch to dark theme", exact: true })
    .click();
  await expect(page).toHaveURL(/theme=dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
