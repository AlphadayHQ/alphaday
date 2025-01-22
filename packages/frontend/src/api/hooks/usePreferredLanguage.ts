import { useEffect, useRef } from "react";
import i18next from "i18next";
import moment from "moment-with-locales-es6";
import { useDispatch } from "react-redux";
import { EFeaturesRegistry } from "src/constants";
import { alphadayApi } from "../services";
import { useAppSelector } from "../store/hooks";
import { Logger } from "../utils/logging";
import { useFeatureFlags } from "./useFeatureFlags";

export const usePreferredLanguage = () => {
    const dispatch = useDispatch();
    const { enabled: isTranslationsAllowed } = useFeatureFlags(
        EFeaturesRegistry.Translations
    );
    const selectedLangCode = useAppSelector(
        (state) => state.ui.selectedLanguageCode
    );
    const prevLangCodeRef = useRef(selectedLangCode);

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
