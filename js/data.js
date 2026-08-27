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

var HOLIDAYS = [];

if (typeof module !== "undefined" && module.exports) {
    module.exports = { EVENTS: EVENTS, HOLIDAYS: HOLIDAYS };
}
