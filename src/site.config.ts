// Owner-editable settings. No secrets belong in this file.
export const siteConfig = {
  name: "Itqan Tech",
  alternateName: "إتقان تك",
  founder: "Abdelrahman Ahmed",
  domain: "https://itqantech.org",
  linkedin: "https://www.linkedin.com/in/abdelrahman114/",
  email: "abdelrahman.itqan11493@gmail.com",
  flags: {
    showClientNames: process.env.SITE_SHOW_CLIENT_NAMES !== "false",
    showWasfa: process.env.SITE_SHOW_WASFA === "true",
    showEmailField: process.env.SITE_SHOW_EMAIL_FIELD !== "false",
    mdosStatus: process.env.SITE_MDOS_STATUS === "live" ? "live" : "in-build",
    showUnresolvedInProduction: false,
    arabicApproved: false,
  },
  hero: { variant: 0, variants: ["business", "next-build", "custom"] },
  pricing: {
    blueprint: 300,
    buildFrom: 3000,
    careMonthlyFrom: 600,
    creditDays: 30,
    careMinimumMonths: 3,
    blueprintWeeks: "1–2 weeks",
  },
  booking: {
    url: "https://cal.com/abdelrahman-abbas/discovery-call",
    account: "abdelrahman.abas11493@gmail.com",
    event: "15-minute intro call with Itqan Tech",
    provider: "cal",
    minutes: 15,
    minimumNoticeHours: 24,
  },
  form: {
    notificationEmail: "abdelrahman.abas11493@gmail.com",
    sheetUrl:
      "https://docs.google.com/spreadsheets/d/1M6f_41BM4-RMW--3jTqF8_awxYWhWLPEMZ1mv19Hq_8/edit",
    endpoint: "/api/loom-audit",
    visitorEndpoint: "/api/visitor",
    destination: "google-sheet-email",
  },
  analytics: {
    provider: "plausible",
    enabled: process.env.SITE_ANALYTICS_ENABLED === "true",
    scriptUrl: process.env.PLAUSIBLE_SCRIPT_URL || "",
    domain: "itqantech.org",
  },
  legal: { privacy: "", terms: "", updated: "2026-11-01" },
  confirmations: {
    destination: "",
    bookingUrl:
      "[CONFIRM – retained Cal.com event: set and verify a 15-minute duration]",
    callHours: "[CONFIRM – call hours]",
    attendees: "[CONFIRM – other attendees]",
    buildTimeline: "[CONFIRM – typical build timeline.]",
    turnaround: "[CONFIRM – Loom turnaround; no delivery time is promised]",
    privacy:
      "[CONFIRM – Privacy Policy text to be supplied by Itqan Tech. This page is a placeholder.]",
    terms:
      "[CONFIRM – Terms text to be supplied by Itqan Tech. This page is a placeholder.]",
    arabic: "[CONFIRM – Arabic copy to be supplied]",
    analytics: "[CONFIRM – Plausible site and tracking script]",
    coreEvidence:
      "[CONFIRM – Core En results: restore only if real and approved by the client.]",
  },
  // Fill approved values here; blank values never become public promises.
  // Owner confirmed the existing domain/www setup. No deployment is authorized here.
  approved: {
    blueprintTimeline: true,
    buildTimeline: "",
    turnaround: "",
    ownership: true,
    canonical: true,
    domainSetup: true,
  },
};
