# 架构与验证

## 运行时结构

```text
index.html
  -> css/app.css                视觉系统和响应式布局
  -> js/lunar.js                基于 Intl 的农历注释适配器
  -> js/data.js                 EVENTS 和可选 HOLIDAYS 记录
  -> js/event-utils.js          查找、URL、标签和 JSON-LD 辅助函数
  -> js/app.js                  渲染、导航和详情对话框行为

scripts/validate-data.js        命令行数据验证
browser/calendar-regression.mjs 真实 Chromium 回归检查
test/                           Node 内置测试套件
```

项目使用浏览器原生 HTML、CSS 和 JavaScript，无生产依赖或构建步骤。浏览器读取全局 `EVENTS`，CommonJS 导出让 Node 检查同一批数据和辅助函数。外部事件值通过 DOM 文本 API 渲染，来源链接只有在 HTTPS 验证通过后才会使用。

农历注释来自浏览器标准 `Intl.DateTimeFormat` 的中国农历支持；不提供节气及干支月、日。运行环境不支持该 API 时，界面回退到公历信息。

当前渲染器支持节假日元数据，但 `HOLIDAYS` 目前为空。

## 验证层次

| 命令 | 覆盖内容 |
| --- | --- |
| `npm test` | 数据契约、工具函数、JSON-LD、渲染安全和元数据测试 |
| `npm run validate:data` | 生产事件字段、日期、分类、来源和排序 |
| `npm run check` | 上述两项完整组合 |
| `npm run test:browser` | Chromium 桌面/移动端布局、导航、焦点和线上交互契约 |

GitHub Actions 的 `Validate` 工作流会运行 Node/数据契约和 Chromium 回归；`Deploy Pages` 工作流会运行 Node/数据契约并检查发布目录后部署 Pages。发布版本 `v1.0.0` 已通过本地和 CI 验证。

## SEO 与 AI 发现

站点提供规范链接、Open Graph 元数据、schema.org JSON-LD、`sitemap.xml`、`robots.txt` 和 `llms.txt`。这些文件帮助搜索引擎与 AI 工具理解项目身份、来源政策和限制，但不替代事实核验。

## English

### Runtime Structure

The project uses browser-native HTML, CSS, and JavaScript with no production dependencies or build step. The browser consumes global `EVENTS`; CommonJS exports let Node test the same records and helpers. External event values use DOM text APIs, and source links are accepted only after HTTPS validation.

Lunar annotations use the browser-standard Chinese-calendar support in `Intl.DateTimeFormat`. Solar terms and cyclical month/day labels are intentionally out of scope. Unsupported runtimes fall back to Gregorian context.

The renderer supports holiday metadata, but `HOLIDAYS` is currently empty.

### Validation Layers

| Command | Coverage |
| --- | --- |
| `npm test` | Data contract, utilities, JSON-LD, rendering safety, and metadata tests |
| `npm run validate:data` | Production fields, dates, categories, sources, and ordering |
| `npm run check` | The two checks above as one contract |
| `npm run test:browser` | Chromium desktop/mobile layout, navigation, focus, and interaction contracts |

The `Validate` workflow runs the Node/data contract and Chromium regression. The `Deploy Pages` workflow runs the Node/data contract and checks the publish directory before deployment. Release `v1.0.0` passed local and CI validation.

### SEO And AI Discovery

The site publishes canonical, Open Graph, schema.org JSON-LD, `sitemap.xml`, `robots.txt`, and `llms.txt` metadata. These help search engines and AI tools understand project identity, source policy, and limits; they do not replace fact checking.
