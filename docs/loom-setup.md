# Connect Loom requests to Google Sheets and email

The destination is [Itqan Tech – Loom requests](https://docs.google.com/spreadsheets/d/1M6f_41BM4-RMW--3jTqF8_awxYWhWLPEMZ1mv19Hq_8/edit). Notifications go to `abdelrahman.abas11493@gmail.com`. **Connected and verified from the local preview on 1 Nov 2026.** The Sheet contains one clearly labelled integration-test request, not an invented customer lead.

## Connection progress (1 Nov 2026)

The [Apps Script receiver](https://script.google.com/u/1/home/projects/1uywPEVbOy4isQ3kHdmEFSBUiwW1pcewCkaoXOnlG951_uInPO2Pb9lgJ/edit) is **Itqan Tech – Loom requests webhook**, owned by the Sheet owner's account. The Sheet ID and notification inbox are verified in Script Properties. The owner approved Sheets/send-mail permissions and public webhook access; Google confirmed a successful Version 1 deployment at 6:01 PM. The owner saved the shared secret in Script Properties and supplied it through the private card. Server-only URL/secret are saved in the ignored, mode-0600 `.env.local`; the preview server was restarted. A time-driven trigger for `retryPendingNotifications` runs every 10 minutes. The OAuth scopes are Google Sheets access and sending email; the code targets the one configured Sheet. No website production deployment has been made.

### End-to-end evidence

- Deployed receiver rejects an unauthenticated POST without saving a row.
- At 18:07 Cairo time, local `/api/loom-audit` returned HTTP 200 with `ok: true` and `notification: sent` for test request `8a266980-aba6-4edb-a257-3a2a19d1efed`.
- Google Sheets row 2 contains `[TEST] Itqan integration`, a normalized `https://itqantech.org/` website, server timestamp, Country `Unknown`, test UTMs, Status `New` and Notification `Sent`.
- Gmail confirmed one matching notification in the owner's inbox.
- Replaying that request returned success; re-reading the Sheet and Gmail confirmed exactly one saved row and one notification.
- Country is `Unknown` locally, as expected. A trusted hosting country header must be verified after any later hosted-preview setup.
- A future Vercel Preview requires the same private server environment values; production additionally requires the shared Upstash limiter. Neither website environment has been deployed/configured by this connection work.

## Recreate the connection if needed

1. Open the existing receiver project above. Its code matches [loom-sheet.gs](../scripts/loom-sheet.gs). This is a standalone script; the Sheet's Extensions menu may create a different bound project, so do not create another receiver unnecessarily.
2. Under **Project Settings → Script properties**, add:
   - `SPREADSHEET_ID`: `1M6f_41BM4-RMW--3jTqF8_awxYWhWLPEMZ1mv19Hq_8`
   - `NOTIFICATION_EMAIL`: `abdelrahman.abas11493@gmail.com`
   - `WEBHOOK_SECRET`: a long random secret (generate it locally with `openssl rand -hex 32`). Keep it private.
3. **Deploy → New deployment → Web app**. Execute as your Google account; allow access to **Anyone**. The shared secret guards requests. Approve Sheets and Mail permissions. Use the deployed `/exec` URL, not `/dev`.
4. Add these **server-only** values in `.env.local` for local testing, or in the Vercel **Preview** environment for a later preview deployment:
   ```env
   SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT/exec
   SHEETS_WEBHOOK_SECRET=YOUR_PRIVATE_SECRET
   ```
   Never add `VITE_` to either name. Restart `npm run preview` after changing them. Use the private credential card to supply these if the agent is configuring them; never paste secrets in chat.
5. Create a time-driven Apps Script trigger for `retryPendingNotifications` every 10 minutes. A saved row survives email delivery failure; its Notification column stays Pending until retry succeeds. The form's success means the row was saved, not that an email was delivered.
6. In Vercel production, configure the shared Upstash rate limiter before enabling real traffic. Preview/local development has an in-memory limiter. Production fails closed without the shared limiter. No production deployment is authorized by this work.
7. Submit a clearly labelled test, verify the sheet row, country/UTMs, and notification inbox. The 1 Nov integration test above already passed. Keep or remove the labelled test row as desired.

The endpoint validates five required fields (four if `showEmailField` is off), normalizes company URLs, rejects the honeypot, and uses server-derived country and timestamp. Country comes from Vercel's trusted geo header; `TRUST_CLOUDFLARE_PROXY=true` allows the Cloudflare country header when a trusted Cloudflare-only origin is configured. Local requests are Unknown; the browser cannot claim a country for a saved row.

Each request has a UUID. Apps Script locks writes and deduplicates by that UUID, so retrying a timed-out request does not create another row. Sheet values beginning with formula markers are escaped. No request is added to a newsletter; no IP address or personal details are written to application logs or browser storage. The notification address and sheet URL stay out of the public application bundle.
