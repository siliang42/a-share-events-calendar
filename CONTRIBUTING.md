# Contributing

Thank you for helping improve A-Share Events Calendar. Contributions are reviewed for factual accuracy, source quality, accessibility, and maintainability.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md). Security vulnerabilities must be reported privately under [SECURITY.md](SECURITY.md), not through a public issue or pull request.

## Before You Start

- Search existing issues and pull requests for the same event or correction.
- Use the event proposal form for a new record and the correction form for an existing record when discussion is useful.
- Keep pull requests focused on one coherent change.
- Do not include investment recommendations, predictions, inferred dates, or promotional language.

## Source Policy

Every event record requires a directly relevant official or primary HTTPS source. Suitable sources include government agencies, regulators, exchanges, listed companies, event organizers, and the original publisher of an announcement.

Secondary news coverage, aggregators, social posts, search-result snippets, and copied calendars are not sufficient evidence. They may be used to locate a primary source, but the submitted `sourceUrl` must point to the primary HTTPS page. If no qualifying source is available, do not add the event.

Descriptions must summarize what the source states without speculation. Use `postponed` or `cancelled` only when the primary source supports that status.

## Event Contract

Add records to the `EVENTS` array in `js/data.js`. Each record requires:

| Field | Requirement |
| --- | --- |
| `id` | Stable, unique, lowercase identifier. |
| `title` | Concise factual title. |
| `startDate` | Valid `YYYY-MM-DD` date. |
| `endDate` | Valid `YYYY-MM-DD` date on or after `startDate`. |
| `category` | `macro`, `policy`, `market`, `industry`, `company`, or `product`. |
| `description` | Short factual summary supported by the source. |
| `status` | `confirmed`, `postponed`, or `cancelled`. |
| `sourceName` | Name of the official or primary publisher. |
| `sourceUrl` | Directly relevant HTTPS URL without embedded credentials. |
| `verifiedAt` | Date the source was checked, in `YYYY-MM-DD` format and not in the future. |

Keep the array ordered by `startDate`. Do not remove a postponed or cancelled event solely because it will no longer occur; update its status and evidence so the record remains auditable.

## Development And Validation

The application has no production dependencies or build step. Open `index.html` in a modern browser to inspect the UI. Node.js 20 or later is required for checks.

Run the complete project contract before every pull request:

```bash
npm run check
```

The command runs the Node test suite and event-data validator. For UI-affecting changes, also inspect desktop and mobile layouts, keyboard navigation, dialog focus behavior, and official source links.

## Pull Requests

1. Create a focused branch and make the smallest change that satisfies the issue.
2. Add or update tests when behavior or validation rules change.
3. Run `npm run check` and resolve all failures.
4. Complete the pull request template, including the source-policy confirmation.
5. Respond to review with source evidence or a clear technical explanation.

Maintainers may request a narrower scope, stronger primary evidence, clearer prose, or additional verification before merging.
