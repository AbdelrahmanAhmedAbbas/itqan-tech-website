import { createHash, randomUUID } from "node:crypto";
import { validateLead } from "../src/lib/lead-validation.js";
import { siteConfig } from "../src/site.config.js";
import { detectCountry } from "./visitor.js";
export function createAuditHandler({
  env = process.env,
  fetchImpl = globalThis.fetch,
  now = Date.now,
} = {}) {
  const buckets = new Map();
  async function allowed(req) {
    const ip =
      env.VERCEL === "1"
        ? String(req.headers["x-forwarded-for"] || "")
            .split(",")[0]
            .trim()
        : req.socket?.remoteAddress || "unknown";
    const key =
      "itqan:loom:" +
      createHash("sha256").update(ip).digest("hex").slice(0, 32) +
      ":" +
      Math.floor(now() / 600000);
    if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
      const response = await fetchImpl(
        env.UPSTASH_REDIS_REST_URL.replace(/\/$/, "") + "/pipeline",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify([
            ["INCR", key],
            ["EXPIRE", key, "600"],
          ]),
          signal: AbortSignal.timeout(5000),
        },
      );
      if (!response.ok) throw Error("rate-limit");
      const body = await response.json();
      if (!Number.isInteger(body?.[0]?.result)) throw Error("rate-limit");
      return body[0].result <= 5;
    }
    if (env.VERCEL_ENV === "production") throw Error("rate-unconfigured");
    for (const [k, b] of buckets)
      if (now() - b.start >= 600000) buckets.delete(k);
    const b = buckets.get(key) || { count: 0, start: now() };
    b.count++;
    if (buckets.size > 10000 && !buckets.has(key)) return false;
    buckets.set(key, b);
    return b.count <= 5;
  }
  return async function handler(req, res) {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "method_not_allowed" });
    }
    if (
      !String(req.headers["content-type"] || "").startsWith("application/json")
    )
      return res.status(415).json({ error: "json_required" });
    if (req.headers.origin) {
      try {
        const host = new URL(req.headers.origin).host;
        if (![req.headers.host, new URL(siteConfig.domain).host].includes(host))
          return res.status(403).json({ error: "origin_not_allowed" });
      } catch {
        return res.status(403).json({ error: "origin_not_allowed" });
      }
    }
    let body;
    try {
      body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      if (!body || Array.isArray(body) || typeof body !== "object")
        throw Error();
      if (Buffer.byteLength(JSON.stringify(body)) > 10000)
        return res.status(413).json({ error: "request_too_large" });
    } catch {
      return res.status(400).json({ error: "invalid_body" });
    }
    if (body.contactAddress) return res.status(200).json({ ok: true });
    const { errors, data } = validateLead(body, {
      showEmailField: env.SITE_SHOW_EMAIL_FIELD
        ? env.SITE_SHOW_EMAIL_FIELD !== "false"
        : siteConfig.form.showEmailField,
    });
    if (Object.keys(errors).length) return res.status(422).json({ errors });
    if (!env.SHEETS_WEBHOOK_URL || !env.SHEETS_WEBHOOK_SECRET)
      return res.status(503).json({ error: "destination_unconfigured" });
    try {
      if (!(await allowed(req))) {
        res.setHeader("Retry-After", "600");
        return res.status(429).json({ error: "rate_limited" });
      }
      const attribution = Object.fromEntries(
        [
          "utm_source",
          "utm_medium",
          "utm_campaign",
          "utm_content",
          "referrer",
          "landing_page",
        ].map((key) => [
          key,
          typeof body[key] === "string"
            ? body[key].slice(0, key.startsWith("utm_") ? 200 : 2000)
            : "",
        ]),
      );
      const requestId = /^[a-zA-Z0-9-]{16,80}$/.test(body.requestId || "")
        ? body.requestId
        : randomUUID();
      const lead = {
        ...data,
        ...attribution,
        country: detectCountry(req, env),
        timestamp: new Date(now()).toISOString(),
        requestId,
      };
      const result = await fetchImpl(env.SHEETS_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: env.SHEETS_WEBHOOK_SECRET, lead }),
        signal: AbortSignal.timeout(15000),
      });
      if (!result.ok)
        return res.status(502).json({ error: "destination_failed" });
      const saved = await result.json().catch(() => ({}));
      if (saved.ok !== true || saved.saved !== true)
        return res.status(502).json({ error: "destination_failed" });
      return res
        .status(200)
        .json({
          ok: true,
          requestId,
          notification: saved.notified ? "sent" : "pending",
        });
    } catch {
      return res.status(503).json({ error: "temporarily_unavailable" });
    }
  };
}
export default createAuditHandler();
