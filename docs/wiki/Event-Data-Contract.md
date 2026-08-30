# 事件数据契约

事件记录位于 `js/data.js` 的 `EVENTS` 数组中，并按 `startDate` 排序。每条记录必须包含以下 10 个字段：

| 字段 | 要求 |
| --- | --- |
| `id` | 稳定、唯一、全小写的标识符 |
| `title` | 简洁、事实性的标题 |
| `startDate` | 有效的 `YYYY-MM-DD` 日期 |
| `endDate` | 不早于 `startDate` 的有效日期 |
| `category` | `macro`、`policy`、`market`、`industry`、`company` 或 `product` |
| `description` | 由来源支持的简短事实摘要 |
| `status` | `confirmed`、`postponed` 或 `cancelled` |
| `sourceName` | 官方或一手发布者名称 |
| `sourceUrl` | 无嵌入凭据的 HTTPS 直接来源链接 |
| `verifiedAt` | `YYYY-MM-DD` 格式且不晚于当前日期的核验日期 |

## 示例

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

## 校验规则

- `id` 唯一，且不能含大写字母或空白。
- 规范化事件签名必须唯一，避免同一事实以不同格式重复出现。
- 日期必须有效，区间不能倒序。
- 来源必须使用 HTTPS，不得包含用户名、密码或其他嵌入凭据。
- `verifiedAt` 不能是未来日期。
- `postponed` 和 `cancelled` 记录保留在数据中，以便审计状态变化。

使用 `npm run validate:data` 检查生产数据，使用 `npm test` 检查字段、工具函数、JSON-LD 和渲染安全契约。

## English

Events live in the `EVENTS` array in `js/data.js`, ordered by `startDate`. Each record requires these ten fields:

| Field | Requirement |
| --- | --- |
| `id` | Stable, unique, lowercase identifier |
| `title` | Concise factual title |
| `startDate` | Valid `YYYY-MM-DD` date |
| `endDate` | Valid date on or after `startDate` |
| `category` | `macro`, `policy`, `market`, `industry`, `company`, or `product` |
| `description` | Short factual summary supported by the source |
| `status` | `confirmed`, `postponed`, or `cancelled` |
| `sourceName` | Official or primary publisher name |
| `sourceUrl` | Direct HTTPS source without embedded credentials |
| `verifiedAt` | `YYYY-MM-DD` review date that is not in the future |

### Example

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

### Validation Rules

- IDs are unique, lowercase, and contain no whitespace.
- Normalized event signatures are unique to prevent factual duplicates.
- Dates must be valid and ranges cannot run backward.
- Sources must use HTTPS without embedded usernames, passwords, or credentials.
- `verifiedAt` cannot be in the future.
- Postponed and cancelled records remain available so status changes are auditable.

Use `npm run validate:data` for production data and `npm test` for the field, utility, JSON-LD, and rendering-safety contracts.
