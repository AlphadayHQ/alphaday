import { useEffect, useRef } from "react";
import i18next from "i18next";
import moment from "moment-with-locales-es6";
import { useDispatch } from "react-redux";
import { alphadayApi } from "../services";
import { setSelectedLanguageCode } from "../store";
import { useAppSelector } from "../store/hooks";
import { ELanguageCode } from "../types/language";
import { Logger } from "../utils/logging";
import { useAllowedTranslations } from "./useAllowedTranslations";

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
            i18next.changeLanguage(lang).catch((e) => {
                Logger.error("usePreferredLanguage: could not change language", e);
            });
        } else if (i18next.language !== selectedLangCode) {
            i18next.changeLanguage(selectedLangCode).catch((e) => {
                Logger.error("usePreferredLanguage: could not change language", e);
            });
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
