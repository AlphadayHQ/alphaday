import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { EnumLanguageCode } from "./api/types/language";
import { Logger } from "./api/utils/logging";
import {
    translationEN,
    translationES,
    translationFR,
    translationJA,
    translationTR,
} from "./locales/translation";

const resources: Record<EnumLanguageCode, { translation: JSONObject }> = {
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
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        resources,
        fallbackLng: "en",
        detection: {
            order: ["navigator", "htmlTag", "path", "subdomain"],
        },
        interpolation: {
            escapeValue: false,
        },
    })
    .then(() => {
        Logger.info("i18n.ts: i18n initialized successfully");
    })
    .catch((e) => {
        Logger.error("i18n.ts: could not initialize i18n", e);
    });

export default i18n;
