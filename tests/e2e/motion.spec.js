import { test, expect } from "@playwright/test";
const scroll = async (page, progress) =>
  page.locator(".scroll-showcase").evaluate(
    (el, p) =>
      window.scrollTo({
        top:
          el.getBoundingClientRect().top +
          scrollY -
          96 +
          p * (el.clientHeight - innerHeight + 96),
        behavior: "instant",
      }),
    progress,
  );
for (const slug of ["core-en", "middlemen-mdos"])
  test(`${slug} HyperFrames panels seek in both scroll directions`, async ({
    page,
  }) => {
    await page.goto("/work/" + slug);
    await scroll(page, 0.15);
    const player = page.locator("hyperframes-player");
    await expect.poll(() => player.evaluate((e) => e.ready)).toBe(true);
    await expect
      .poll(() => player.evaluate((e) => e.currentTime))
      .toBeGreaterThan(0.8);
    const state = () =>
      player.evaluate((e) => {
        const panel = e.iframeElement.contentDocument.querySelector(
          '#panel-a, [data-hf-authored-id="panel-a"]',
        );
        return {
          transform: panel.style.transform,
          opacity: panel.style.opacity,
        };
      });
    const first = await state();
    await scroll(page, 0.7);
    await expect
      .poll(() => player.evaluate((e) => e.currentTime))
      .toBeGreaterThan(5);
    expect(await state()).not.toEqual(first);
    await scroll(page, 0.15);
    await expect
      .poll(() => player.evaluate((e) => e.currentTime))
      .toBeLessThan(2.1);
    expect(await state()).toEqual(first);
  });
test("pause and reduced motion leave readable stills and stop animation loading", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work/core-en");
  await expect(page.locator(".scroll-showcase")).toHaveClass(/motion-static/);
  await expect(page.locator(".static-capture-gallery img")).toHaveCount(2);
  await expect(page.locator("hyperframes-player")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page
    .getByRole("button", { name: "Pause animations", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
});
test("theme and motion controls are keyboard accessible and clear the mobile CTA", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const theme = page.getByRole("button", {
    name: "Switch to light theme",
    exact: true,
  });
  await theme.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.locator("#problem").scrollIntoViewIfNeeded();
  const sticky = page.locator(".sticky-cta");
  await expect(sticky).toBeVisible();
  const bounds = await sticky.boundingBox(),
    control = await page.locator(".motion-toggle").boundingBox();
  expect(control.y + control.height).toBeLessThan(bounds.y);
});
test("hero plays a real HyperFrames scene and pauses when offscreen", async ({
  page,
}) => {
  await page.goto("/");
  const player = page.locator(".hero-visual hyperframes-player");
  await expect.poll(() => player.evaluate((e) => e.ready)).toBe(true);
  await expect
    .poll(() => player.evaluate((e) => e.currentTime))
    .toBeGreaterThan(0.3);
  await expect(page.locator(".hero-visual .hyperframe-scene")).toHaveClass(
    /is-painted/,
  );
  const panels = await player.evaluate(
    (e) => e.iframeElement.contentDocument.querySelectorAll(".ui-piece").length,
  );
  expect(panels).toBeGreaterThanOrEqual(7);
  await page.locator("#faq").scrollIntoViewIfNeeded();
  await expect.poll(() => player.evaluate((e) => e.paused)).toBe(true);
});
