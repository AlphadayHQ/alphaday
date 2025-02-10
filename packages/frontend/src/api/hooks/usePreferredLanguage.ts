import { useEffect, useRef } from "react";
import i18next from "i18next";
import moment from "moment-with-locales-es6";
import { initReactI18next } from "react-i18next";
import { useDispatch } from "react-redux";
import {
    translationEN,
    translationES,
    translationFR,
    translationJA,
    translationTR,
} from "../../locales/translation";
import { alphadayApi } from "../services";
import { useAppSelector } from "../store/hooks";
import { EnumLanguageCode } from "../types/language";
import { Logger } from "../utils/logging";
import { useAllowedTranslations } from "./useAllowedTranslations";

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

const i18nInit = (selectedLangCode: EnumLanguageCode) => {
    i18next
        .use(initReactI18next)
        .init({
            debug: true,
            resources,
            fallbackLng: selectedLangCode,
            detection: {
                order: ["navigator", "htmlTag", "path", "subdomain"],
            },
            interpolation: {
                escapeValue: false,
            },
        })
        .then(() => {
            Logger.info("usePreferredLanguage: i18n initialized successfully");
        })
        .catch((e) => {
            Logger.error("usePreferredLanguage: could not initialize i18n", e);
        });
};

export const usePreferredLanguage = () => {
    const dispatch = useDispatch();
    const { isLoading, languages } = useAllowedTranslations();
    const selectedLangCode = useAppSelector(
        (state) => state.ui.selectedLanguageCode
    );
    const prevLangCodeRef = useRef(selectedLangCode);

    i18nInit(selectedLangCode);

    const isLangAllowed = languages[selectedLangCode];

    useEffect(() => {
        if (
            !selectedLangCode ||
            isLoading ||
            i18next.language === selectedLangCode
        ) {
            return;
        }
        const allowedLang = isLangAllowed
            ? selectedLangCode
            : EnumLanguageCode.EN;

        moment.locale(allowedLang);
        i18next
            .changeLanguage(allowedLang)
            .then(() => {
                if (allowedLang !== prevLangCodeRef.current) {
                    prevLangCodeRef.current = allowedLang;
                    // Reset all queries

                    dispatch(
                        alphadayApi.util.invalidateTags([
                            "SubscribedViews",
                            "Views",
                        ])
                    );

                    // A way to reload all local state invalidateTags is not enough
                    //  https://redux-toolkit.js.org/rtk-query/api/created-api/api-slice-utils#resetapistate:~:text=Note%20that%20hooks%20also%20track%20state%20in%20local%20component%20state%20and%20might%20not%20fully%20be%20reset%20by%20resetApiState.
                    setTimeout(() => window.location.reload(), 5);
                }
            })
            .catch((e) => {
                Logger.error(
                    "usePreferredLanguage::Error changing language::",
                    e
                );
            });
    }, [selectedLangCode, dispatch, isLangAllowed, isLoading]);
};
