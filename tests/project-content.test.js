import test from "node:test";
import assert from "node:assert/strict";
import { data } from "../src/generated/site.js";
test("the default build has only the two client cases", () =>
  assert.deepEqual(
    data.copy.projects.map((p) => p.slug),
    ["core-en", "middlemen-mdos"],
  ));
test("default MDOS copy and status remain in build", () => {
  assert.equal(data.copy.projects[1].status, "in-build");
  assert.equal(
    data.copy.common.planned,
    "In build. Go-live planned for 23 Nov 2026.",
  );
});
test("public configuration contains no private notification address or sheet identifier", () => {
  assert.equal(
    JSON.stringify(data.config).includes("abdelrahman.abas11493@gmail.com"),
    false,
  );
  assert.equal(JSON.stringify(data.config).includes("1M6f_41"), false);
});
