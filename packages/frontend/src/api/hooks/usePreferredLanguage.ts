import { useEffect, useRef } from "react";
import i18next from "i18next";
import moment from "moment-with-locales-es6";
import { initReactI18next } from "react-i18next";
import { useDispatch } from "react-redux";
import { EFeaturesRegistry } from "src/constants";
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
import { useFeatureFlags } from "./useFeatureFlags";

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

export const usePreferredLanguage = () => {
    const dispatch = useDispatch();
    const { enabled: isTranslationsAllowed } = useFeatureFlags(
        EFeaturesRegistry.Translations
    );
    const selectedLangCode = useAppSelector(
        (state) => state.ui.selectedLanguageCode
    );
    const prevLangCodeRef = useRef(selectedLangCode);
    const i18nInitRef = useRef(false);

    useEffect(() => {
        if (
            !isTranslationsAllowed &&
            i18next.language === selectedLangCode &&
            i18nInitRef.current === true
        ) {
            return;
        }
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
                Logger.info(
                    "usePreferredLanguage: i18n initialized successfully"
                );
            })
            .catch((e) => {
                Logger.error(
                    "usePreferredLanguage: could not initialize i18n",
                    e
                );
            });
        i18nInitRef.current = true;
    }, [isTranslationsAllowed, selectedLangCode]);

    useEffect(() => {
        if (
            !isTranslationsAllowed ||
            !selectedLangCode ||
            i18next.language === selectedLangCode
        ) {
            return;
        }
        moment.locale(selectedLangCode);
        i18next
            .changeLanguage(selectedLangCode)
            .then(() => {
                if (selectedLangCode !== prevLangCodeRef.current) {
                    prevLangCodeRef.current = selectedLangCode;
                    // Reset all queries
                    dispatch(alphadayApi.util.resetApiState());
                    // A way to reload all local state resetApiState is not enough
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
    }, [selectedLangCode, dispatch, isTranslationsAllowed]);
};
