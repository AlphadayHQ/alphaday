import esLocale from "@fullcalendar/core/locales/es";
import frLocale from "@fullcalendar/core/locales/fr";
import jaLocale from "@fullcalendar/core/locales/ja";

export const getCalendarLocale = (localeCode: string) => {
    const localesMap = {
        ja: jaLocale,
        es: esLocale,
        fr: frLocale,
    };

    return Object.entries(localesMap).find(([key]) => key === localeCode)?.[1];
};
