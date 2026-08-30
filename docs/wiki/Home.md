# A 股事件驱动研究日历 Wiki

> 面向研究人员、分析师与开发者的来源可审计 A 股事件日历文档。当前发布版本：**v1.0.0**。

## 项目定位

[A-Share Events Calendar](https://github.com/siliang42/a-share-events-calendar) 是一个轻量、无构建步骤的开源日历，用于查阅与 A 股研究相关的政策、宏观、市场、行业、公司和产品事件。

本项目把“日期”与“证据”放在同一个记录中：每条事件都必须包含一手来源、来源链接和最近核验日期。它适合研究准备和事实核对，不是投资建议、交易信号或完整市场日程。

## 当前状态

| 项目 | 状态 |
| --- | --- |
| 版本 | `v1.0.0` |
| 运行时事件 | 3 条已核验的 2026 年 FOMC 会议记录，作为影响 A 股研究的外部宏观事件示例 |
| 节假日元数据 | 渲染器支持，当前 `HOLIDAYS` 为空 |
| 部署 | [GitHub Pages](https://siliang42.github.io/a-share-events-calendar/) |
| 许可证 | [MIT](https://github.com/siliang42/a-share-events-calendar/blob/main/LICENSE) |
| 校验 | Node 契约、数据校验与 Chromium 回归均纳入 CI |

## 文档导航

- [快速开始](Quick-Start) / [Quick Start](Quick-Start)
- [事件数据契约](Event-Data-Contract) / [Event Data Contract](Event-Data-Contract)
- [来源与编辑政策](Source-and-Editorial-Policy) / [Source And Editorial Policy](Source-and-Editorial-Policy)
- [架构与验证](Architecture-and-Validation) / [Architecture And Validation](Architecture-and-Validation)
- [贡献指南](Contributing) / [Contributing](Contributing)
- [常见问题](FAQ) / [FAQ](FAQ)

## 重要边界

- 支持的分类描述数据契约，不代表当前已经覆盖所有 A 股市场事件。
- 官方公告可能在 `verifiedAt` 之后变化；最新事实以事件链接中的来源为准。
- 传闻、推断日期、预测、无来源估计和证券排名不纳入项目。
- 安全问题请通过[私密安全报告](https://github.com/siliang42/a-share-events-calendar/security/advisories/new)提交，不要公开创建 Issue 或 PR。

## English

### Project Positioning

[A-Share Events Calendar](https://github.com/siliang42/a-share-events-calendar) is a small, build-free open-source calendar for reviewing policy, macro, market, industry, company, and product events relevant to A-share research.

The project keeps the date and its evidence together: every event requires a primary source, a source URL, and a latest verification date. It supports research preparation and fact checking; it is not investment advice, a trading signal, or a comprehensive market schedule.

### Current State

| Item | Status |
| --- | --- |
| Version | `v1.0.0` |
| Runtime events | Three verified 2026 Federal Open Market Committee meeting records, used as external macro-event examples relevant to A-share research |
| Holiday metadata | Supported by the renderer; `HOLIDAYS` is currently empty |
| Deployment | [GitHub Pages](https://siliang42.github.io/a-share-events-calendar/) |
| License | [MIT](https://github.com/siliang42/a-share-events-calendar/blob/main/LICENSE) |
| Validation | Node contract, data validation, and Chromium regression checks run in CI |

### Boundaries

- Supported categories describe the data contract, not current A-share market coverage.
- Official announcements can change after `verifiedAt`; follow the linked source for current facts.
- Rumors, inferred dates, predictions, unsourced estimates, and security rankings are excluded.
- Report security issues through the [private security advisory form](https://github.com/siliang42/a-share-events-calendar/security/advisories/new), not a public issue or pull request.

## 相关链接

- [代码仓库](https://github.com/siliang42/a-share-events-calendar)
- [在线演示](https://siliang42.github.io/a-share-events-calendar/)
- [v1.0.0 Release](https://github.com/siliang42/a-share-events-calendar/releases/tag/v1.0.0)
- [README（中文）](https://github.com/siliang42/a-share-events-calendar/blob/main/README.zh-CN.md) / [README (English)](https://github.com/siliang42/a-share-events-calendar/blob/main/README.md)
