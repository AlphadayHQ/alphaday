import { useSendActivityLogMutation } from "src/api/services";
import {
    EActivityLogEventTypes,
    EActivityLogObjectTypes,
} from "src/api/services/activity-log/types";
import { ECookieChoice, EWalletConnectionMethod } from "src/api/types";
import { Logger } from "../utils/logging";

interface IActivityLogger {
    logCookieChoice: (choice: ECookieChoice) => void;
    logViewVisited: (id: number) => void;
    logKeywordSelected: (id: number) => void;
    logWalletConnection: (method: EWalletConnectionMethod) => void;
}

export const useActivityLogger = (): IActivityLogger => {
    const [sendActivityLog] = useSendActivityLogMutation();

    const logViewVisited = (viewId: number) => {
        sendActivityLog({
            event_type: EActivityLogEventTypes.ViewVisited,
            object_type: 3,
            object_id: viewId,
        })
            .unwrap()
            .then((resp) =>
                Logger.debug(
                    "useActivityLogger::logVisitedView: updated view activity log",
                    resp
                )
            )
            .catch((err) =>
                Logger.error(
                    "useActivityLogger::logVisitedView: error updating view activity log",
                    err
                )
            );
    };

    const logCookieChoice = (choice: ECookieChoice) => {
        sendActivityLog({
            event_type: EActivityLogEventTypes.CookieChoiceSet,
            data: {
                choice,
            },
        })
            .unwrap()
            .then((resp) =>
                Logger.debug(
                    "useActivityLogger::logCookieChoice: updated cookie activity log",
                    resp
                )
            )
            .catch((err) =>
                Logger.error(
                    "useActivityLogger::logCookieChoice: error updating cookie activity log",
                    err
                )
            );
    };

    const logKeywordSelected = (keywordId: number) => {
        sendActivityLog({
            event_type: EActivityLogEventTypes.KeywordSelected,
            object_id: keywordId,
            object_type: EActivityLogObjectTypes.Keyword,
        })
            .unwrap()
            .then((resp) =>
                Logger.debug(
                    "useActivityLogger::logKeywordSelected: updated keyword activity log",
                    resp
                )
            )
            .catch((err) =>
                Logger.error(
                    "useActivityLogger::logKeywordSelected: error updating keyword activity log",
                    err
                )
            );
    };

    const logWalletConnection = (method: EWalletConnectionMethod) => {
        sendActivityLog({
            event_type: EActivityLogEventTypes.WalletConnect,
            object_type: EActivityLogObjectTypes.WalletConnect,
            data: {
                method,
            },
        })
            .unwrap()
            .then((resp) =>
                Logger.debug(
                    "useActivityLogger::logWalletConnection: updated wallet connect activity log",
                    resp
                )
            )
            .catch((err) =>
                Logger.error(
                    "useActivityLogger::logWalletConnection: error updating wallet connect activity log",
                    err
                )
            );
    };

    return {
        logViewVisited,
        logCookieChoice,
        logKeywordSelected,
        logWalletConnection,
    };
};
