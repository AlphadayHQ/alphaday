import i18next from "i18next";
import moment from "moment-with-locales-es6";
/**
 *  returns a text that represents the given datetime
 *  relative to now.
 * @param date | date-string
 * @returns string
 */

export const computeDuration = (date: string | Date): string => {
    moment.updateLocale(i18next.language, {
        relativeTime: {
            future: `${i18next.t("datelocale.future")}`, // this shouldn't occur If it does there's an error.
            past: `${i18next.t("datelocale.past")}`,
            s: `%d${i18next.t("datelocale.s")}`,
            m: `%d${i18next.t("datelocale.m")}`,
            mm: `%d${i18next.t("datelocale.mm")}`,
            h: `%d${i18next.t("datelocale.h")}`,
            hh: `%d${i18next.t("datelocale.hh")}`,
            d: `%d${i18next.t("datelocale.d")}`,
            dd: `%d${i18next.t("datelocale.dd")}`,
            M: `%d${i18next.t("datelocale.M")}`,
            MM: `%d${i18next.t("datelocale.MM")}`,
            y: `%d${i18next.t("datelocale.y")}`,
            yy: `%d${i18next.t("datelocale.yy")}`,
        },
    });

    return String(moment.duration(moment(date).diff(moment())).humanize(true));
};

export const TIMEZONES = [
    "(GMT-11) Pacific/Midway",
    "(GMT-10) Pacific/Honolulu",
    "(GMT-9) America/Anchorage",
    "(GMT-8) America/Los_Angeles",
    "(GMT-7) America/Denver",
    "(GMT-6) America/Chicago",
    "(GMT-5) America/New_York",
    "(GMT-4) America/Santiago",
    "(GMT-3) America/Sao_Paulo",
    "(GMT-2) Atlantic/South_Georgia",
    "(GMT-1) Atlantic/Azores",
    "(GMT+0) Europe/London",
    "(GMT+1) Europe/Paris",
    "(GMT+2) Europe/Athens",
    "(GMT+3) Europe/Moscow",
    "(GMT+4) Asia/Dubai",
    "(GMT+5) Asia/Karachi",
    "(GMT+5:30) Asia/Kolkata",
    "(GMT+6) Asia/Dhaka",
    "(GMT+7) Asia/Bangkok",
    "(GMT+8) Asia/Singapore",
    "(GMT+9) Asia/Tokyo",
    "(GMT+10) Australia/Sydney",
    "(GMT+11) Pacific/Noumea",
    "(GMT+12) Pacific/Fiji",
];

export const DAYS_OF_WEEK = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
