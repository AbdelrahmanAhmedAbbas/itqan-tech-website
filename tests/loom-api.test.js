import test from "node:test";
import assert from "node:assert/strict";
import { createAuditHandler } from "../api/loom-audit.js";
import { detectCountry } from "../api/visitor.js";
const lead = {
  name: "Demo Owner",
  email: "demo@example.org",
  website: "example.org",
  role: "Founder",
  workflow:
    "We retype each approved timesheet into another payroll spreadsheet.",
  country: "FAKE",
  timestamp: "1900-01-01",
  utm_source: "linkedin",
  requestId: "test-request-123456789",
};
const env = {
  SHEETS_WEBHOOK_URL: "https://script.google.com/macros/s/test/exec",
  SHEETS_WEBHOOK_SECRET: "private-test-secret",
};
async function call(handler, body = lead, extra = {}) {
  const req = {
    method: "POST",
    headers: { host: "itqantech.org", "content-type": "application/json" },
    socket: { remoteAddress: "127.0.0.1" },
    body,
    ...extra,
  };
  const res = {
    headers: {},
    statusCode: 200,
    setHeader(k, v) {
      this.headers[k] = v;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
  await handler(req, res);
  return res;
}
test("unconfigured destinations cannot report a saved request", async () => {
  const r = await call(createAuditHandler({ env: {} }));
  assert.equal(r.statusCode, 503);
  assert.equal(r.body.error, "destination_unconfigured");
});
test("invalid fields cannot reach the destination", async () => {
  let calls = 0;
  const r = await call(
    createAuditHandler({
      env,
      fetchImpl: async () => {
        calls++;
      },
    }),
    { ...lead, email: "bad" },
  );
  assert.equal(r.statusCode, 422);
  assert.equal(calls, 0);
});
test("a successful server response requires a confirmed saved row", async () => {
  let sent;
  const r = await call(
    createAuditHandler({
      env: { ...env, VERCEL: "1" },
      now: () => Date.UTC(2026, 10, 1),
      fetchImpl: async (_url, options) => {
        sent = JSON.parse(options.body);
        return {
          ok: true,
          json: async () => ({ ok: true, saved: true, notified: true }),
        };
      },
    }),
    lead,
    {
      headers: {
        host: "itqantech.org",
        "content-type": "application/json",
        "x-vercel-ip-country": "EG",
        "x-forwarded-for": "127.0.0.1",
      },
    },
  );
  assert.equal(r.statusCode, 200);
  assert.equal(r.body.ok, true);
  assert.equal(sent.lead.country, "EG");
  assert.equal(sent.lead.timestamp, "2026-11-01T00:00:00.000Z");
  assert.equal(sent.lead.utm_source, "linkedin");
  assert.equal(sent.secret, env.SHEETS_WEBHOOK_SECRET);
});
test("a saved row remains successful when email notification is pending", async () => {
  const r = await call(
    createAuditHandler({
      env,
      fetchImpl: async () => ({
        ok: true,
        json: async () => ({ ok: true, saved: true, notified: false }),
      }),
    }),
  );
  assert.equal(r.body.notification, "pending");
  assert.equal(r.body.ok, true);
});
test("provider failures and unconfirmed writes never produce success", async () => {
  for (const result of [
    { ok: false },
    { ok: true, json: async () => ({ ok: true, saved: false }) },
  ]) {
    const r = await call(
      createAuditHandler({ env, fetchImpl: async () => result }),
    );
    assert.equal(r.statusCode, 502);
    assert.equal(r.body.ok, undefined);
  }
});
test("honeypot requests are dropped without forwarding", async () => {
  let calls = 0;
  const r = await call(createAuditHandler({ env, fetchImpl: () => calls++ }), {
    ...lead,
    contactAddress: "spam",
  });
  assert.equal(r.statusCode, 200);
  assert.equal(calls, 0);
});
test("the sixth local request is rate limited", async () => {
  const h = createAuditHandler({
    env,
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({ ok: true, saved: true }),
    }),
  });
  for (let i = 0; i < 5; i++) assert.equal((await call(h)).statusCode, 200);
  assert.equal((await call(h)).statusCode, 429);
});
test("production fails closed without shared rate limiting", async () => {
  let calls = 0;
  const r = await call(
    createAuditHandler({
      env: { ...env, VERCEL_ENV: "production" },
      fetchImpl: async () => calls++,
    }),
  );
  assert.equal(r.statusCode, 503);
  assert.equal(calls, 0);
});
test("country comes from a trusted hosting header, never from the form", () => {
  assert.equal(
    detectCountry({ headers: { "cf-ipcountry": "US" } }, {}),
    "Unknown",
  );
  assert.equal(
    detectCountry(
      { headers: { "cf-ipcountry": "US" } },
      { TRUST_CLOUDFLARE_PROXY: "true" },
    ),
    "US",
  );
  assert.equal(
    detectCountry(
      { headers: { "x-vercel-ip-country": "AE" } },
      { VERCEL: "1" },
    ),
    "AE",
  );
});
test("cross-origin and oversized submissions are rejected", async () => {
  const h = createAuditHandler({ env });
  assert.equal(
    (
      await call(h, lead, {
        headers: {
          host: "itqantech.org",
          "content-type": "application/json",
          origin: "https://other.example",
        },
      })
    ).statusCode,
    403,
  );
  assert.equal(
    (await call(h, { ...lead, extra: "x".repeat(11000) })).statusCode,
    413,
  );
});
