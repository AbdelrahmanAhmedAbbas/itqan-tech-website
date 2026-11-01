# Itqan Tech — Loom funnel preview

The redesign is implemented locally. **Nothing has been deployed to production.** Preview: http://127.0.0.1:4173. Compare [light](http://127.0.0.1:4173/?theme=light) and [dark](http://127.0.0.1:4173/?theme=dark). [Editable HyperFrames preview](http://127.0.0.1:4567/#project/core-en).

Merging this work into `master` does not authorize a production launch. `vercel.json → git.deploymentEnabled.master` is `false`, so automatic Git deployments from `master` are paused; other branches retain their preview deployments. When a production launch is authorized, configure the production Sheet/email settings and shared rate limiter, then remove this branch guard or set it to `true` before deploying.

```sh
npm ci                 # Node 22+
npm run build
npm run preview
```

`src/site.config.ts` owns prices, terms, links, flags and every owner confirmation. English copy lives in `src/i18n/en.json`; generated public config excludes the notification inbox, Sheet URL and secrets. Rebuild after editing config. The Arabic switch stays hidden until approved Arabic copy exists. Wasfa is OFF by default; its optional copy is in a separate locale file and is excluded from the default build.

Vercel routing middleware uses the Node runtime. Middleware and the form API read the generated JavaScript configuration, avoiding TypeScript-extension imports in deployed functions. The owner still edits only `src/site.config.ts`.

The funnel uses the exact Loom CTA, a five-field form, $300 fixed Blueprint → Build from $3,000 → Care from $600/month, and the two approved client cases. Product visuals are real application captures with demo/QA data. The latest owner request supersedes the earlier mock-screen requirement. Motion includes stronger staggered reveals, 12-second HyperFrames exploded UI layers, camera moves, chart-bar and pipeline-card animation, autoplay in the hero/cards, and scroll or play controls on case studies. A sun/moon switch in the header selects a full light or dark theme and remembers it across visits. Pause/reduced-motion support and still fallbacks remain available. See [visual sources](docs/capture-provenance.md).

The owner broadened the hero to “Custom software, built around your business.” Its supporting copy welcomes web/mobile apps, systems and automation without restricting the audience to specific roles, team sizes or spreadsheet users. The home metadata and social preview follow this positioning.

## Receiving Loom requests

Google Sheet: [Itqan Tech – Loom requests](https://docs.google.com/spreadsheets/d/1M6f_41BM4-RMW--3jTqF8_awxYWhWLPEMZ1mv19Hq_8/edit). Notification inbox: **abdelrahman.abas11493@gmail.com**.

**Connected and verified in the local preview on 1 Nov 2026.** The Apps Script receiver is deployed and authorized in the owner's Google account, and email retries run every 10 minutes. Server-only settings are saved in the ignored, mode-0600 `.env.local`. A labelled integration test returned HTTP 200, saved one row with normalized website, timestamp, country and UTMs, and delivered its notification to the inbox. Retrying the same request produced no duplicate row or email. The test row remains labelled `[TEST] Itqan integration`. All 13 API/Apps Script fixture tests pass. See [connection instructions and verification](docs/loom-setup.md).

This connection is configured for `http://127.0.0.1:4173`. A future Vercel Preview needs the same server-only environment values. The production website has not been deployed or configured by this work; it also requires the shared Upstash limiter.

The server validates fields, normalizes URLs, derives country/timestamp, checks origin/body size and rate-limits requests. Apps Script locks/deduplicates request IDs, escapes spreadsheet formulas, saves the row before notifying, and retries pending email notifications. Production requires the shared Upstash limiter; local/preview uses a process-local limiter. No newsletter subscription or personal browser storage is added.

## Booking and analytics

**Owner override:** retain https://cal.com/abdelrahman-abbas/discovery-call. Desktop opens a lazy iframe modal; mobile opens a new tab. The CTA says “Book a 15-minute call”; confirm the event itself is 15 minutes, with a buffer, Meet link, local time zones and 24-hour minimum notice. The owner will update event duration and availability directly in Cal.com. Call hours and additional attendees are managed there. No completed-booking event is claimed from the iframe.

The superseded Google Calendar setup would check the main account and **Prayers** calendar for conflicts, and exclude **Todoist** and **Holidays in Egypt**. No Google appointment schedule was created. If equivalent conflict checks are wanted in Cal.com, configure and verify those calendar selections there.

Analytics setup is deferred at the owner's request. Plausible instrumentation is ready but **not live**: supply the site's current script URL in `PLAUSIBLE_SCRIPT_URL`, set `SITE_ANALYTICS_ENABLED=true`, rebuild and verify its dashboard before sending traffic. Automatic form tracking is disabled; `loom_form_submit` fires only after a successful server response. Pageviews are sent once per route. Custom events: `cta_click` (`cta`, `location`), `loom_form_open`, `loom_form_submit`, `loom_form_error` (`field`), `booking_open`, `case_study_view` (`slug`), `faq_open` (`question_id`). No form contents or email addresses enter analytics. First-touch UTMs/referrer/landing URL persist in sessionStorage and accompany each submission. Use `utm_source=linkedin|upwork|loom`.

For the **4 Nov 2026 outreach review**, select the desired date range in Plausible, break visits down by country and filter source/campaign as needed. For the **15 Nov button review**, use the same range/country breakdown for `cta_click` (filter `cta=loom_request` or `book_call`), `loom_form_submit` and `booking_open`. Register these custom-event goals/properties in Plausible and export each filtered country report. Count completed bookings from the booking calendar. In the Sheet, filter Timestamp to the same range and group Country to count saved requests independently. Local requests show Unknown; Vercel uses its trusted country header. Confirm dashboard time zone/date boundaries consistently.

## Owner confirmations

Confirmed by the owner: public contact email **abdelrahman.itqan11493@gmail.com**; Blueprint **1–2 weeks**; the **client owns the code**; existing domain/www setup is already handled. The canonical URL remains https://itqantech.org. No new launch date is invented and no deployment was performed. Loom notification delivery still targets **abdelrahman.abas11493@gmail.com**, as previously specified.

The Sheet connector, optional build-timeline and Loom-turnaround notes are owner-only and are excluded from visitor copy, including the preview. Build duration stays scope-based in the Blueprint. The thank-you message promises no Loom delivery time unless an approved turnaround is supplied.

Remaining confirmations in `site.config.ts → confirmations`: owner-managed Cal.com settings; optional typical build timeline and Loom turnaround; approved Arabic copy and client results. **Legal text and analytics are deferred at the owner's request.** Legal placeholders remain noindex, analytics remains off, unapproved results stay hidden and no Loom turnaround is promised. `SITE_BUILD_TARGET=production` (or Vercel production) hides unresolved preview notes.

## Verification and final checklist

```sh
npm run lint
npm test
npm run check:flags
npm run test:e2e
npm run audit:mobile
```

| Item                                                                                                        | Status                                                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Exact Loom primary and smaller call link in hero/nav/pricing/final/sticky sections                          | PASS                                                                                                                                                                              |
| Five required fields, accessible errors, URL normalization, successful-save thank-you, country/UTMs         | PASS in UI/API tests and real local-preview → deployed Sheet/email test; deduplication verified. Local country is Unknown.                                                                                                                   |
| Booking opens correctly                                                                                     | PASS with owner-approved Cal.com override; actual event duration/settings PENDING                                                                                                 |
| Config-driven USD pricing, 30-day credit and 3-month minimum in cards/FAQ; no guarantee                     | PASS                                                                                                                                                                              |
| Removed prohibited copy and claims from rendered content                                                    | PASS; raw vendor JavaScript has incidental identifiers/substrings such as “Luminance”, unrelated to the removed testimonial brand                                                 |
| No testimonials, client logo strip, results metrics, ratings or invented proof                              | PASS                                                                                                                                                                              |
| Five routes return 200 directly/on refresh; legacy 301s, optional-product redirects and custom 404          | PASS locally; Vercel deployment verification PENDING (no deployment)                                                                                                              |
| Legal placeholders/noindex, working footer legal links and logo home link                                   | PASS                                                                                                                                                                              |
| Canonical/social/sitemap/robots/structured data use itqantech.org; approved personal contact email is shown | PASS; www 301 is configured in middleware                                                                                                                                         |
| Client-name OFF, email OFF, optional product ON/OFF and production-placeholder flags                        | PASS build matrix                                                                                                                                                                 |
| MDOS stays In build with 23 Nov 2026 plan; optional own product hidden by default                           | PASS                                                                                                                                                                              |
| Analytics events/country dashboard and real submit/booking-open capture                                     | PENDING account/script; browser event instrumentation tested                                                                                                                      |
| Country reporting instructions for 4 Nov and 15 Nov                                                         | PASS above; live collection PENDING                                                                                                                                               |
| Mobile Lighthouse and axe                                                                                   | PASS: Performance 93, Accessibility 100, Best Practices 100, SEO 100; LCP 0.9s, CLS 0. Axe: 0 serious/critical issues across five routes. See final review report for latest run. |
| Responsive 360/768/1024/1440, keyboard dialogs/menu/theme/FAQ and reduced motion                            | PASS, 31 browser checks; 27 unit/API/Apps Script/routing/source-capture tests pass                                                                                                |
| Confirmations centralized, short handoff, no production deployment                                          | PASS                                                                                                                                                                              |

Full HTML is pre-rendered for every supported route. Brand OG image is 1200×630, icons include Apple touch PNG, fonts are self-hosted, and animation/calendar code loads lazily. Measurements are local mobile Lighthouse results, not production measurements. Reports and screenshots remain under ignored `test-results/`.
