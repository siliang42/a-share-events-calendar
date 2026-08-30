# 贡献指南

## 开始前

- 先搜索已有 Issue 和 Pull Request，避免重复提交。
- 新事件使用[事件提案表单](https://github.com/siliang42/a-share-events-calendar/issues/new?template=event.yml)，现有记录更正使用[更正表单](https://github.com/siliang42/a-share-events-calendar/issues/new?template=correction.yml)。
- 每个 Pull Request 保持一个清晰、可审查的变更范围。
- 不提交投资建议、预测、推断日期或宣传性描述。

## 数据贡献流程

1. 在官方或一手 HTTPS 页面确认公告。
2. 在 `js/data.js` 中新增或更正记录，保持事实含义不变。
3. 运行 `npm run check`，必要时运行 `npm run test:browser`。
4. 在 Pull Request 中填写来源政策检查表，并链接原始证据。

## 代码与文档贡献

UI 变更应检查桌面和移动端布局、键盘导航、详情对话框焦点和来源链接。文档变更应保持中英内容一致、链接可达，并避免把当前数据范围写成完整市场覆盖。

安全漏洞必须按照 [SECURITY.md](https://github.com/siliang42/a-share-events-calendar/blob/main/SECURITY.md) 私下报告，不要通过公开 Issue、Pull Request 或 Discussion 披露。

社区参与遵循[行为准则](https://github.com/siliang42/a-share-events-calendar/blob/main/CODE_OF_CONDUCT.md)。

## English

### Before You Start

- Search existing issues and pull requests before opening a new one.
- Use the [event proposal form](https://github.com/siliang42/a-share-events-calendar/issues/new?template=event.yml) for a new record and the [correction form](https://github.com/siliang42/a-share-events-calendar/issues/new?template=correction.yml) for an existing record.
- Keep each pull request focused and reviewable.
- Do not submit investment advice, predictions, inferred dates, or promotional descriptions.

### Data Contribution Flow

1. Confirm the announcement on an official or primary HTTPS page.
2. Add or correct the record in `js/data.js` without changing its factual meaning.
3. Run `npm run check` and, when UI behavior changes, `npm run test:browser`.
4. Complete the source-policy checklist and link the primary evidence in the pull request.

UI changes should cover desktop/mobile layout, keyboard navigation, dialog focus, and source links. Documentation changes should keep Chinese and English sections aligned and should not describe the current dataset as comprehensive market coverage.

Report vulnerabilities privately as described in [SECURITY.md](https://github.com/siliang42/a-share-events-calendar/blob/main/SECURITY.md). Community participation follows the [Code of Conduct](https://github.com/siliang42/a-share-events-calendar/blob/main/CODE_OF_CONDUCT.md).
