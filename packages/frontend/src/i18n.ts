import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import {
    translationEN,
    translationES,
    translationFR,
    translationJA,
    translationTR,
    translationZH,
} from "./locales/translation";
import { ELanguageCode } from "./api/types/language";

const resources: Record<ELanguageCode, { translation: JSONObject }> = {
    en: {
        translation: translationEN,
    },
    ja: {
        translation: translationJA,
    },
    es: {
        translation: translationES,
    },
    fr: {
        translation: translationFR,
    },
    tr: {
        translation: translationTR,
    },
    zh: {
        translation: translationZH,
    },
};

// Initialize i18n synchronously at module load time
i18next.use(initReactI18next).init({
    debug: true,
    resources,
    fallbackLng: ELanguageCode.EN,
    lng: ELanguageCode.EN,
    detection: {
        order: ["navigator", "htmlTag", "path", "subdomain"],
    },
    interpolation: {
        escapeValue: false,
    },
});

export default i18next;
