# Real application screenshots and HyperFrames

The owner's latest request restores real application screenshots and heavier motion. Generated mock screens are no longer used. The build reuses committed source captures; it never replaces them with synthetic UI.

| Project                            | Capture source                                                                                                                     | Data and scope                                                                                                                                                                                                  |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Core En                            | Real `TabsProvider` and reporting components imported from `../core-en-platform`, rendered locally in the isolated capture harness | Fixture expenses/categories only; no production database or real payroll/staff data. This is a real component capture, not an authenticated production session.                                                 |
| Middlemen MDOS                     | Existing web/iOS QA captures in `../mdos/screens-audit-2026-10-18/screenshots/`                                                    | Inventory, pipeline and mobile pipeline screens. Sample data/QA fixtures; the site still says In build. Company sidebar/account chrome is cropped out. Figures inside the UI are demo data, not client results. |
| Wasfa, optional and OFF by default | Fresh local Expo `/welcome` and `/demo` recipe-state captures from `../meal-planner`                                               | Welcome and recipe screens only. The social-card demo with counters is excluded. Clearly labelled as our own product if enabled.                                                                                |

Source PNGs live in `scripts/capture/sources/`. `scripts/prepare-captures.mjs` produces WebP screens, exact panel crops and `layers.json`. The original application colors remain intact in both website themes. No stock photography, AI-generated interfaces, production credentials or private database data are needed for the preview.

## Motion

Each client composition is a 12-second, deterministic HyperFrames timeline: establish the real screen → explode its toolbar, filters, charts and tables → move the camera into individual panels → animate chart-bar crops (Core En) or pipeline-card crops plus the mobile screen (MDOS) → reassemble. The hero and case cards play automatically while visible. Case-study pages scrub the same timeline with scroll and include a Play animation / Use scroll control switch.

The light/dark toggle persists in localStorage and sets matching stage colors without recoloring screenshot pixels. Global pause and reduced motion show real screenshot posters and a static detail gallery. The player loads lazily; hidden/offscreen instances pause.

## Refresh

1. Start the isolated Core En harness with `npm run capture:core` (4317).
2. Start Wasfa's public web views on 4318 if refreshing that optional product.
3. Run `npm run capture:apps`. External app requests are blocked by the capture script. It saves refreshed source PNGs in this repository.
4. Refresh MDOS source PNGs from an approved QA run. Do not substitute production data.
5. Run `npm run motion:generate`, then `npm run build`. These regenerate WebP crops, posters and composition HTML from the stored source captures.
6. Run the pinned HyperFrames full check in each changed project and inspect snapshots, including exploded, focused, mobile and reassembled states. `npm run check:flags` verifies alternate builds and restores the default preview.

HyperFrames is pinned to 0.8.226. The website preview is http://127.0.0.1:4173. The editable animation preview is started with `npx hyperframes@0.8.226 preview --dir public/motion/core-en --background --port 4567`; use its returned project URL.
