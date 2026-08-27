# A-Share Events Calendar

An open-source A-share events calendar for reviewing officially announced policy, macro, market, industry, company, and product events relevant to equity research.

[English](README.md) | [简体中文](README.zh-CN.md)

[Canonical demo URL](https://siliang42.github.io/a-share-events-calendar/) | [Repository](https://github.com/siliang42/a-share-events-calendar)

[![MIT License](https://img.shields.io/badge/license-MIT-2f6f4e.svg)](LICENSE)
[![Pages](https://github.com/siliang42/a-share-events-calendar/actions/workflows/pages.yml/badge.svg)](https://github.com/siliang42/a-share-events-calendar/actions/workflows/pages.yml)
[![Validation](https://github.com/siliang42/a-share-events-calendar/actions/workflows/validate.yml/badge.svg)](https://github.com/siliang42/a-share-events-calendar/actions/workflows/validate.yml)

The canonical demo is the deployment target for the release workflow. A successful deployment is not asserted until that workflow has completed.

## Preview

![A-Share Events Calendar showing the September 15, 2026 event detail](assets/preview.png)

The verified 1600 x 900 preview shows the inspectable September 2026 calendar and its official-source event detail.

## Who It Is For

- Equity and industry researchers who track dated market catalysts.
- Analysts maintaining a source-backed China stock market calendar.
- Developers who need a small, auditable financial calendar data model.
- Teams incorporating dated evidence into event-driven research.

## Source And Coverage Policy

Every event must be announced by an official body or documented by a primary source available over HTTPS. Each record names that source, links to it, and records the latest verification date. Secondary reporting may help locate an announcement, but it is not sufficient evidence for inclusion. Rumors, inferred dates, predictions, and unsourced estimates are excluded.

The schema supports these categories and statuses:

| Dimension | Supported values |
| --- | --- |
| Categories | `macro`, `policy`, `market`, `industry`, `company`, `product` |
| Statuses | `confirmed`, `postponed`, `cancelled` |

Current runtime coverage is deliberately small: `js/data.js` contains three confirmed 2026 Federal Open Market Committee meetings, all verified against the Federal Reserve Board on 2026-08-27. Supported categories describe the data contract, not current breadth.

## Features

| Capability | Current behavior |
| --- | --- |
| Monthly calendar | Shows a responsive six-week view with lunar dates, festivals, event markers, and optional holiday metadata. |
| Date details | Opens a keyboard-accessible detail dialog for the selected date. |
| Event evidence | Displays category, status, factual description, official source, and verification date. |
| Date ranges | Shows a multi-day event on each date from `startDate` through `endDate`. |
| Navigation | Provides previous month, next month, and return-to-today controls. |
| Discovery metadata | Publishes canonical, Open Graph, schema.org JSON-LD, sitemap, robots, and `llms.txt` metadata. |
| Runtime footprint | Uses browser-native HTML, CSS, and JavaScript with no production dependencies or build step. |

## Quick Start

Clone the repository and open `index.html` in a modern browser:

```bash
git clone https://github.com/siliang42/a-share-events-calendar.git
cd a-share-events-calendar
open index.html
```

On platforms without the macOS `open` command, open `index.html` from a file browser. No package installation is required to run the application. Node.js 20 or later is required for validation.

## Event Data Schema

Events are stored in the `EVENTS` array in `js/data.js`, ordered by `startDate`:

```js
{
    id: "fomc-2026-09",
    title: "Federal Open Market Committee meeting",
    startDate: "2026-09-15",
    endDate: "2026-09-16",
    category: "policy",
    description: "Scheduled Federal Open Market Committee monetary-policy meeting.",
    status: "confirmed",
    sourceName: "Federal Reserve Board",
    sourceUrl: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm",
    verifiedAt: "2026-08-27"
}
```

All ten fields are required non-empty strings. Dates use `YYYY-MM-DD`; IDs and normalized event signatures are unique; date ranges cannot run backward; source URLs must use HTTPS without embedded credentials; and `verifiedAt` cannot be in the future. See [CONTRIBUTING.md](CONTRIBUTING.md) before changing records.

## Validation

Run the complete local contract before submitting a change:

```bash
npm run check
```

This executes the Node test suite and validates event fields, unique IDs and factual signatures, dates, classifications, credential-free HTTPS sources, verification dates, and chronological ordering. Individual commands are also available:

```bash
npm test
npm run validate:data
```

The real-browser regression is a separate contributor check. Install the exact development lockfile and Chromium, then run it with:

```bash
npm ci
npx playwright install chromium
npm run test:browser
```

It exercises the calendar in Chromium at desktop and narrow mobile viewports, including navigation, responsive overflow, detail-dialog focus behavior, safe source links, and runtime event metadata.

## Architecture

```text
index.html
  -> css/app.css               visual system and responsive layout
  -> js/lunar.js               Intl-based lunar annotation adapter
  -> js/data.js                EVENTS and optional HOLIDAYS records
  -> js/event-utils.js         pure lookup, URL, label, and JSON-LD helpers
  -> js/app.js                 rendering, navigation, and dialog behavior

scripts/validate-data.js       command-line data validation
browser/calendar-regression.mjs real Chromium regression check
test/                          Node built-in test suite
```

The browser consumes `EVENTS` as a global, while CommonJS exports let the same records and utilities be checked under Node. `js/lunar.js` derives optional lunar month, day, cyclical-year, zodiac, and weekday annotations from the browser-standard `Intl.DateTimeFormat` Chinese calendar. External event values are rendered with DOM text APIs, and source links are accepted only after HTTPS URL validation.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md), then use the structured event or correction issue form when appropriate. A typical data contribution is:

1. Confirm the announcement on an official or primary HTTPS page.
2. Add or correct the record in `js/data.js` without changing factual meaning.
3. Run `npm run check`.
4. Open a focused pull request and complete the source-policy checklist.

Participation is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). Please report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

## Roadmap

- Expand coverage only through reviewed, primary-source-backed records.
- Add source re-verification reminders and availability checks while retaining human review.
- Broaden accessibility and cross-browser regression coverage.
- Improve filtering and export only where the source and validation contracts remain auditable.

Roadmap items are intentions, not commitments or descriptions of current functionality.

## Limitations

- The current dataset contains only three verified 2026 FOMC records; it is not a comprehensive market schedule.
- Official announcements can change after `verifiedAt`; users should follow the linked source for the latest information.
- Holiday support exists in the renderer, but `HOLIDAYS` is currently empty.
- Lunar annotations depend on the runtime's `Intl` Chinese-calendar support. When that API is unavailable or cannot parse a date, the interface falls back to Gregorian context; solar terms and cyclical month/day labels are intentionally not provided.
- The project does not provide investment advice, price predictions, security rankings, alerts, or trading recommendations.

## Project Documents

- [Contributing guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security policy](SECURITY.md)
- [Changelog](CHANGELOG.md)
- [Citation metadata](CITATION.cff)
- [MIT License](LICENSE)

## Citation

Use the metadata in [CITATION.cff](CITATION.cff) when citing the software. In prose, identify it as *A-Share Events Calendar* and include the repository URL and version used.

## License

The project is licensed under the [MIT License](LICENSE).
