import { logEvent } from "firebase/analytics";
import { EActivityLogEventTypes } from "../services/activity-log/types";
import { analytics } from "../utils/firebaseUtils";

import { Logger } from "../utils/logging";
import { useActivityLogger } from "./useActivityLogger";

export type TButtonClickEventPayload = {
    buttonName:
        | "kasandra-coin"
        | "kasandra-case"
        | "kasandra-date-range"
        | "kasandra-disclaimer"
        | "kasandra-datapoint"
        | "polymarket-market"
        | "polymarket-top-volume";
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
