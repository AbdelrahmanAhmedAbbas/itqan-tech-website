import test from "node:test";
import assert from "node:assert/strict";
import { getAttribution } from "../src/lib/analytics.js";

test("first-touch attribution survives denied browser storage and navigation", () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  try {
    globalThis.window = {
      location: {
        origin: "https://itqantech.org",
        pathname: "/start",
        search: "?utm_source=linkedin&utm_campaign=ops",
      },
      sessionStorage: {
        getItem() {
          throw new Error("blocked");
        },
        setItem() {
          throw new Error("blocked");
        },
      },
    };
    globalThis.document = { referrer: "https://www.linkedin.com/" };
    const first = getAttribution();
    assert.equal(first.utm_source, "linkedin");
    window.location = {
      origin: "https://itqantech.org",
      pathname: "/contact",
      search: "",
    };
    assert.deepEqual(getAttribution(), first);
    assert.equal(getAttribution().landing_page, "https://itqantech.org/start");
  } finally {
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
  }
});
