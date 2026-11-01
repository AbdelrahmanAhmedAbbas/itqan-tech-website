import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
function fixture({ mailFails = false } = {}) {
  const rows = [["Request ID"]];
  const messages = [];
  const range = (row, col, count = 1, width = 1) => ({
    getValues: () =>
      rows
        .slice(row - 1, row - 1 + count)
        .map((r) => r.slice(col - 1, col - 1 + width)),
    getValue: () => rows[row - 1][col - 1],
    getDisplayValue: () => String(rows[row - 1][col - 1] ?? ""),
    setValue: (value) => {
      rows[row - 1][col - 1] = value;
    },
    setNumberFormat() {},
  });
  const sheet = {
    getLastRow: () => rows.length,
    getRange: range,
    appendRow: (row) => rows.push(row),
  };
  const properties = {
    WEBHOOK_SECRET: "test-only",
    SPREADSHEET_ID: "test-sheet",
    NOTIFICATION_EMAIL: "owner@example.org",
  };
  const context = vm.createContext({
    PropertiesService: {
      getScriptProperties: () => ({ getProperty: (k) => properties[k] }),
    },
    ContentService: {
      MimeType: { JSON: "json" },
      createTextOutput: (text) => ({ setMimeType: () => JSON.parse(text) }),
    },
    LockService: {
      getScriptLock: () => ({
        waitLock() {},
        tryLock: () => true,
        releaseLock() {},
      }),
    },
    SpreadsheetApp: {
      openById: () => ({
        getSheetByName: () => sheet,
        getUrl: () => "https://example.org/sheet",
      }),
      flush() {},
    },
    MailApp: {
      sendEmail: (message) => {
        if (mailFails) throw Error("offline");
        messages.push(message);
      },
    },
  });
  vm.runInContext(readFileSync("scripts/loom-sheet.gs", "utf8"), context);
  const lead = {
    requestId: "test-request-123456789",
    timestamp: "2026-11-01T12:00:00Z",
    country: "EG",
    name: "=formula",
    email: "demo@example.org",
    website: "https://example.org/",
    role: "Owner",
    workflow: "Approvals get lost between spreadsheets and email.",
    utm_source: "linkedin",
  };
  const submit = (secret) =>
    context.doPost({
      postData: { contents: JSON.stringify({ secret, lead }) },
    });
  return { rows, messages, submit, context };
}
test("the Sheets webhook rejects an invalid secret without saving or sending", () => {
  const f = fixture();
  assert.equal(f.submit("wrong").ok, false);
  assert.equal(f.rows.length, 1);
  assert.equal(f.messages.length, 0);
});
test("a repeated request saves one row and sends one notification with formula-safe data", () => {
  const f = fixture();
  assert.equal(f.submit("test-only").saved, true);
  assert.equal(f.submit("test-only").saved, true);
  assert.equal(f.rows.length, 2);
  assert.equal(f.messages.length, 1);
  assert.equal(f.rows[1][3], "'=formula");
  assert.equal(f.rows[1][2], "EG");
  assert.equal(f.rows[1][8], "linkedin");
  assert.equal(f.rows[1][16], "Sent");
});
test("email failure leaves the saved lead pending for retry", () => {
  const f = fixture({ mailFails: true });
  const result = f.submit("test-only");
  assert.equal(result.saved, true);
  assert.equal(result.notified, false);
  assert.equal(f.rows[1][16], "Pending");
});
