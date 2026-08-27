const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const CANONICAL_URL = "https://siliang42.github.io/a-share-events-calendar/";
const REPOSITORY_URL = "https://github.com/siliang42/a-share-events-calendar";
const PREVIEW_URL = `${CANONICAL_URL}assets/preview.png`;
const SOURCE_CODE_ID = `${REPOSITORY_URL}#source-code`;
const PAGE_TITLE = "A-Share Events Calendar | Source-Backed Market Catalyst Calendar";
const PAGE_DESCRIPTION = "An open-source calendar of officially announced policy, macro, industry, and company events relevant to A-share research.";
const PREVIEW_ALT = "A-Share Events Calendar showing the September 15, 2026 event detail";

function readProjectFile(name) {
    return fs.readFileSync(path.join(ROOT, name), "utf8");
}

function metaContent(html, attribute, value) {
    const expression = new RegExp(
        `<meta\\s+[^>]*${attribute}=["']${value}["'][^>]*content=["']([^"']+)["'][^>]*>`,
        "i"
    );
    return html.match(expression)?.[1] || null;
}

function jsonLdById(html, id) {
    const expression = new RegExp(
        `<script\\s+[^>]*id=["']${id}["'][^>]*>([\\s\\S]*?)<\\/script>`,
        "i"
    );
    const content = html.match(expression)?.[1];
    return content ? JSON.parse(content.trim()) : null;
}

test("page head defines the canonical product identity for search previews", () => {
    const html = readProjectFile("index.html");

    assert.match(html, new RegExp(`<title>${PAGE_TITLE}<\\/title>`));
    assert.equal(metaContent(html, "name", "description"), PAGE_DESCRIPTION);
    assert.match(html, new RegExp(`<link\\s+rel=["']canonical["']\\s+href=["']${CANONICAL_URL}["']`));
    assert.equal(metaContent(html, "property", "og:url"), CANONICAL_URL);
    assert.equal(metaContent(html, "property", "og:title"), PAGE_TITLE);
    assert.equal(metaContent(html, "property", "og:description"), PAGE_DESCRIPTION);
    assert.equal(metaContent(html, "property", "og:type"), "website");
    assert.equal(metaContent(html, "property", "og:image"), PREVIEW_URL);
    assert.equal(metaContent(html, "name", "theme-color"), "#ed1b2f");
    assert.equal(metaContent(html, "name", "twitter:card"), "summary_large_image");
    assert.equal(metaContent(html, "name", "twitter:title"), PAGE_TITLE);
    assert.equal(metaContent(html, "name", "twitter:description"), PAGE_DESCRIPTION);
    assert.equal(metaContent(html, "name", "twitter:image"), PREVIEW_URL);
    assert.equal(metaContent(html, "name", "twitter:image:alt"), PREVIEW_ALT);

    const previewPath = path.join(ROOT, "assets/preview.png");
    assert.equal(fs.existsSync(previewPath), true);
    const preview = fs.statSync(previewPath);
    assert.ok(preview.isFile());
    assert.ok(preview.size > 0);
});

test("page head links WebApplication metadata to repository-owned SoftwareSourceCode metadata", () => {
    const structuredData = jsonLdById(readProjectFile("index.html"), "webapplication-jsonld");

    assert.deepEqual(structuredData, {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebApplication",
                "@id": `${CANONICAL_URL}#application`,
                name: "A-Share Events Calendar",
                alternateName: "A 股事件驱动研究日历",
                description: PAGE_DESCRIPTION,
                url: CANONICAL_URL,
                applicationCategory: "FinanceApplication",
                operatingSystem: "Any",
                license: "https://opensource.org/license/mit",
                sameAs: [REPOSITORY_URL],
                isBasedOn: { "@id": SOURCE_CODE_ID }
            },
            {
                "@type": "SoftwareSourceCode",
                "@id": SOURCE_CODE_ID,
                name: "A-Share Events Calendar source code",
                url: REPOSITORY_URL,
                codeRepository: REPOSITORY_URL,
                license: "https://opensource.org/license/mit",
                programmingLanguage: ["HTML", "CSS", "JavaScript"]
            }
        ]
    });
});

test("application initialization serializes supported events into a dedicated ItemList JSON-LD node", () => {
    const appSource = readProjectFile("js/app.js");
    const initSource = appSource.slice(
        appSource.indexOf("function init()"),
        appSource.indexOf("if (document.readyState")
    );

    assert.match(appSource, /function renderEventJsonLd\(\)/);
    assert.match(appSource, /EVENTS\.map\(EventUtils\.buildEventJsonLd\)\.filter\(Boolean\)/);
    assert.match(appSource, /"@type":\s*"ItemList"/);
    assert.match(appSource, /document\.getElementById\("event-jsonld"\)/);
    assert.match(appSource, /eventJsonLd\.textContent = JSON\.stringify\(itemList\);/);
    assert.match(initSource, /renderEventJsonLd\(\);\s*renderCalendar\(\);/);
    assert.doesNotMatch(appSource, /eventJsonLd\.innerHTML\s*=/);
});

test("crawler discovery files reference only the canonical site URL", () => {
    const robots = readProjectFile("robots.txt");
    const sitemap = readProjectFile("sitemap.xml");

    assert.match(robots, /^User-agent:\s*\*$/m);
    assert.match(robots, /^Allow:\s*\/$/m);
    assert.match(robots, new RegExp(`^Sitemap:\\s*${CANONICAL_URL}sitemap\\.xml$`, "m"));
    assert.match(sitemap, /<urlset\s+xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
    assert.deepEqual([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]), [CANONICAL_URL]);
});

test("llms discovery document states purpose, data policy, limitations, documentation, and citation", () => {
    const llms = readProjectFile("llms.txt");

    for (const section of ["Purpose", "Data Policy", "Limitations", "Documentation", "Citation"]) {
        assert.match(llms, new RegExp(`^## ${section}$`, "m"));
    }
    assert.match(llms, /Only officially announced events with official or primary HTTPS sources are included\./);
    assert.match(llms, /Supported fields: id, title, startDate, endDate, category, description, status, sourceName, sourceUrl, and verifiedAt\./);
    assert.match(llms, /Supported statuses: confirmed, postponed, and cancelled\./);
    assert.match(llms, /Current coverage is limited to 3[^.]*FOMC records\./);
    assert.match(llms, /The `HOLIDAYS` array is currently empty\./);
    assert.match(llms, /It does not provide investment advice, price predictions, security rankings, or trading recommendations\./);
    assert.match(llms, new RegExp(CANONICAL_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(llms, new RegExp(REPOSITORY_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(llms, new RegExp(`${REPOSITORY_URL}/blob/main/README\\.md`));
    assert.match(llms, new RegExp(`${REPOSITORY_URL}/blob/main/README\\.zh-CN\\.md`));
    assert.match(llms, new RegExp(`${REPOSITORY_URL}/blob/main/CITATION\\.cff`));
});
