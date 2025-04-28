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
    translationZH,
} from "../../locales/translation";
import { alphadayApi } from "../services";
import { setSelectedLanguageCode } from "../store";
import { useAppSelector } from "../store/hooks";
import { ELanguageCode } from "../types/language";
import { Logger } from "../utils/logging";
import { useAllowedTranslations } from "./useAllowedTranslations";

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

const i18nInit = (selectedLangCode: ELanguageCode) => {
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
    const params = new URLSearchParams(window.location.search);

    const selectedLangCode = useAppSelector(
        (state) => state.ui.selectedLanguageCode
    );
    const prevLangCodeRef = useRef(selectedLangCode);

    const isLangAllowed = languages[selectedLangCode];

    useEffect(() => {
        const lang = params.get("lang");

        if (lang && lang in languages && selectedLangCode !== lang) {
            dispatch(setSelectedLanguageCode({ code: lang as ELanguageCode }));
            prevLangCodeRef.current = lang as ELanguageCode;
            i18nInit(lang as ELanguageCode);
        } else {
            i18nInit(selectedLangCode);
        }
        // this should only run once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (
            !selectedLangCode ||
            isLoading ||
            i18next.language === selectedLangCode
        ) {
            return;
        }
        const allowedLang = isLangAllowed ? selectedLangCode : ELanguageCode.EN;

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
                    const isEnglish = allowedLang === ELanguageCode.EN;
                    const queryString = isEnglish ? "" : `?lang=${allowedLang}`;
                    const newUrl = `${window.location.pathname}${queryString}`;

                    // Also a way to reload all local state invalidateTags is not enough
                    //  https://redux-toolkit.js.org/rtk-query/api/created-api/api-slice-utils#resetapistate:~:text=Note%20that%20hooks%20also%20track%20state%20in%20local%20component%20state%20and%20might%20not%20fully%20be%20reset%20by%20resetApiState.
                    setTimeout(() => {
                        window.location.assign(newUrl);
                    }, 5);
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
