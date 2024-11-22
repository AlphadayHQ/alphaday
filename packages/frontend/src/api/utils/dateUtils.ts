import i18next from "i18next";
import moment from "moment";
/**
 *  returns a text that represents the given datetime
 *  relative to now.
 * @param date | date-string
 * @returns string
 */
export const computeDuration = (date: string | Date): string => {
    moment.updateLocale("en", {
        relativeTime: {
            future: i18next.t("datelocale.future"), // this shouldn't occur If it does there's an error.
            past: i18next.t("datelocale.past"),
            s: i18next.t("datelocale.s"),
            m: i18next.t("datelocale.m"),
            mm: i18next.t("datelocale.mm"),
            h: i18next.t("datelocale.h"),
            hh: i18next.t("datelocale.hh"),
            d: i18next.t("datelocale.d"),
            dd: i18next.t("datelocale.dd"),
            M: i18next.t("datelocale.M"),
            MM: i18next.t("datelocale.MM"),
            y: i18next.t("datelocale.y"),
            yy: i18next.t("datelocale.yy"),
        },
    });

    return String(moment.duration(moment(date).diff(moment())).humanize(true));
};
