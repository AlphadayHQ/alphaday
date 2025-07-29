import { logEvent } from "firebase/analytics";
import { EActivityLogEventTypes } from "../services/activity-log/types";
import { analytics } from "../utils/firebaseUtils";

import { Logger } from "../utils/logging";
import { useActivityLogger } from "./useActivityLogger";

type TButtonClickEventPayload = {
    buttonName:
        | "menu"
        | "like"
        | "share"
        | "bookmark"
        | "comments"
        | "action"
        | "ad_action"
        | "customize_pill_card"
        | "customize_pill_settings"
        | "update_page_button"
        | "update_pop_up_button";
    data?: JSONValue;
};

export const useCustomAnalytics = () => {
    const { logButtonClicked: logButtonClickedActivity } = useActivityLogger();

    const logButtonClicked = (payload: TButtonClickEventPayload) => {
        const key = EActivityLogEventTypes.ButtonClicked;
        logEvent(analytics, key, payload);
        logButtonClickedActivity(payload.buttonName, payload.data);
        Logger.debug("logButtonClicked", key, payload);
    };

    return {
        logButtonClicked,
    };
};
