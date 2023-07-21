import { useCallback, useEffect, useState } from "react";
import {
    getMessages,
    sendMessage,
    hasChatConfig,
} from "src/api/store/providers/chat-context";
import { TCryptoAccount, TChatMessage } from "../types";
import { Logger } from "../utils/logging";

interface IMessages {
    messages: Array<TChatMessage> | undefined;
    sendMessage: (
        account: TCryptoAccount,
        message: string,
        roomId?: string
    ) => void;
    getPrevMessages: () => void;
    hasChatConfig: boolean;
}

const useMessages = (roomId?: string): IMessages => {
    const [messages, setMessages] = useState<TChatMessage[]>();
    const handleSendMessage = (
        account: TCryptoAccount,
        message: string,
        rId?: string
    ): void => {
        sendMessage(account, message, rId).catch((err) =>
            Logger.error(
                "useMessages::handleSendMessage: Unexpected Error",
                err
            )
        );
    };

    const getPrevMessages = useCallback(() => {
        getMessages(
            (m: TChatMessage[]) => {
                setMessages(m);
            },
            messages,
            roomId
        );
    }, [messages, roomId]);

    useEffect(() => {
        // getMessages returns an unsubscribe method
        const unsubscribe = getMessages(
            (m: TChatMessage[]) => {
                setMessages(m);
            },
            undefined,
            roomId
        );

        return unsubscribe;
    }, [roomId]);

    return {
        messages,
        sendMessage: handleSendMessage,
        getPrevMessages,
        hasChatConfig,
    };
};

export { useMessages };
