import i18next from "i18next";
import { useAppSelector } from "../store/hooks";
import { Logger } from "../utils/logging";

export const usePreferredLanguage = () => {
    const selectedCode = useAppSelector(
        (state) => state.ui.selectedLanguageCode
    );
    if (selectedCode) {
        i18next.changeLanguage(selectedCode).catch((e) => {
            Logger.error("usePreferredLanguage::Error changing language::", e);
        });
    }
};
