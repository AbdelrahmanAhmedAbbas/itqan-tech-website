import test from "node:test";
import assert from "node:assert/strict";
import middleware from "../middleware.ts";
test("canonical host uses a permanent redirect and preserves route and attribution", () => {
  const r = middleware(
    new Request("https://www.itqantech.org/work/core-en?utm_source=linkedin"),
  );
  assert.equal(r.status, 301);
  assert.equal(
    r.headers.get("location"),
    "https://itqantech.org/work/core-en?utm_source=linkedin",
  );
});
test("old cases redirect permanently and the default hidden product returns to Work", () => {
  for (const [from, to] of [
    ["/case-study/core-en?utm_source=loom", "/work/core-en?utm_source=loom"],
    ["/case-study/middlemen-mdos", "/work/middlemen-mdos"],
    ["/case-study/wasfa", "/#work"],
    ["/work/wasfa", "/#work"],
  ]) {
    const r = middleware(new Request("https://itqantech.org" + from));
    assert.equal(r.status, 301);
    assert.equal(r.headers.get("location"), "https://itqantech.org" + to);
  }
  assert.equal(
    middleware(new Request("https://itqantech.org/privacy")),
    undefined,
  );
});
