const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const EventUtils = require("../js/event-utils.js");

function event(overrides) {
    return {
        id: "event-a",
        title: "Sample event",
        startDate: "2026-09-15",
        endDate: "2026-09-16",
        category: "policy",
        description: "A scheduled sample event.",
        status: "confirmed",
        sourceName: "Official source",
        sourceUrl: "https://example.gov/events/sample",
        verifiedAt: "2026-08-27",
        ...overrides
    };
}

function contrastRatio(left, right) {
    function luminance(hex) {
        const channels = hex.match(/[0-9a-f]{2}/gi).map((channel) => {
            const value = Number.parseInt(channel, 16) / 255;
            return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    }

    const brighter = Math.max(luminance(left), luminance(right));
    const darker = Math.min(luminance(left), luminance(right));
    return (brighter + 0.05) / (darker + 0.05);
}

test("formatDateKey normalizes zero-based calendar parts", () => {
    assert.equal(EventUtils.formatDateKey(2026, 0, 5), "2026-01-05");
    assert.equal(EventUtils.formatDateKey(2026, 8, 15), "2026-09-15");
});

test("eventsOnDate includes both ends of a multi-day event and orders a cloned result chronologically", () => {
    const later = event({ id: "later", startDate: "2026-09-16", endDate: "2026-09-18" });
    const earlier = event({ id: "earlier", startDate: "2026-09-15", endDate: "2026-09-17" });
    const events = [later, earlier];

    assert.deepEqual(
        EventUtils.eventsOnDate(events, "2026-09-16").map((item) => item.id),
        ["earlier", "later"]
    );
    assert.deepEqual(EventUtils.eventsOnDate(events, "2026-09-15").map((item) => item.id), ["earlier"]);
    assert.deepEqual(EventUtils.eventsOnDate(events, "2026-09-18").map((item) => item.id), ["later"]);
    assert.deepEqual(EventUtils.eventsOnDate(events, "2026-09-19"), []);
    assert.deepEqual(events.map((item) => item.id), ["later", "earlier"]);
});

test("isSafeSourceUrl accepts official HTTPS URLs and rejects unsafe or malformed URLs", () => {
    assert.equal(EventUtils.isSafeSourceUrl("https://www.gov.cn/zhengce/"), true);

    for (const value of [
        "javascript:alert(1)",
        "http://www.gov.cn/zhengce/",
        "https://user:password@www.gov.cn/zhengce/",
        "https://user@www.gov.cn/zhengce/",
        "https://",
        "not a url"
    ]) {
        assert.equal(EventUtils.isSafeSourceUrl(value), false, value);
    }
});

test("toSafeSourceUrl returns a normalized HTTPS href or null", () => {
    assert.equal(EventUtils.toSafeSourceUrl("https://www.gov.cn"), "https://www.gov.cn/");
    assert.equal(EventUtils.toSafeSourceUrl("javascript:alert(1)"), null);
    assert.equal(EventUtils.toSafeSourceUrl("http://www.gov.cn"), null);
    assert.equal(EventUtils.toSafeSourceUrl(undefined), null);
});

test("statusLabel provides Chinese labels for every supported status", () => {
    assert.equal(EventUtils.statusLabel("confirmed"), "已确认");
    assert.equal(EventUtils.statusLabel("postponed"), "已延期");
    assert.equal(EventUtils.statusLabel("cancelled"), "已取消");
});

test("categoryLabel provides Chinese labels for every supported category", () => {
    assert.equal(EventUtils.categoryLabel("macro"), "宏观");
    assert.equal(EventUtils.categoryLabel("policy"), "政策");
    assert.equal(EventUtils.categoryLabel("market"), "市场");
    assert.equal(EventUtils.categoryLabel("industry"), "行业");
    assert.equal(EventUtils.categoryLabel("company"), "公司");
    assert.equal(EventUtils.categoryLabel("product"), "产品");
});

test("buildEventJsonLd returns schema.org JSON-LD with a safe source URL", () => {
    assert.deepEqual(EventUtils.buildEventJsonLd(event()), {
        "@context": "https://schema.org",
        "@type": "Event",
        name: "Sample event",
        description: "A scheduled sample event.",
        startDate: "2026-09-15",
        endDate: "2026-09-16",
        eventStatus: "https://schema.org/EventScheduled",
        url: "https://example.gov/events/sample"
    });
});

test("buildEventJsonLd maps non-confirmed statuses and omits unsafe URLs", () => {
    assert.equal(
        EventUtils.buildEventJsonLd(event({ status: "postponed" })).eventStatus,
        "https://schema.org/EventPostponed"
    );
    assert.equal(
        EventUtils.buildEventJsonLd(event({ status: "cancelled" })).eventStatus,
        "https://schema.org/EventCancelled"
    );

    const jsonLd = EventUtils.buildEventJsonLd(event({ sourceUrl: "javascript:alert(1)" }));
    assert.equal(Object.hasOwn(jsonLd, "url"), false);
});

test("buildEventJsonLd rejects unsupported or missing statuses", () => {
    assert.equal(EventUtils.buildEventJsonLd(event({ status: "draft" })), null);

    const missingStatus = event();
    delete missingStatus.status;
    assert.equal(EventUtils.buildEventJsonLd(missingStatus), null);
});

test("application renderer uses text APIs and guards source links", () => {
    const appSource = fs.readFileSync(path.join(__dirname, "../js/app.js"), "utf8");
    const createEventItemSource = appSource.slice(
        appSource.indexOf("function createEventItem"),
        appSource.indexOf("function renderEvents")
    );

    assert.doesNotMatch(appSource, /\.innerHTML\s*=/);
    assert.doesNotMatch(createEventItemSource, /\.href\s*=\s*event(?:\.|\[)/);
    assert.match(createEventItemSource, /var safeSourceUrl = EventUtils\.toSafeSourceUrl\(event\.sourceUrl\);/);
    assert.match(createEventItemSource, /sourceLink\.href = safeSourceUrl;/);
});

test("calendar day controls retain native button semantics", () => {
    const appSource = fs.readFileSync(path.join(__dirname, "../js/app.js"), "utf8");

    assert.match(appSource, /document\.createElement\("button"\)/);
    assert.doesNotMatch(appSource, /setAttribute\("role",\s*"gridcell"\)/);
});

test("application shell prevents an automatic missing favicon request", () => {
    const indexSource = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");

    assert.match(indexSource, /<link rel="icon" href="data:,">/);
});

test("application identity visibly includes both exact product names", () => {
    const indexSource = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
    const bodySource = indexSource.match(/<body>[\s\S]*<\/body>/)?.[0] || "";

    assert.match(bodySource, />\s*A-Share Events Calendar\s*</);
    assert.match(bodySource, />\s*A 股事件驱动研究日历\s*</);
});

test("application shell exposes the approved Doubao visual hooks", () => {
    const indexSource = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");

    assert.match(indexSource, /class="brand-lockup"/);
    assert.match(indexSource, /class="brand-mark"\s+aria-hidden="true"/);
    assert.match(indexSource, /class="month-navigation"/);
    assert.match(indexSource, /class="calendar-panel"/);
    assert.match(indexSource, /id="prev-month"[^>]*aria-label="查看上个月"/);
    assert.match(indexSource, /id="next-month"[^>]*aria-label="查看下个月"/);
    assert.match(indexSource, />\s*A-Share Events Calendar\s*</);
    assert.match(indexSource, />\s*A 股事件驱动研究日历\s*</);
    assert.doesNotMatch(indexSource, /祥云|auspicious-cloud|cloud-ornament/);
});

test("Doubao visual system preserves approved tokens and calendar state contracts", () => {
    const cssSource = fs.readFileSync(path.join(__dirname, "../css/app.css"), "utf8");
    const appSource = fs.readFileSync(path.join(__dirname, "../js/app.js"), "utf8");

    for (const [token, value] of [
        ["--brand-red", "#ed1b2f"],
        ["--brand-red-soft", "#fff1f2"],
        ["--page-bg", "#fff8f6"],
        ["--surface", "#ffffff"],
        ["--text", "#202431"],
        ["--muted", "#68707f"],
        ["--border", "#dfe2e7"],
        ["--verified", "#28624f"]
    ]) {
        assert.match(cssSource, new RegExp(token + "\\s*:\\s*" + value, "i"));
    }

    assert.match(cssSource, /\.weekday\.is-weekend/);
    assert.match(cssSource, /\.day-cell\.is-weekend/);
    assert.match(cssSource, /\.day-cell\.is-today[^{]*\{[^}]*var\(--brand-red\)/s);
    assert.match(cssSource, /\.event-source-row a[^{]*\{[^}]*var\(--verified\)/s);
    assert.match(cssSource, /\.calendar-panel[^{]*\{[^}]*border-radius:\s*14px/s);
    assert.match(cssSource, /\.day-cell[^{]*\{[^}]*border-radius:\s*8px/s);
    assert.doesNotMatch(cssSource, /linear-gradient|radial-gradient|cloud|祥云/i);

    assert.match(appSource, /weekdayIndex/);
    assert.match(appSource, /weekday\.classList\.add\("is-weekend"\)/);
    assert.match(appSource, /button\.classList\.add\("is-weekend"\)/);
});

test("lunar festivals receive an independent red supporting-text state", () => {
    const cssSource = fs.readFileSync(path.join(__dirname, "../css/app.css"), "utf8");
    const appSource = fs.readFileSync(path.join(__dirname, "../js/app.js"), "utf8");

    assert.match(appSource, /"7-15"\s*:\s*"中元节"/);
    assert.match(appSource, /if \(meta\.festivals\.length\)\s*\{\s*button\.classList\.add\("is-festival"\);\s*\}/s);
    assert.match(cssSource, /\.day-cell\.is-festival \.day-note\s*\{[^}]*color:\s*var\(--brand-red-text\);/s);
    assert.match(cssSource, /\.identity-kicker\s*\{[^}]*color:\s*var\(--muted\);/s);
});

test("small red text uses an AA-contrast token instead of the graphic brand red", () => {
    const cssSource = fs.readFileSync(path.join(__dirname, "../css/app.css"), "utf8");
    const textRed = cssSource.match(/--brand-red-text:\s*(#[0-9a-f]{6})/i)?.[1];
    const surface = cssSource.match(/--surface:\s*(#[0-9a-f]{6})/i)?.[1];
    const softRed = cssSource.match(/--brand-red-soft:\s*(#[0-9a-f]{6})/i)?.[1];
    const holidayFlagRule = cssSource.match(/\.holiday-flag\s*\{([^}]*background[^}]*)\}/)?.[1] || "";
    const holidayBackgroundToken = holidayFlagRule.match(/background:\s*var\(--([a-z0-9-]+)\)/i)?.[1];
    const holidayBackground = cssSource.match(
        new RegExp(`--${holidayBackgroundToken}:\\s*(#[0-9a-f]{6})`, "i")
    )?.[1];
    const holidayContrast = contrastRatio(surface, holidayBackground);

    assert.ok(textRed, "the derived text-red token must be defined");
    assert.ok(contrastRatio(textRed, surface) >= 4.5, "text red must be AA on the surface");
    assert.ok(contrastRatio(textRed, softRed) >= 4.5, "text red must be AA on the soft-red surface");
    assert.match(holidayFlagRule, /color:\s*var\(--surface\)/);
    assert.ok(
        holidayContrast >= 4.5,
        `holiday badge text contrast is ${holidayContrast.toFixed(3)}:1; expected at least 4.5:1`
    );
    assert.match(holidayFlagRule, /background:\s*var\(--brand-red-text\)/);
    assert.doesNotMatch(cssSource, /(?:^|[;{])\s*color:\s*var\(--brand-red\)\s*;/m);
});

test("calendar cells use an opaque inset focus indicator with at least 3:1 contrast", () => {
    const cssSource = fs.readFileSync(path.join(__dirname, "../css/app.css"), "utf8");
    const focusRule = cssSource.match(/\.day-cell:focus-visible\s*\{([^}]*)\}/)?.[1] || "";
    const focusColor = cssSource.match(/--data-blue:\s*(#[0-9a-f]{6})/i)?.[1];

    assert.match(focusRule, /outline:\s*none;/);
    assert.match(focusRule, /box-shadow:\s*inset 0 0 0 [34]px var\(--data-blue\);/);
    assert.ok(contrastRatio(focusColor, "#ffffff") >= 3, "focus color must contrast with current-month cells");
    assert.ok(contrastRatio(focusColor, "#eef1ef") >= 3, "focus color must contrast with spillover cells");
});

test("resolveCalendarDate preserves lunar data returned as an object", () => {
    const lunar = { ncWeek: "星期一", IMonthCn: "七月", IDayCn: "十九" };
    const engine = { solar2lunar: () => lunar };

    assert.deepEqual(EventUtils.resolveCalendarDate(engine, 2026, 7, 31), {
        lunar,
        weekday: "星期一"
    });
});

test("resolveCalendarDate falls back to the Gregorian weekday for non-object lunar results", () => {
    for (const result of [-1, null, undefined, "unsupported"]) {
        const engine = { solar2lunar: () => result };
        assert.deepEqual(EventUtils.resolveCalendarDate(engine, 2101, 0, 1), {
            lunar: null,
            weekday: "星期六"
        });
    }
});
