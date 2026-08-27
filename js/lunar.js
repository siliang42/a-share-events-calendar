/* Browser-native lunar annotations backed by the standardized Intl API. */
var calendar = (function () {
    "use strict";

    var formatter;
    var MONTH_NUMBERS = {
        "正": 1,
        "一": 1,
        "二": 2,
        "三": 3,
        "四": 4,
        "五": 5,
        "六": 6,
        "七": 7,
        "八": 8,
        "九": 9,
        "十": 10,
        "十一": 11,
        "冬": 11,
        "十二": 12,
        "腊": 12
    };
    var DAY_DIGITS = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    var BRANCHES = "子丑寅卯辰巳午未申酉戌亥";
    var ANIMALS = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];

    function getFormatter() {
        if (formatter !== undefined) {
            return formatter;
        }

        formatter = null;
        if (typeof Intl === "undefined" || typeof Intl.DateTimeFormat !== "function") {
            return formatter;
        }

        try {
            formatter = new Intl.DateTimeFormat("zh-CN-u-ca-chinese", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
                timeZone: "UTC"
            });
            if (typeof formatter.formatToParts !== "function" || formatter.resolvedOptions().calendar !== "chinese") {
                formatter = null;
            }
        } catch (error) {
            formatter = null;
        }

        return formatter;
    }

    function validGregorianDate(year, month, day) {
        if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
            return null;
        }
        if (month < 1 || month > 12 || day < 1 || day > 31) {
            return null;
        }

        var date = new Date(0);
        date.setUTCHours(12, 0, 0, 0);
        date.setUTCFullYear(year, month - 1, day);
        if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
            return null;
        }
        return date;
    }

    function partValue(parts, type) {
        for (var index = 0; index < parts.length; index += 1) {
            if (parts[index].type === type) {
                return parts[index].value;
            }
        }
        return "";
    }

    function monthNumber(monthName) {
        var name = monthName.replace(/^闰/, "").replace(/月$/, "");
        if (/^\d+$/.test(name)) {
            var numericMonth = Number(name);
            return numericMonth >= 1 && numericMonth <= 12 ? numericMonth : -1;
        }
        return MONTH_NUMBERS[name] || -1;
    }

    function chinaDay(day) {
        if (day < 1 || day > 30) {
            return "";
        }
        if (day === 10) {
            return "初十";
        }
        if (day === 20) {
            return "二十";
        }
        if (day === 30) {
            return "三十";
        }
        if (day < 10) {
            return "初" + DAY_DIGITS[day];
        }
        if (day < 20) {
            return "十" + DAY_DIGITS[day - 10];
        }
        return "廿" + DAY_DIGITS[day - 20];
    }

    function animalForYearName(yearName) {
        var branch = yearName.charAt(yearName.length - 1);
        var branchIndex = BRANCHES.indexOf(branch);
        return branchIndex === -1 ? "" : ANIMALS[branchIndex];
    }

    function solar2lunar(year, month, day) {
        var date = validGregorianDate(year, month, day);
        var activeFormatter = getFormatter();
        if (!date || !activeFormatter) {
            return -1;
        }

        try {
            var parts = activeFormatter.formatToParts(date);
            var monthName = partValue(parts, "month");
            var dayNumber = Number(partValue(parts, "day"));
            var yearName = partValue(parts, "yearName");
            var weekday = partValue(parts, "weekday");
            var lunarMonth = monthNumber(monthName);
            var dayName = chinaDay(dayNumber);
            var animal = animalForYearName(yearName);

            if (lunarMonth === -1 || !Number.isInteger(dayNumber) || !dayName || !yearName || !animal || !weekday) {
                return -1;
            }

            return {
                lMonth: lunarMonth,
                lDay: dayNumber,
                IMonthCn: monthName,
                IDayCn: dayName,
                gzYear: yearName,
                Animal: animal,
                ncWeek: weekday,
                isLeap: monthName.indexOf("闰") === 0,
                isTerm: false
            };
        } catch (error) {
            return -1;
        }
    }

    return {
        solar2lunar: solar2lunar
    };
}());

if (typeof module !== "undefined" && module.exports) {
    module.exports = calendar;
}
if (typeof window !== "undefined") {
    window.calendar = calendar;
}
