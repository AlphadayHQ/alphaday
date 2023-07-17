import { useState } from "react";
import { TNotificationMessage } from "../types";
import { Logger } from "../utils/logging";

export interface INotificationMessage {
    notifications: TNotificationMessage[];
    subscribe: () => void;
    unsubscribe: () => void;
    toggleRead: (id: string) => void;
    clearAll: () => void;
}

export const useNotifications = (): INotificationMessage => {
    const [notifications, setNotifications] = useState<TNotificationMessage[]>(
        []
    );

    const unsubscribe = () => {
        Logger.debug("useNotifications::unsubscribe called");
    };

    const subscribe = () => {
        Logger.debug("useNotifications::subscribe called");
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const toggleRead = (id: string) => {
        setNotifications((prevMessages) =>
            prevMessages.map((message) => {
                const updatedMessage = { ...message };
                if (updatedMessage.id === id) {
                    updatedMessage.read = !updatedMessage.read;
                }
                return updatedMessage;
            })
        );
    };

    return { notifications, unsubscribe, subscribe, toggleRead, clearAll };
};
