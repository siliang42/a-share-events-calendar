/* Verified event records for A-Share Events Calendar. */

var EVENTS = [
    {
        id: "fomc-2026-09",
        title: "Federal Open Market Committee meeting",
        startDate: "2026-09-15",
        endDate: "2026-09-16",
        category: "policy",
        description: "Scheduled Federal Open Market Committee monetary-policy meeting.",
        status: "confirmed",
        sourceName: "Federal Reserve Board",
        sourceUrl: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm",
        verifiedAt: "2026-08-27"
    },
    {
        id: "fomc-2026-10",
        title: "Federal Open Market Committee meeting",
        startDate: "2026-10-27",
        endDate: "2026-10-28",
        category: "policy",
        description: "Scheduled Federal Open Market Committee monetary-policy meeting.",
        status: "confirmed",
        sourceName: "Federal Reserve Board",
        sourceUrl: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm",
        verifiedAt: "2026-08-27"
    },
    {
        id: "fomc-2026-12",
        title: "Federal Open Market Committee meeting",
        startDate: "2026-12-08",
        endDate: "2026-12-09",
        category: "policy",
        description: "Scheduled Federal Open Market Committee monetary-policy meeting.",
        status: "confirmed",
        sourceName: "Federal Reserve Board",
        sourceUrl: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm",
        verifiedAt: "2026-08-27"
    }
];

/* Recurring research prompts; these are thematic cues, not verified catalysts. */
var HOTSPOTS = [
    { id: "international-womens-day", name: "国际妇女节", solarMonth: 3, solarDay: 8, sectors: ["医美", "服装家居", "消费", "教育"], note: "女性消费与服务主题提示" },
    { id: "earth-day", name: "世界地球日", solarMonth: 4, solarDay: 22, sectors: ["环保", "新能源", "资源循环"], note: "绿色发展与资源循环主题提示" },
    { id: "labor-day", name: "劳动节", solarMonth: 5, solarDay: 1, sectors: ["旅游", "酒店", "航空", "零售消费"], note: "假期出行与消费主题提示" },
    { id: "youth-day", name: "五四青年节", solarMonth: 5, solarDay: 4, sectors: ["传媒", "教育", "互联网"], note: "青年文化与教育服务主题提示" },
    { id: "environment-day", name: "世界环境日", solarMonth: 6, solarDay: 5, sectors: ["环保", "节能", "固废处理"], note: "环境治理与节能主题提示" },
    { id: "party-day", name: "建党节", solarMonth: 7, solarDay: 1, sectors: ["红色文旅", "传媒", "国企改革"], note: "红色文旅与国企主题提示" },
    { id: "army-day", name: "建军节", solarMonth: 8, solarDay: 1, sectors: ["军工", "国防装备", "国防信息化"], note: "国防主题与军工产业链提示" },
    { id: "victory-day", name: "抗战胜利纪念日", solarMonth: 9, solarDay: 3, sectors: ["军工", "国防装备", "军贸"], note: "纪念日主题与国防产业链提示" },
    { id: "teachers-day", name: "教师节", solarMonth: 9, solarDay: 10, sectors: ["教育", "出版传媒"], note: "教育服务与出版传媒主题提示" },
    { id: "national-day", name: "国庆节", solarMonth: 10, solarDay: 1, sectors: ["旅游", "航空", "酒店", "零售消费"], note: "长假出行与消费主题提示" },
    { id: "spring-festival", name: "春节", lunarMonth: 1, lunarDay: 1, sectors: ["旅游", "食品饮料", "影视传媒", "零售消费"], note: "春节消费与出行主题提示" },
    { id: "lantern-festival", name: "元宵节", lunarMonth: 1, lunarDay: 15, sectors: ["食品饮料", "文旅", "传媒"], note: "节庆消费与文旅主题提示" },
    { id: "dragon-boat-festival", name: "端午节", lunarMonth: 5, lunarDay: 5, sectors: ["食品饮料", "旅游", "物流"], note: "节庆消费与假期出行主题提示" },
    { id: "qixi-festival", name: "七夕节", lunarMonth: 7, lunarDay: 7, sectors: ["黄金珠宝", "服装家居", "消费"], note: "节日消费主题提示" },
    { id: "mid-autumn-festival", name: "中秋节", lunarMonth: 8, lunarDay: 15, sectors: ["食品饮料", "旅游", "零售消费"], note: "节庆消费与出行主题提示" },
    { id: "double-ninth-festival", name: "重阳节", lunarMonth: 9, lunarDay: 9, sectors: ["养老", "医疗服务", "旅游"], note: "银发经济与健康服务主题提示" }
];

var HOLIDAYS = [];

if (typeof module !== "undefined" && module.exports) {
    module.exports = { EVENTS: EVENTS, HOLIDAYS: HOLIDAYS, HOTSPOTS: HOTSPOTS };
}
