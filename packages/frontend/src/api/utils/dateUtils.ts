import i18next from "i18next";
import moment from "moment-with-locales-es6";
/**
 *  returns a text that represents the given datetime
 *  relative to now.
 * @param date | date-string
 * @returns string
 */

export const computeDuration = (date: string | Date): string => {
    moment.updateLocale("en", {
        relativeTime: {
            future: `%s${i18next.t("datelocale.future")}`, // this shouldn't occur If it does there's an error.
            past: `%s${i18next.t("datelocale.past")}`,
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
