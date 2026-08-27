/* Pure event lookup and display helpers for browsers and CommonJS. */
(function (root, factory) {
    var api = factory();

    if (typeof module !== "undefined" && module.exports) {
        module.exports = api;
    } else {
        root.EventUtils = api;
    }
}(typeof window !== "undefined" ? window : globalThis, function () {
    "use strict";

    var STATUS_LABELS = {
        confirmed: "已确认",
        postponed: "已延期",
        cancelled: "已取消"
    };
    var CATEGORY_LABELS = {
        macro: "宏观",
        policy: "政策",
        market: "市场",
        industry: "行业",
        company: "公司",
        product: "产品"
    };
    var EVENT_STATUSES = {
        confirmed: "https://schema.org/EventScheduled",
        postponed: "https://schema.org/EventPostponed",
        cancelled: "https://schema.org/EventCancelled"
    };
    var WEEKDAY_LABELS = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

    function pad2(value) {
        return value < 10 ? "0" + value : "" + value;
    }

    function formatDateKey(year, zeroBasedMonth, day) {
        return year + "-" + pad2(zeroBasedMonth + 1) + "-" + pad2(day);
    }

    function parseCalendarDate(key) {
        if (typeof key !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(key)) {
            return null;
        }

        var parts = key.split("-").map(Number);
        var date = new Date(parts[0], parts[1] - 1, parts[2]);
        return date.getFullYear() === parts[0] &&
            date.getMonth() === parts[1] - 1 &&
            date.getDate() === parts[2]
            ? date
            : null;
    }

    function eventsOnDate(events, dateKey) {
        var target = parseCalendarDate(dateKey);
        if (!Array.isArray(events) || !target) {
            return [];
        }

        var targetTime = target.getTime();
        return events.slice().filter(function (event) {
            var start = parseCalendarDate(event && event.startDate);
            var end = parseCalendarDate(event && event.endDate);
            return start && end && targetTime >= start.getTime() && targetTime <= end.getTime();
        }).sort(function (left, right) {
            return left.startDate.localeCompare(right.startDate);
        });
    }

    function isSafeSourceUrl(value) {
        if (typeof value !== "string") {
            return false;
        }

        try {
            var url = new URL(value);
            return url.protocol === "https:" && Boolean(url.hostname) && !url.username && !url.password;
        } catch (error) {
            return false;
        }
    }

    function toSafeSourceUrl(value) {
        return isSafeSourceUrl(value) ? new URL(value).href : null;
    }

    function statusLabel(status) {
        return STATUS_LABELS[status] || "未知状态";
    }

    function categoryLabel(category) {
        return CATEGORY_LABELS[category] || "未知分类";
    }

    function resolveCalendarDate(lunarEngine, year, zeroBasedMonth, day) {
        var lunar = lunarEngine.solar2lunar(year, zeroBasedMonth + 1, day);
        var hasLunarData = lunar !== null && typeof lunar === "object";

        return {
            lunar: hasLunarData ? lunar : null,
            weekday: hasLunarData && lunar.ncWeek
                ? lunar.ncWeek
                : WEEKDAY_LABELS[new Date(year, zeroBasedMonth, day).getDay()]
        };
    }

    function buildEventJsonLd(event) {
        var eventStatus = EVENT_STATUSES[event.status];
        if (!eventStatus) {
            return null;
        }

        var jsonLd = {
            "@context": "https://schema.org",
            "@type": "Event",
            name: event.title,
            description: event.description,
            startDate: event.startDate,
            endDate: event.endDate,
            eventStatus: eventStatus
        };

        if (isSafeSourceUrl(event.sourceUrl)) {
            jsonLd.url = event.sourceUrl;
        }

        return jsonLd;
    }

    return {
        formatDateKey: formatDateKey,
        eventsOnDate: eventsOnDate,
        isSafeSourceUrl: isSafeSourceUrl,
        toSafeSourceUrl: toSafeSourceUrl,
        statusLabel: statusLabel,
        categoryLabel: categoryLabel,
        resolveCalendarDate: resolveCalendarDate,
        buildEventJsonLd: buildEventJsonLd
    };
}));
