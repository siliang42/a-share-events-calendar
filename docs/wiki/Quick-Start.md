# 快速开始

## 1. 运行在线版本

打开 [GitHub Pages 在线演示](https://siliang42.github.io/a-share-events-calendar/)。页面支持月视图、农历注释、日期详情、跨日事件和官方来源链接。

## 2. 本地运行

项目没有生产依赖或构建步骤。克隆后直接用现代浏览器打开 `index.html`：

```bash
git clone https://github.com/siliang42/a-share-events-calendar.git
cd a-share-events-calendar
open index.html
```

没有 macOS `open` 命令时，可从文件浏览器打开 `index.html`。

## 3. 安装验证环境

运行验证需要 Node.js 20 或更高版本。真实浏览器回归使用锁定版本的 Playwright 和 Chromium：

```bash
npm ci
npx playwright install chromium
```

## 4. 执行检查

提交变更前运行：

```bash
npm run check
npm run test:browser
```

`npm run check` 运行 Node 测试与事件数据校验；`npm run test:browser` 覆盖桌面和窄屏移动端日历、导航、详情对话框焦点、来源链接和运行时元数据。

## 5. 查阅事件

1. 使用上月、下月或“回到今天”导航。
2. 点击日期查看当天事件详情。
3. 阅读事件状态、事实描述、来源名称和 `verifiedAt`。
4. 点击官方来源，按原始公告核对最新信息。

## English

### 1. Open The Live Version

Use the [GitHub Pages demo](https://siliang42.github.io/a-share-events-calendar/). It provides a monthly view, lunar annotations, date details, multi-day events, and official source links.

### 2. Run Locally

The project has no production dependencies or build step. Clone it and open `index.html` in a modern browser:

```bash
git clone https://github.com/siliang42/a-share-events-calendar.git
cd a-share-events-calendar
open index.html
```

On other platforms, open `index.html` from a file browser.

### 3. Install Validation Tools

Validation requires Node.js 20 or later. Browser regression uses the locked Playwright version and Chromium:

```bash
npm ci
npx playwright install chromium
```

### 4. Run Checks

```bash
npm run check
npm run test:browser
```

### 5. Inspect An Event

1. Navigate with previous, next, or return-to-today controls.
2. Select a date to open its event details.
3. Review status, factual description, source name, and `verifiedAt`.
4. Follow the official source and confirm the latest announcement.
