# 常见问题

## 这是完整的 A 股市场日历吗？

不是。`v1.0.0` 的运行时数据刻意保持较小，目前只有 3 条已核验的 2026 年 FOMC 会议记录。分类字段是可扩展的数据契约，不表示已经覆盖全部市场事件。

## 事件来源如何判断？

每条记录必须指向官方或一手 HTTPS 来源，并记录 `sourceName` 与 `verifiedAt`。二手报道只能用于寻找原始公告。

## 为什么保留延期或取消的事件？

状态变化本身是研究证据。保留记录可以让读者审计原定日期、状态变化和对应公告，而不是只看到最终结果。

## 项目会提供交易建议或价格预测吗？

不会。本项目是来源索引和研究准备工具，不提供投资建议、价格预测、证券排名、交易提醒或买卖建议。

## 为什么本地直接打开页面也能运行？

项目使用浏览器原生 HTML、CSS 和 JavaScript，不需要生产依赖或构建步骤。Node.js 20+ 仅用于测试和数据校验。

## 如何报告安全问题？

使用 GitHub 的[私密安全报告](https://github.com/siliang42/a-share-events-calendar/security/advisories/new)。不要公开创建 Issue、Pull Request 或 Discussion。

## English

### Is This A Complete A-Share Market Calendar?

No. Runtime data in `v1.0.0` is intentionally small and currently contains three verified 2026 FOMC meeting records. Categories are an extensible data contract, not a claim of comprehensive market coverage.

### How Are Sources Reviewed?

Every record points to an official or primary HTTPS source and records `sourceName` and `verifiedAt`. Secondary reporting may help locate the original announcement but is not final evidence.

### Why Keep Postponed Or Cancelled Events?

Status changes are evidence. Keeping the record allows readers to audit the original date, changed status, and supporting announcement.

### Does The Project Offer Trading Advice Or Price Predictions?

No. It is an evidence index and research-preparation tool, not a source of investment advice, price predictions, security rankings, alerts, or trading recommendations.

### How Can I Report A Security Issue?

Use GitHub's [private security advisory form](https://github.com/siliang42/a-share-events-calendar/security/advisories/new). Do not open a public issue, pull request, or discussion.
