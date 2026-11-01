import { siteConfig } from "../site.config.js";
const ATTRIBUTION_KEY = "itqan-attribution";
const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];
const visitCache = new WeakMap();
export function getAttribution() {
  if (typeof window === "undefined") return {};
  if (visitCache.has(window)) return visitCache.get(window);
  let previous;
  try {
    previous = JSON.parse(window.sessionStorage.getItem(ATTRIBUTION_KEY));
  } catch {
    /* Browser storage may be unavailable. */
  }
  const params = new URLSearchParams(window.location.search);
  const data = {
    ...Object.fromEntries(
      keys.map((key) => [key, (params.get(key) || "").slice(0, 200)]),
    ),
    referrer: document.referrer.slice(0, 1000),
    landing_page: (
      window.location.href || window.location.origin + window.location.pathname
    ).slice(0, 2000),
    locale: "en",
  };
  if (previous?.locale === "en" && typeof previous.landing_page === "string") {
    for (const key of [...keys, "referrer", "landing_page"])
      if (typeof previous[key] === "string")
        data[key] = previous[key].slice(0, key.startsWith("utm_") ? 200 : 2000);
  }
  visitCache.set(window, data);
  try {
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(data));
  } catch {
    /* Browser storage may be unavailable. */
  }
  return data;
}
export function loadAnalytics() {
  if (
    typeof window === "undefined" ||
    !siteConfig.analytics.enabled ||
    !siteConfig.analytics.scriptUrl ||
    document.getElementById("plausible-script")
  )
    return;
  window.plausible =
    window.plausible ||
    function () {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };
  window.plausible.init =
    window.plausible.init ||
    function (options) {
      window.plausible.o = options;
    };
  window.plausible.init({
    autoCapturePageviews: false,
    formSubmissions: false,
  });
  const script = document.createElement("script");
  script.id = "plausible-script";
  script.src = siteConfig.analytics.scriptUrl;
  script.defer = true;
  script.dataset.domain = siteConfig.analytics.domain;
  document.head.append(script);
}
export function track(name, properties = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("itqan:analytics", { detail: { name, properties } }),
  );
  if (siteConfig.analytics.enabled)
    window.plausible?.(name, { props: properties });
}
let lastPage = "";
export function trackPageview(path) {
  if (typeof window === "undefined" || path === lastPage) return;
  lastPage = path;
  if (siteConfig.analytics.enabled)
    window.plausible?.("pageview", {
      url: window.location.origin + path + window.location.search,
    });
}
