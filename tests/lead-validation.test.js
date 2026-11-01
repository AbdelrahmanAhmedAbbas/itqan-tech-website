import test from "node:test";
import assert from "node:assert/strict";
import { normalizeWebsite, validateLead } from "../src/lib/lead-validation.js";
const lead = {
  name: "Demo Owner",
  email: "owner@example.org",
  website: "example.org",
  role: "Operations manager",
  workflow:
    "Our team retypes approved timesheets into a payroll spreadsheet every month.",
};
test("the five required fields validate and the website is normalized", () => {
  const r = validateLead(lead);
  assert.deepEqual(r.errors, {});
  assert.equal(r.data.website, "https://example.org/");
  assert.deepEqual(Object.keys(r.data), [
    "name",
    "email",
    "website",
    "role",
    "workflow",
  ]);
});
test("roles accept free text rather than limiting visitors to suggestions", () =>
  assert.deepEqual(
    validateLead({ ...lead, role: "Managing partner" }).errors,
    {},
  ));
test("missing required fields have specific errors", () =>
  assert.deepEqual(Object.keys(validateLead({}).errors), [
    "name",
    "email",
    "website",
    "role",
    "workflow",
  ]));
test("email-off mode uses four fields and strips any supplied email", () => {
  const r = validateLead({ ...lead, email: "" }, { showEmailField: false });
  assert.deepEqual(r.errors, {});
  assert.equal("email" in r.data, false);
});
test("workflow length is enforced at both boundaries", () => {
  for (const n of [19, 601])
    assert.equal(
      validateLead({ ...lead, workflow: "a".repeat(n) }).errors.workflow,
      "workflow",
    );
  for (const n of [20, 600])
    assert.equal(
      validateLead({ ...lead, workflow: "a".repeat(n) }).errors.workflow,
      undefined,
    );
});
test("URLs reject executable protocols, credentials and invalid hosts", () => {
  for (const url of [
    "javascript:alert(1)",
    "https://user:pass@example.org",
    "ftp://example.org",
    "invalid",
  ])
    assert.equal(normalizeWebsite(url), "");
  assert.equal(
    normalizeWebsite("www.example.org/path"),
    "https://www.example.org/path",
  );
});
