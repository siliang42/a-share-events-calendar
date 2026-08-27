const test = require("node:test");
const assert = require("node:assert/strict");
const { EVENTS } = require("../js/data.js");
const { formatLocalDate, validateEvents } = require("../scripts/validate-data.js");

const TODAY = "2026-08-27";
const REQUIRED_FIELDS = [
    "id",
    "title",
    "startDate",
    "endDate",
    "category",
    "description",
    "status",
    "sourceName",
    "sourceUrl",
    "verifiedAt"
];
const CATEGORIES = new Set(["macro", "policy", "market", "industry", "company", "product"]);
const STATUSES = new Set(["confirmed", "postponed", "cancelled"]);
const INVALID_ID_FIXTURES = [
    { name: "uppercase", id: "FOMC-2026-09" },
    { name: "leading whitespace", id: " fomc-2026-09" },
    { name: "trailing whitespace", id: "fomc-2026-09 " },
    { name: "embedded space", id: "fomc 2026-09" }
];

function eventAt(index) {
    return { ...EVENTS[index] };
}

test("production events satisfy the public data contract", () => {
    assert.deepEqual(validateEvents(EVENTS, TODAY), []);
});

test("production events include every required field", () => {
    for (const event of EVENTS) {
        for (const field of REQUIRED_FIELDS) {
            assert.equal(typeof event[field], "string", `${event.id} is missing ${field}`);
            assert.notEqual(event[field].trim(), "", `${event.id} has an empty ${field}`);
        }
    }
});

test("production events have unique IDs, allowed classifications, HTTPS sources, and chronological ordering", () => {
    assert.equal(new Set(EVENTS.map((event) => event.id)).size, EVENTS.length);

    for (const event of EVENTS) {
        assert.ok(CATEGORIES.has(event.category), `${event.id} has an unsupported category`);
        assert.ok(STATUSES.has(event.status), `${event.id} has an unsupported status`);
        assert.equal(new URL(event.sourceUrl).protocol, "https:", `${event.id} source must use HTTPS`);
        assert.ok(event.verifiedAt <= TODAY, `${event.id} was verified in the future`);
    }

    assert.deepEqual(
        EVENTS.map((event) => event.startDate),
        [...EVENTS.map((event) => event.startDate)].sort()
    );
});

test("duplicate IDs are rejected", () => {
    const duplicated = [eventAt(0), eventAt(0)];
    assert.match(validateEvents(duplicated, TODAY).join("\n"), /duplicate id/);
});

test("IDs with uppercase letters or whitespace are rejected", () => {
    for (const fixture of INVALID_ID_FIXTURES) {
        const invalidId = { ...eventAt(0), id: fixture.id };
        assert.match(
            validateEvents([invalidId], TODAY).join("\n"),
            /id must be a lowercase slug/,
            fixture.name
        );
    }
});

test("duplicate event signatures are rejected even when IDs and formatting differ", () => {
    const original = eventAt(0);
    const duplicate = {
        ...original,
        id: `${original.id}-copy`,
        title: `  ${original.title.toUpperCase()}  `,
        sourceUrl: original.sourceUrl.replace("https://www.", "https://WWW.").replace("/monetarypolicy", ":443/monetarypolicy")
    };

    assert.match(validateEvents([original, duplicate], TODAY).join("\n"), /duplicate event signature/);
});

test("same-title meetings on different dates have distinct event signatures", () => {
    const firstMeeting = eventAt(0);
    const laterMeeting = {
        ...firstMeeting,
        id: `${firstMeeting.id}-later`,
        startDate: "2026-09-22",
        endDate: "2026-09-23"
    };

    assert.doesNotMatch(validateEvents([firstMeeting, laterMeeting], TODAY).join("\n"), /duplicate event signature/);
});

test("invalid ISO dates are rejected", () => {
    const invalidDate = { ...eventAt(0), startDate: "2026-02-30" };
    assert.match(validateEvents([invalidDate], TODAY).join("\n"), /invalid startDate/);
});

test("missing sources are rejected", () => {
    const missingSource = { ...eventAt(0), sourceUrl: "" };
    assert.match(validateEvents([missingSource], TODAY).join("\n"), /missing sourceUrl/);
});

test("source URLs with embedded credentials are rejected", () => {
    const credentialSource = {
        ...eventAt(0),
        sourceUrl: "https://analyst:secret@www.federalreserve.gov/monetarypolicy/fomccalendars.htm"
    };

    assert.match(
        validateEvents([credentialSource], TODAY).join("\n"),
        /sourceUrl must be an HTTPS URL without credentials/
    );
});

test("reversed date ranges are rejected", () => {
    const reversedRange = {
        ...eventAt(0),
        startDate: "2026-09-16",
        endDate: "2026-09-15"
    };
    assert.match(validateEvents([reversedRange], TODAY).join("\n"), /endDate precedes startDate/);
});

test("formatLocalDate builds YYYY-MM-DD from local calendar fields", () => {
    const localDate = {
        getFullYear: () => 2026,
        getMonth: () => 0,
        getDate: () => 5,
        toISOString: () => "2026-01-04T16:00:00.000Z"
    };

    assert.equal(formatLocalDate?.(localDate), "2026-01-05");
});
