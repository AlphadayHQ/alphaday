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
            future: "in %s", // this shouldn't occur If it does there's an error.
            past: "%s ago",
            s: "%ds",
            m: "%dm",
            mm: "%dm",
            h: "%dh",
            hh: "%dh",
            d: "%dd",
            dd: "%dd",
            M: "%dmo",
            MM: "%dmo",
            y: "%dy",
            yy: "%dy",
        },
    });

    return String(moment.duration(moment(date).diff(moment())).humanize(true));
};
