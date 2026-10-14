import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const ROOT = path.resolve(import.meta.dirname, "..");
const APP_URL = pathToFileURL(path.join(ROOT, "index.html")).href;
const VIEWPORTS = [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
    { width: 320, height: 720 }
];

function readPngDimensions(filePath) {
    const image = fs.readFileSync(filePath);
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

    assert.equal(image.subarray(0, 8).equals(signature), true, "preview must be a PNG");
    return {
        width: image.readUInt32BE(16),
        height: image.readUInt32BE(20)
    };
}

async function navigateToSeptember2026(page) {
    const monthTitle = page.locator("#month-title");
    await monthTitle.waitFor({ state: "visible" });

    const current = (await monthTitle.textContent()).match(/^(\d{4})年\s+(\d{1,2})月$/);
    assert.ok(current, "calendar must render a parseable month title");

    const currentIndex = Number(current[1]) * 12 + Number(current[2]) - 1;
    const targetIndex = 2026 * 12 + 8;
    const offset = targetIndex - currentIndex;
    const control = page.locator(offset < 0 ? "#prev-month" : "#next-month");

    for (let step = 0; step < Math.abs(offset); step += 1) {
        await control.click();
    }
    await assert.doesNotReject(monthTitle.waitFor({ state: "visible" }));
    assert.equal(await monthTitle.textContent(), "2026年 9月");
}

async function assertNoHorizontalOverflow(page, label) {
    const overflow = await page.evaluate(() => ({
        body: document.body.scrollWidth - window.innerWidth,
        document: document.documentElement.scrollWidth - window.innerWidth
    }));

    assert.ok(overflow.body <= 0, `${label}: body overflows by ${overflow.body}px`);
    assert.ok(overflow.document <= 0, `${label}: document overflows by ${overflow.document}px`);
}

test("preview PNG is exactly 1600x900", () => {
    assert.deepEqual(readPngDimensions(path.join(ROOT, "assets/preview.png")), {
        width: 1600,
        height: 900
    });
});

test("Chromium calendar regression", async (suite) => {
    const browser = await chromium.launch({ headless: true });
    suite.after(() => browser.close());

    for (const viewport of VIEWPORTS) {
        await suite.test(`${viewport.width}x${viewport.height}`, async () => {
            const context = await browser.newContext({ viewport });
            const page = await context.newPage();
            const consoleProblems = [];

            page.on("console", (message) => {
                if (message.type() === "warning" || message.type() === "error") {
                    consoleProblems.push(`${message.type()}: ${message.text()}`);
                }
            });
            page.on("pageerror", (error) => consoleProblems.push(`pageerror: ${error.message}`));

            await page.goto(APP_URL, { waitUntil: "load" });
            const localNow = new Date();
            assert.equal(await page.locator("#month-title").textContent(), `${localNow.getFullYear()}年 ${localNow.getMonth() + 1}月`);
            await navigateToSeptember2026(page);

            const grid = page.locator("#calendar-grid");
            const layout = await grid.evaluate((element) => ({
                columns: getComputedStyle(element).gridTemplateColumns.split(/\s+/).filter(Boolean).length,
                weekdays: element.querySelectorAll(".weekday").length,
                dates: element.querySelectorAll(".day-cell").length
            }));
            assert.deepEqual(layout, { columns: 7, weekdays: 7, dates: 42 });
            await assertNoHorizontalOverflow(page, `${viewport.width}x${viewport.height} closed`);

            const festivalDay = page.locator('.day-cell[aria-label^="2026年9月25日"]');
            assert.equal(await festivalDay.count(), 1);
            assert.equal(await festivalDay.evaluate((element) => element.classList.contains("is-festival")), true);
            assert.equal(await festivalDay.locator(".day-note").textContent(), "中秋节");

            const victoryDay = page.locator('.day-cell[aria-label^="2026年9月3日"]');
            assert.equal(await victoryDay.count(), 1);
            await victoryDay.click();
            assert.match(await page.locator("#date-context").textContent(), /抗战胜利纪念日/);
            assert.match(await page.locator("#date-context").textContent(), /军工、国防装备、军贸/);
            await page.locator("#detail-close").click();

            const itemList = JSON.parse(await page.locator("#event-jsonld").textContent());
            assert.equal(itemList["@type"], "ItemList");
            assert.equal(itemList.numberOfItems, 3);
            assert.equal(itemList.itemListElement.length, 3);
            itemList.itemListElement.forEach((event) => assert.equal(event["@type"], "Event"));

            const september15 = page.locator('.day-cell[aria-label^="2026年9月15日"]');
            await september15.click();
            assert.equal(await page.locator("#detail-panel").isVisible(), true);
            assert.equal(await page.locator("#detail-date-key").textContent(), "2026-09-15");
            assert.match(await page.locator("#detail-title").textContent(), /^2026年9月15日/);
            assert.equal(await page.locator("#detail-event-count").textContent(), "1 项");
            assert.equal(await page.locator(".event-item").count(), 1);
            assert.equal(await page.locator(".event-label.status").textContent(), "已确认");

            const close = page.locator("#detail-close");
            const source = page.locator(".event-source-row a");
            assert.equal(await close.evaluate((element) => element === document.activeElement), true);

            const sourceAttributes = await source.evaluate((element) => ({
                href: element.href,
                rel: element.rel,
                target: element.target
            }));
            const sourceUrl = new URL(sourceAttributes.href);
            assert.equal(sourceUrl.protocol, "https:");
            assert.equal(sourceUrl.username, "");
            assert.equal(sourceUrl.password, "");
            assert.equal(sourceAttributes.target, "_blank");
            assert.deepEqual(new Set(sourceAttributes.rel.split(/\s+/)), new Set(["noopener", "noreferrer"]));

            await source.focus();
            await page.keyboard.press("Tab");
            assert.equal(await close.evaluate((element) => element === document.activeElement), true);
            await page.keyboard.press("Shift+Tab");
            assert.equal(await source.evaluate((element) => element === document.activeElement), true);
            await assertNoHorizontalOverflow(page, `${viewport.width}x${viewport.height} open`);

            await page.keyboard.press("Escape");
            assert.equal(await page.locator("#detail-panel").isHidden(), true);
            assert.equal(await september15.evaluate((element) => element === document.activeElement), true);
            assert.deepEqual(consoleProblems, []);

            await context.close();
        });
    }
});
