---
name: a-share-events-calendar
description: Maintain the source-backed data and documentation for A-Share Events Calendar, a browser-native calendar of officially announced events relevant to A-share research.
---

# A-Share Events Calendar

Use this skill when adding, correcting, reviewing, or explaining event records in the A-Share Events Calendar repository.

- Repository: https://github.com/siliang42/a-share-events-calendar
- GitHub Pages deployment target (not yet verified): https://siliang42.github.io/a-share-events-calendar/

The browser uses a zero-dependency `Intl.DateTimeFormat` adapter for optional Chinese-calendar annotations. Treat lunar month, day, cyclical-year, zodiac, and weekday values as runtime annotations; do not claim solar-term or cyclical month/day support.

## Data Contract

Maintain event records in the `EVENTS` array in `js/data.js`. Every record must contain these non-empty string fields:

```js
{
    id: "unique-stable-id",
    title: "Official event title",
    startDate: "YYYY-MM-DD",
    endDate: "YYYY-MM-DD",
    category: "macro | policy | market | industry | company | product",
    description: "Short factual description.",
    status: "confirmed | postponed | cancelled",
    sourceName: "Official source name",
    sourceUrl: "https://official.example/path",
    verifiedAt: "YYYY-MM-DD"
}
```

IDs must be unique, records must be ordered by `startDate`, and `endDate` cannot precede `startDate`. `verifiedAt` records when the cited page was last checked and cannot be a future date.

## Official-Source Policy

Include an event only when an official body or primary publisher provides a directly relevant HTTPS source. Use secondary coverage only to locate that source. Keep the title and description factual, and update the status when the primary source announces a postponement or cancellation.

Do not add predictions, inferred dates, secondary-source-only claims, or investment recommendations.

## Maintenance Workflow

1. Open the primary HTTPS source and confirm its title, dates, status, and publisher.
2. Add or update the `EVENTS` record while preserving chronological order.
3. Set `verifiedAt` to the date the primary source was checked.
4. Run the complete project contract:

```bash
npm run check
```

5. Review the rendered date detail to confirm labels, dates, source link, and accessible interaction.
6. Follow `CONTRIBUTING.md` and complete the pull-request source-policy checklist.

The data contract supports `macro`, `policy`, `market`, `industry`, `company`, and `product` categories, plus `confirmed`, `postponed`, and `cancelled` statuses. These supported values do not imply that every category currently has records.
