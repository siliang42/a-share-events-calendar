const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");
const LUNAR_SOURCE = fs.readFileSync(path.join(ROOT, "js/lunar.js"), "utf8");
const calendar = require("../js/lunar.js");

test("solar2lunar converts 2026-08-27 with honest year context", () => {
    const lunar = calendar.solar2lunar(2026, 8, 27);

    assert.deepEqual(
        {
            lMonth: lunar.lMonth,
            lDay: lunar.lDay,
            IMonthCn: lunar.IMonthCn,
            IDayCn: lunar.IDayCn,
            gzYear: lunar.gzYear,
            Animal: lunar.Animal,
            ncWeek: lunar.ncWeek,
            isLeap: lunar.isLeap,
            isTerm: lunar.isTerm
        },
        {
            lMonth: 7,
            lDay: 15,
            IMonthCn: "七月",
            IDayCn: "十五",
            gzYear: "丙午",
            Animal: "马",
            ncWeek: "星期四",
            isLeap: false,
            isTerm: false
        }
    );
    assert.equal(Object.hasOwn(lunar, "gzMonth"), false);
    assert.equal(Object.hasOwn(lunar, "gzDay"), false);
    assert.equal(Object.hasOwn(lunar, "Term"), false);
});

test("solar2lunar recognizes Lunar New Year", () => {
    const lunar = calendar.solar2lunar(2026, 2, 17);

    assert.equal(lunar.lMonth, 1);
    assert.equal(lunar.lDay, 1);
    assert.equal(lunar.IMonthCn, "正月");
    assert.equal(lunar.IDayCn, "初一");
});

test("solar2lunar rejects invalid Gregorian dates", () => {
    for (const parts of [
        [2026, 2, 30],
        [2026, 13, 1],
        [2026, 8, 0],
        [2026.5, 8, 27],
        ["2026", 8, 27]
    ]) {
        assert.equal(calendar.solar2lunar(...parts), -1, parts.join("-"));
    }
});

test("lunar adapter exposes CommonJS and browser-global interfaces", () => {
    assert.equal(typeof calendar.solar2lunar, "function");

    const context = { Date, Intl, window: {} };
    vm.runInNewContext(LUNAR_SOURCE, context);

    assert.equal(typeof context.window.calendar.solar2lunar, "function");
    assert.equal(context.window.calendar.solar2lunar(2026, 2, 17).lDay, 1);

    const noIntlContext = { Date, Intl: undefined, window: {} };
    vm.runInNewContext(LUNAR_SOURCE, noIntlContext);
    assert.equal(noIntlContext.window.calendar.solar2lunar(2026, 2, 17), -1);
});

test("MIT project surfaces contain no incompatible upstream provenance claims", () => {
    const files = ["js/lunar.js", "LICENSE", "README.md", "README.zh-CN.md", "SKILL.md"];
    const incompatibleClaim = /jjonline|JJonline|Jea\s*杨|GPL|third-party attribution|upstream attribution|上游署名/i;

    for (const file of files) {
        assert.doesNotMatch(fs.readFileSync(path.join(ROOT, file), "utf8"), incompatibleClaim, file);
    }
});

test("application detail rendering uses only fields supplied by the lunar adapter", () => {
    const appSource = fs.readFileSync(path.join(ROOT, "js/app.js"), "utf8");

    assert.doesNotMatch(appSource, /lunar\.(?:gzMonth|gzDay|Term)\b/);
});
