import { useRef } from "react";
import i18next from "i18next";
import moment from "moment-with-locales-es6";
import { useAppSelector } from "../store/hooks";
import { Logger } from "../utils/logging";

export const usePreferredLanguage = () => {
    const selectedLangCode = useAppSelector(
        (state) => state.ui.selectedLanguageCode
    );
    const prevLangCodeRef = useRef(selectedLangCode);

    if (selectedLangCode) {
        i18next.changeLanguage(selectedLangCode).catch((e) => {
            Logger.error("usePreferredLanguage::Error changing language::", e);
        });
        moment.locale(selectedLangCode);

        if (selectedLangCode !== prevLangCodeRef.current) {
            prevLangCodeRef.current = selectedLangCode;
            location.reload();
        }
    }
};
