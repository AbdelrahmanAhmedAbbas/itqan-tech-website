import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const routes = [
  "/",
  "/work/core-en",
  "/work/middlemen-mdos",
  "/privacy",
  "/terms",
];
const primary = "Request your free 2-minute Loom";
const secondary = "Book a 15-minute call";
test("all required pages contain real HTML, unique metadata and hydrate without errors", async ({
  page,
  request,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const titles = new Set();
  for (const route of routes) {
    const r = await request.get(route);
    expect(r.status()).toBe(200);
    expect(await r.text()).toContain("<h1");
    await page.goto(route);
    await page.reload();
    await expect(page.locator("h1")).toHaveCount(1);
    const title = await page.title();
    expect(titles.has(title)).toBe(false);
    titles.add(title);
  }
  expect(errors).toEqual([]);
});
for (const width of [360, 768, 1024, 1440])
  test(`layouts fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        route,
      ).toBeLessThanOrEqual(width);
    }
  });
test("home section order and primary/secondary funnel match the brief", async ({
  page,
}) => {
  await page.goto("/");
  expect(
    await page.locator("main>section").evaluateAll((es) => es.map((e) => e.id)),
  ).toEqual([
    "hero",
    "problem",
    "services",
    "work",
    "pricing",
    "process",
    "faq",
    "loom-request",
  ]);
  for (const id of [
    "hero",
    "services",
    "work",
    "pricing",
    "faq",
    "loom-request",
  ]) {
    const section = page.locator("#" + id);
    await expect(
      section.getByRole("button", { name: primary, exact: true }),
    ).toHaveCount(1);
    await expect(
      section.getByRole("link", { name: secondary, exact: true }),
    ).toHaveCount(1);
  }
  await expect(
    page.locator("header").getByRole("button", { name: primary, exact: true }),
  ).toHaveCount(1);
});
test("modal has exactly five visible required fields, accessible validation and focus return", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page
    .locator("#hero")
    .getByRole("button", { name: primary, exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const fields = dialog.locator(
    "input:not([type=hidden]):visible,textarea:visible",
  );
  expect(await fields.evaluateAll((es) => es.map((e) => e.name))).toEqual([
    "name",
    "email",
    "website",
    "role",
    "workflow",
  ]);
  expect(await fields.evaluateAll((es) => es.every((e) => e.required))).toBe(
    true,
  );
  await dialog.getByRole("button", { name: primary, exact: true }).click();
  await expect(dialog.locator("[name=name]")).toBeFocused();
  await expect(dialog.locator("[name=name]")).toHaveAttribute(
    "aria-describedby",
    "modal-name-error",
  );
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
test("a confirmed server save sends country and UTMs, shows thanks and fires submit once", async ({
  page,
}) => {
  let payload;
  await page.addInitScript(() => {
    window.events = [];
    window.addEventListener("itqan:analytics", (e) =>
      window.events.push(e.detail),
    );
  });
  await page.route("**/api/visitor", (r) =>
    r.fulfill({ json: { country: "EG" } }),
  );
  await page.route("**/api/loom-audit", async (r) => {
    payload = r.request().postDataJSON();
    await r.fulfill({ json: { ok: true } });
  });
  await page.goto(
    "/?utm_source=linkedin&utm_medium=outreach&utm_campaign=november&utm_content=owner",
  );
  const f = page.locator("#loom-request");
  await f.getByLabel("Name", { exact: true }).fill("Demo Owner");
  await f.getByLabel("Work email").fill("demo@example.org");
  await f.getByLabel("Company website").fill("example.org");
  await f.getByLabel("Role", { exact: true }).fill("Managing partner");
  await f
    .getByLabel("What's the workflow slowing your team down?")
    .fill(
      "We retype approved timesheets into spreadsheets before each payroll run.",
    );
  await f.getByRole("button", { name: primary, exact: true }).click();
  await expect(f.getByRole("status")).toContainText(
    "Thanks, Demo. Your request is in.",
  );
  expect(payload.website).toBe("https://example.org/");
  expect(payload.country).toBe("EG");
  expect(payload.utm_source).toBe("linkedin");
  expect(payload.utm_campaign).toBe("november");
  await expect(
    f.getByRole("heading", { name: "Thanks, Demo. Your request is in." }),
  ).toBeFocused();
  const events = await page.evaluate(() =>
    window.events.filter((e) => e.name === "loom_form_submit"),
  );
  expect(events).toHaveLength(1);
  expect(
    await page.evaluate(() => sessionStorage.getItem("itqan-attribution")),
  ).not.toContain("demo@example.org");
});
test("an unconfigured destination never pretends to save a request", async ({
  page,
}) => {
  await page.route("**/api/loom-audit", (r) =>
    r.fulfill({ status: 503, json: { error: "destination_unconfigured" } }),
  );
  await page.goto("/");
  const f = page.locator("#loom-request");
  await f.getByLabel("Name", { exact: true }).fill("Demo Owner");
  await f.getByLabel("Work email").fill("demo@example.org");
  await f.getByLabel("Company website").fill("example.org");
  await f.getByLabel("Role", { exact: true }).fill("Owner");
  await f
    .getByLabel("What's the workflow slowing your team down?")
    .fill("Our team needs one clear place for approvals and payroll data.");
  await f.getByRole("button", { name: primary, exact: true }).click();
  await expect(f.getByRole("alert")).toContainText("not connected yet");
  await expect(f.getByRole("status")).toHaveCount(0);
});
test("retained booking opens only on interaction with lazy iframe and Escape support", async ({
  page,
}) => {
  await page.route("https://cal.com/**", (r) =>
    r.fulfill({
      body: "<html><body>Booking fixture</body></html>",
      contentType: "text/html",
    }),
  );
  await page.goto("/");
  await expect(page.locator(".booking-frame")).toHaveCount(0);
  const trigger = page
    .locator("#hero")
    .getByRole("link", { name: secondary, exact: true });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".booking-frame")).toHaveAttribute(
    "src",
    "https://cal.com/abdelrahman-abbas/discovery-call",
  );
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});
test("mobile drawer traps focus and sticky bar contains the two funnel actions", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "Open navigation",
    exact: true,
  });
  await trigger.click();
  await expect(
    page.getByRole("dialog", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Tab");
  expect(
    await page.evaluate(() => !!document.activeElement.closest("dialog")),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page.locator("#problem").scrollIntoViewIfNeeded();
  await expect(
    page
      .locator(".sticky-cta")
      .getByRole("button", { name: primary, exact: true }),
  ).toBeVisible();
  await expect(
    page
      .locator(".sticky-cta")
      .getByRole("link", { name: secondary, exact: true }),
  ).toBeVisible();
});
test("prices come through cards and FAQ with matching FAQPage schema", async ({
  page,
}) => {
  await page.goto("/");
  for (const value of ["$300 fixed", "From $3,000", "From $600 a month"])
    await expect(page.locator("#pricing")).toContainText(value);
  const faq = page.locator("#faq");
  await faq.getByRole("button", { name: "How much does it cost?" }).click();
  await expect(faq).toContainText("3-month minimum");
  const data = await page.locator("#site-schema").textContent();
  const schema = JSON.parse(data).find((x) => x["@type"] === "FAQPage");
  expect(schema.mainEntity).toHaveLength(8);
  for (const item of schema.mainEntity)
    expect(await faq.locator("p").allTextContents()).toContain(
      item.acceptedAnswer.text,
    );
});
test("301 redirects hide the optional product and preserve old case links", async ({
  request,
}) => {
  for (const [url, to] of [
    ["/case-study/core-en", "/work/core-en"],
    ["/case-study/wasfa", "/#work"],
    ["/work/wasfa", "/#work"],
  ]) {
    const r = await request.get(url, { maxRedirects: 0 });
    expect(r.status()).toBe(301);
    expect(r.headers().location).toBe(to);
  }
  expect((await request.get("/unknown-page")).status()).toBe(404);
});
test("legal routes are placeholders and noindex, with working footer links", async ({
  page,
}) => {
  for (const type of ["privacy", "terms"]) {
    await page.goto("/" + type);
    await expect(page.locator("meta[name=robots]")).toHaveAttribute(
      "content",
      "noindex, follow",
    );
    await expect(page.locator("main")).toContainText(
      "This page is a placeholder.",
    );
  }
  await expect(page.locator("footer .brand")).toHaveAttribute("href", "/");
  await expect(page.locator('footer a[href="/privacy"]')).toHaveCount(1);
  await expect(page.locator('footer a[href="/terms"]')).toHaveCount(1);
});
for (const route of [
  "/",
  "/work/core-en",
  "/work/middlemen-mdos",
  "/privacy",
  "/terms",
])
  test(`accessibility has no serious or critical issues on ${route}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      result.violations
        .filter((v) => ["serious", "critical"].includes(v.impact))
        .map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
    ).toEqual([]);
  });
test("CTA and FAQ events include their properties, and the 404 Loom action opens a form", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.events = [];
    window.addEventListener("itqan:analytics", (e) =>
      window.events.push(e.detail),
    );
  });
  await page.goto("/");
  await page
    .locator("#hero")
    .getByRole("button", { name: primary, exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(await page.evaluate(() => window.events)).toContainEqual({
    name: "cta_click",
    properties: { cta: "loom_request", location: "hero" },
  });
  expect(await page.evaluate(() => window.events)).toContainEqual({
    name: "loom_form_open",
    properties: { location: "hero" },
  });
  await page.keyboard.press("Escape");
  await page
    .locator("#faq")
    .getByRole("button", { name: "How much does it cost?", exact: true })
    .click();
  expect(await page.evaluate(() => window.events)).toContainEqual({
    name: "faq_open",
    properties: { question_id: "cost" },
  });
  await page.goto("/missing-page");
  await page
    .locator("main")
    .getByRole("button", { name: primary, exact: true })
    .click();
  await expect(page.getByRole("dialog").getByLabel("Work email")).toBeVisible();
});
