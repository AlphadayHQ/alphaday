import React from "react";
import { useTutorial, useActivityLogger } from "src/api/hooks";
import { useGetIpMetadataQuery } from "src/api/services";
import { setCookieChoice } from "src/api/store";
import { useAppSelector, useAppDispatch } from "src/api/store/hooks";
import { ECookieChoice } from "src/api/types";
import CookieDisclaimer, {
    TCookieChoiceProps,
} from "src/components/cookie-disclaimer/CookieDisclaimer";
import CONFIG from "src/config";
import i18n from "src/i18n";

const CookieDisclaimerContainer: React.FC = () => {
    const dispatch = useAppDispatch();
    const cookieChoice = useAppSelector((state) => state.ui.cookieChoice);

    const { logCookieChoice } = useActivityLogger();

    const { showTutorial } = useTutorial();

    const setChoice = (choice: ECookieChoice) => {
        dispatch(setCookieChoice(choice));
        logCookieChoice(choice);
    };

    const { data: ipMeta, isLoading } = useGetIpMetadataQuery(undefined, {
        skip:
            cookieChoice !== undefined &&
            cookieChoice > ECookieChoice.RejectAll,
    });

    // the cookie banner won't be displayed in any of the following situations:
    // - a choice different to RejectAll has been made
    // - user country doesn't belong to Europe
    if (
        isLoading ||
        (cookieChoice !== undefined &&
            cookieChoice > ECookieChoice.RejectAll) ||
        showTutorial ||
        (ipMeta && !ipMeta.in_eu)
    ) {
        return null;
    }

    const choices: Array<TCookieChoiceProps> = [
        {
            key: ECookieChoice.AcceptAll,
            buttonText: i18n.t("others.cookie.acceptAll"),
            handler: () => {
                setChoice(ECookieChoice.AcceptAll);
            },
            sortOrder: 0,
        },
        {
            key: ECookieChoice.AcceptEssential,
            buttonText: i18n.t("others.cookie.acceptEssential"),
            handler: () => {
                setChoice(ECookieChoice.AcceptEssential);
            },
            sortOrder: 1,
        },
    ];

    if (
        ipMeta?.country_code &&
        CONFIG.COOKIES.STRICT_COUNTRY_LIST.indexOf(ipMeta.country_code) !== -1
    ) {
        choices.push({
            key: ECookieChoice.RejectAll,
            buttonText: "Reject & Exit",
            isReject: true,
            handler: () => {
                setChoice(ECookieChoice.RejectAll);
                // exit app and go to homepage
                window.location.href = CONFIG.SEO.DOMAIN;
            },
            sortOrder: 2,
        });
    }

    return <CookieDisclaimer choices={choices} />;
};

export default CookieDisclaimerContainer;
