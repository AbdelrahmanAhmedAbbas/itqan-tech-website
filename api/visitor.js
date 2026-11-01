export function detectCountry(request, env = process.env) {
  const headers = request.headers || {};
  const raw =
    env.VERCEL === "1"
      ? headers["x-vercel-ip-country"]
      : env.TRUST_CLOUDFLARE_PROXY === "true"
        ? headers["cf-ipcountry"]
        : "";
  return typeof raw === "string" &&
    /^[A-Z]{2}$/.test(raw) &&
    !["XX", "T1"].includes(raw)
    ? raw
    : "Unknown";
}
export default function handler(request, response) {
  response.setHeader("Cache-Control", "private, no-store");
  response.setHeader("Vary", "CF-IPCountry, X-Vercel-IP-Country");
  response.status(200).json({ country: detectCountry(request) });
}
