const { EVENTS } = require("../js/data.js");

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
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isIsoDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day;
}

function eventLabel(event, index) {
    return event && typeof event.id === "string" && event.id.trim()
        ? `event ${event.id}`
        : `event at index ${index}`;
}

function normalizeSourceUrl(value) {
    if (typeof value !== "string") {
        return null;
    }

    try {
        const url = new URL(value);
        return url.protocol === "https:" && Boolean(url.hostname) && !url.username && !url.password
            ? url.href
            : null;
    } catch {
        return null;
    }
}

function eventSignature(event) {
    const sourceUrl = normalizeSourceUrl(event.sourceUrl);
    if (typeof event.title !== "string" ||
        !event.title.trim() ||
        !isIsoDate(event.startDate) ||
        !isIsoDate(event.endDate) ||
        !sourceUrl) {
        return null;
    }

    return JSON.stringify([
        event.title.trim().toLowerCase(),
        event.startDate,
        event.endDate,
        sourceUrl
    ]);
}

function formatLocalDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function validateEvents(events, today) {
    const errors = [];
    const seenIds = new Set();
    const seenSignatures = new Set();

    if (!Array.isArray(events)) {
        return ["events must be an array"];
    }

    if (!isIsoDate(today)) {
        return [`today must be a valid ISO date: ${today}`];
    }

    let previousStartDate;
    for (let index = 0; index < events.length; index += 1) {
        const event = events[index];
        const label = eventLabel(event, index);

        if (!event || typeof event !== "object" || Array.isArray(event)) {
            errors.push(`${label}: must be an object`);
            continue;
        }

        for (const field of REQUIRED_FIELDS) {
            if (typeof event[field] !== "string" || !event[field].trim()) {
                errors.push(`${label}: missing ${field}`);
            }
        }

        if (typeof event.id === "string" && !ID_PATTERN.test(event.id)) {
            errors.push(`${label}: id must be a lowercase slug`);
        }

        if (typeof event.id === "string" && event.id.trim()) {
            if (seenIds.has(event.id)) {
                errors.push(`${label}: duplicate id ${event.id}`);
            }
            seenIds.add(event.id);
        }

        const signature = eventSignature(event);
        if (signature) {
            if (seenSignatures.has(signature)) {
                errors.push(`${label}: duplicate event signature`);
            }
            seenSignatures.add(signature);
        }

        if (!isIsoDate(event.startDate)) {
            errors.push(`${label}: invalid startDate`);
        }
        if (!isIsoDate(event.endDate)) {
            errors.push(`${label}: invalid endDate`);
        }
        if (isIsoDate(event.startDate) && isIsoDate(event.endDate) && event.endDate < event.startDate) {
            errors.push(`${label}: endDate precedes startDate`);
        }
        if (typeof event.category === "string" && !CATEGORIES.has(event.category)) {
            errors.push(`${label}: unsupported category ${event.category}`);
        }
        if (typeof event.status === "string" && !STATUSES.has(event.status)) {
            errors.push(`${label}: unsupported status ${event.status}`);
        }
        if (typeof event.sourceUrl === "string" && event.sourceUrl.trim() && !normalizeSourceUrl(event.sourceUrl)) {
            errors.push(`${label}: sourceUrl must be an HTTPS URL without credentials`);
        }
        if (!isIsoDate(event.verifiedAt)) {
            errors.push(`${label}: invalid verifiedAt`);
        } else if (event.verifiedAt > today) {
            errors.push(`${label}: verifiedAt is in the future`);
        }
        if (isIsoDate(event.startDate) && previousStartDate && event.startDate < previousStartDate) {
            errors.push(`${label}: events are not ordered by startDate`);
        }
        if (isIsoDate(event.startDate)) {
            previousStartDate = event.startDate;
        }
    }

    return errors;
}

if (require.main === module) {
    const today = formatLocalDate(new Date());
    const errors = validateEvents(EVENTS, today);

    if (errors.length) {
        for (const error of errors) {
            console.error(error);
        }
        process.exitCode = 1;
    } else {
        console.log(`Validated ${EVENTS.length} events.`);
    }
}

module.exports = { formatLocalDate, validateEvents };
