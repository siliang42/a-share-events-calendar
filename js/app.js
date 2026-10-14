/* Calendar rendering and interaction for verified source-backed events. */
(function () {
    "use strict";

    var WEEK_HEADS = ["日", "一", "二", "三", "四", "五", "六"];
    var SOLAR_FESTIVALS = {
        "1-1": "元旦",
        "3-8": "妇女节",
        "5-1": "劳动节",
        "5-4": "青年节",
        "7-1": "建党节",
        "8-1": "建军节",
        "9-10": "教师节",
        "10-1": "国庆节"
    };
    var LUNAR_FESTIVALS = {
        "1-1": "春节",
        "1-15": "元宵节",
        "2-2": "龙抬头",
        "5-5": "端午节",
        "7-7": "七夕节",
        "7-15": "中元节",
        "8-15": "中秋节",
        "9-9": "重阳节",
        "12-8": "腊八节"
    };

    function currentDate() {
        return new Date();
    }

    var initialDate = currentDate();
    var viewYear = initialDate.getFullYear();
    var viewMonth = initialDate.getMonth();
    var lastTrigger = null;
    var holidayMap = buildHolidayMap(HOLIDAYS);

    var monthTitle = document.getElementById("month-title");
    var monthLive = document.getElementById("month-live");
    var calendarGrid = document.getElementById("calendar-grid");
    var eventCount = document.getElementById("event-count");
    var holidayCount = document.getElementById("holiday-count");
    var backdrop = document.getElementById("dialog-backdrop");
    var detailPanel = document.getElementById("detail-panel");
    var detailClose = document.getElementById("detail-close");
    var detailTitle = document.getElementById("detail-title");
    var detailDateKey = document.getElementById("detail-date-key");
    var dateContext = document.getElementById("date-context");
    var detailEventCount = document.getElementById("detail-event-count");
    var eventList = document.getElementById("event-list");
    var eventEmpty = document.getElementById("event-empty");

    function buildHolidayMap(holidays) {
        var result = {};
        holidays.forEach(function (holiday) {
            result[holiday.date] = holiday;
        });
        return result;
    }

    function clearElement(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    function dateToKey(date) {
        return EventUtils.formatDateKey(date.getFullYear(), date.getMonth(), date.getDate());
    }

    function getFestivals(lunar, month, day, holiday) {
        var festivals = [];
        var solarKey = (month + 1) + "-" + day;

        if (SOLAR_FESTIVALS[solarKey]) {
            festivals.push(SOLAR_FESTIVALS[solarKey]);
        }
        if (lunar) {
            var lunarKey = lunar.lMonth + "-" + lunar.lDay;
            if (!lunar.isLeap && LUNAR_FESTIVALS[lunarKey]) {
                festivals.push(LUNAR_FESTIVALS[lunarKey]);
            }
        }
        if (holiday && holiday.type === "holiday" && festivals.indexOf(holiday.name) < 0) {
            festivals.push(holiday.name);
        }

        return festivals;
    }

    function getHotspots(lunar, month, day) {
        var solarMonth = month + 1;
        return HOTSPOTS.filter(function (hotspot) {
            if (hotspot.solarMonth === solarMonth && hotspot.solarDay === day) {
                return true;
            }
            return lunar && !lunar.isLeap && hotspot.lunarMonth === lunar.lMonth && hotspot.lunarDay === lunar.lDay;
        });
    }

    function buildDayMeta(year, month, day) {
        var key = EventUtils.formatDateKey(year, month, day);
        var calendarDate = EventUtils.resolveCalendarDate(calendar, year, month, day);
        var holiday = holidayMap[key] || null;

        return {
            key: key,
            year: year,
            month: month,
            day: day,
            lunar: calendarDate.lunar,
            weekday: calendarDate.weekday,
            weekdayIndex: new Date(year, month, day).getDay(),
            holiday: holiday,
            festivals: getFestivals(calendarDate.lunar, month, day, holiday),
            hotspots: getHotspots(calendarDate.lunar, month, day),
            events: EventUtils.eventsOnDate(EVENTS, key),
            isToday: key === dateToKey(currentDate()),
            isCurrentMonth: year === viewYear && month === viewMonth
        };
    }

    function createWeekday(label, weekdayIndex) {
        var weekday = document.createElement("div");
        weekday.classList.add("weekday");
        if (weekdayIndex === 0 || weekdayIndex === 6) {
            weekday.classList.add("is-weekend");
        }
        weekday.setAttribute("aria-hidden", "true");
        weekday.textContent = label;
        return weekday;
    }

    function createDayCell(meta) {
        var button = document.createElement("button");
        var dayNumber = document.createElement("span");
        var dayNote = document.createElement("span");
        var flags = document.createElement("span");
        var note = meta.festivals[0] || (meta.hotspots[0] ? meta.hotspots[0].name : null) || (meta.lunar
            ? (meta.lunar.lDay === 1 ? meta.lunar.IMonthCn : meta.lunar.IDayCn)
            : "公历");
        var accessibleParts = [
            meta.year + "年" + (meta.month + 1) + "月" + meta.day + "日"
        ];

        if (meta.lunar) {
            accessibleParts.push("农历" + meta.lunar.IMonthCn + meta.lunar.IDayCn);
        } else {
            accessibleParts.push(meta.weekday);
        }

        button.type = "button";
        button.classList.add("day-cell");
        if (meta.weekdayIndex === 0 || meta.weekdayIndex === 6) {
            button.classList.add("is-weekend");
        }
        if (!meta.isCurrentMonth) {
            button.classList.add("is-outside");
        }
        if (meta.isToday) {
            button.classList.add("is-today");
            button.setAttribute("aria-current", "date");
            accessibleParts.push("今天");
        }
        if (meta.events.length) {
            button.classList.add("has-event");
            accessibleParts.push(meta.events.length + "项已核验事件");
        }
        if (meta.festivals.length) {
            button.classList.add("is-festival");
        }
        if (meta.holiday) {
            button.classList.add(meta.holiday.type === "holiday" ? "is-holiday" : "is-workday");
            accessibleParts.push(meta.holiday.name);
        }

        button.setAttribute("aria-label", accessibleParts.join("，"));
        button.addEventListener("click", function () {
            openDetails(meta, button);
        });

        dayNumber.classList.add("day-number");
        dayNumber.textContent = String(meta.day);
        dayNote.classList.add("day-note");
        dayNote.textContent = note;
        flags.classList.add("day-flags");

        if (meta.events.length) {
            var eventFlag = document.createElement("span");
            eventFlag.classList.add("event-flag");
            eventFlag.textContent = "事件 " + meta.events.length;
            flags.appendChild(eventFlag);
        }
        if (meta.holiday) {
            var holidayFlag = document.createElement("span");
            holidayFlag.classList.add("holiday-flag");
            holidayFlag.textContent = meta.holiday.type === "holiday" ? "休" : "班";
            flags.appendChild(holidayFlag);
        }

        button.appendChild(dayNumber);
        button.appendChild(dayNote);
        button.appendChild(flags);
        return button;
    }

    function calendarDays() {
        var days = [];
        var firstWeekday = new Date(viewYear, viewMonth, 1).getDay();

        for (var index = 0; index < 42; index += 1) {
            var date = new Date(viewYear, viewMonth, index - firstWeekday + 1);
            days.push(buildDayMeta(date.getFullYear(), date.getMonth(), date.getDate()));
        }

        return days;
    }

    function renderCalendar() {
        var days = calendarDays();
        var eventDays = 0;
        var holidays = 0;

        clearElement(calendarGrid);
        WEEK_HEADS.forEach(function (weekday, weekdayIndex) {
            calendarGrid.appendChild(createWeekday(weekday, weekdayIndex));
        });
        days.forEach(function (meta) {
            calendarGrid.appendChild(createDayCell(meta));
            if (meta.isCurrentMonth && meta.events.length) {
                eventDays += 1;
            }
            if (meta.isCurrentMonth && meta.holiday && meta.holiday.type === "holiday") {
                holidays += 1;
            }
        });

        var monthLabel = viewYear + "年 " + (viewMonth + 1) + "月";
        monthTitle.textContent = monthLabel;
        eventCount.textContent = "事件日期 " + eventDays + " 天";
        holidayCount.textContent = "法定假期 " + holidays + " 天";
        monthLive.textContent = monthLabel + "，" + eventDays + "个事件日期，" + holidays + "个法定假期日期";
    }

    function renderEventJsonLd() {
        var eventJsonLd = document.getElementById("event-jsonld");
        var events = EVENTS.map(EventUtils.buildEventJsonLd).filter(Boolean);
        var itemList = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: events,
            numberOfItems: events.length
        };

        eventJsonLd.textContent = JSON.stringify(itemList);
    }

    function appendContextLine(text, className) {
        var line = document.createElement("p");
        if (className) {
            line.classList.add(className);
        }
        line.textContent = text;
        dateContext.appendChild(line);
    }

    function renderDateContext(meta) {
        var lunar = meta.lunar;
        var lunarLine = "公历";
        var calendarLine = meta.weekday;

        clearElement(dateContext);
        if (lunar) {
            lunarLine = "农历 " + lunar.IMonthCn + lunar.IDayCn + " · " + lunar.gzYear + "年 · " + lunar.Animal + "年";
        }
        if (meta.festivals.length) {
            calendarLine += " · " + meta.festivals.join("、");
        }
        appendContextLine(lunarLine);
        appendContextLine(calendarLine);
        if (meta.holiday) {
            appendContextLine(
                (meta.holiday.type === "holiday" ? "法定节假日：" : "调休上班：") + meta.holiday.name,
                "holiday-context"
            );
        }
        if (meta.hotspots.length) {
            meta.hotspots.forEach(function (hotspot) {
                appendContextLine(
                    "热点提示：" + hotspot.name + " · 关联板块：" + hotspot.sectors.join("、"),
                    "hotspot-context"
                );
                appendContextLine(hotspot.note + "；仅作研究线索，不构成投资建议。", "hotspot-disclaimer");
            });
        }
    }

    function createEventItem(event) {
        var item = document.createElement("li");
        var labels = document.createElement("div");
        var category = document.createElement("span");
        var status = document.createElement("span");
        var title = document.createElement("h4");
        var description = document.createElement("p");
        var sourceRow = document.createElement("div");
        var verified = document.createElement("span");
        var safeSourceUrl = EventUtils.toSafeSourceUrl(event.sourceUrl);

        item.classList.add("event-item");
        item.classList.add("status-" + event.status);
        labels.classList.add("event-labels");
        category.classList.add("event-label");
        category.textContent = EventUtils.categoryLabel(event.category);
        status.classList.add("event-label", "status");
        status.textContent = EventUtils.statusLabel(event.status);
        labels.appendChild(category);
        labels.appendChild(status);

        title.classList.add("event-title");
        title.textContent = event.title;
        description.classList.add("event-description");
        description.textContent = event.description;

        sourceRow.classList.add("event-source-row");
        if (safeSourceUrl) {
            var sourceLink = document.createElement("a");
            sourceLink.href = safeSourceUrl;
            sourceLink.target = "_blank";
            sourceLink.rel = "noopener noreferrer";
            sourceLink.textContent = "官方来源：" + event.sourceName;
            sourceRow.appendChild(sourceLink);
        }
        verified.classList.add("verified-date");
        verified.textContent = "核验于 " + event.verifiedAt;
        sourceRow.appendChild(verified);

        item.appendChild(labels);
        item.appendChild(title);
        item.appendChild(description);
        item.appendChild(sourceRow);
        return item;
    }

    function renderEvents(events) {
        clearElement(eventList);
        detailEventCount.textContent = events.length + " 项";
        eventList.hidden = events.length === 0;
        eventEmpty.hidden = events.length !== 0;
        events.forEach(function (event) {
            eventList.appendChild(createEventItem(event));
        });
    }

    function openDetails(meta, trigger) {
        lastTrigger = trigger;
        detailDateKey.textContent = meta.key;
        detailTitle.textContent = meta.year + "年" + (meta.month + 1) + "月" + meta.day + "日 " + meta.weekday;
        renderDateContext(meta);
        renderEvents(meta.events);
        backdrop.hidden = false;
        detailPanel.hidden = false;
        document.body.classList.add("dialog-open");
        detailClose.focus();
    }

    function closeDetails() {
        if (detailPanel.hidden) {
            return;
        }

        backdrop.hidden = true;
        detailPanel.hidden = true;
        document.body.classList.remove("dialog-open");
        if (lastTrigger && document.contains(lastTrigger)) {
            lastTrigger.focus();
        }
        lastTrigger = null;
    }

    function trapDialogFocus(event) {
        if (event.key !== "Tab" || detailPanel.hidden) {
            return;
        }

        var focusable = Array.prototype.slice.call(
            detailPanel.querySelectorAll("button:not([disabled]), a[href]")
        );
        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (!first) {
            event.preventDefault();
            detailPanel.focus();
            return;
        }
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    function changeMonth(offset) {
        var next = new Date(viewYear, viewMonth + offset, 1);
        viewYear = next.getFullYear();
        viewMonth = next.getMonth();
        renderCalendar();
    }

    function init() {
        document.getElementById("prev-month").addEventListener("click", function () {
            changeMonth(-1);
        });
        document.getElementById("next-month").addEventListener("click", function () {
            changeMonth(1);
        });
        document.getElementById("go-today").addEventListener("click", function () {
            var today = currentDate();
            viewYear = today.getFullYear();
            viewMonth = today.getMonth();
            renderCalendar();
        });
        detailClose.addEventListener("click", closeDetails);
        backdrop.addEventListener("click", closeDetails);
        detailPanel.addEventListener("keydown", trapDialogFocus);
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeDetails();
            }
        });

        renderEventJsonLd();
        renderCalendar();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
}());
