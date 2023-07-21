import { createContext, FC } from "react";
import {
    addDoc,
    collection,
    getFirestore,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
    Unsubscribe,
    limit,
    where,
} from "firebase/firestore";
import { TCryptoAccount, TChatMessage } from "src/api/types";
import { firebaseApp, isConfigured } from "src/api/utils/firebaseUtils";
import { Logger } from "src/api/utils/logging";
import { truncateWithEllipsis } from "src/api/utils/textUtils";
import CONFIG from "src/config/config";

// Initialize Firebase
const { DEFAULT_ROOM } = CONFIG.FIREBASE;
const db = firebaseApp ? getFirestore(firebaseApp) : undefined;

interface IChatContext {
    sendMessage: (
        account: TCryptoAccount,
        message: string,
        roomId?: string
    ) => Promise<void>;
    getMessages: (
        callback: (m: Array<TChatMessage>) => void,
        prevMessages: TChatMessage[] | undefined,
        roomId?: string
    ) => void;
}

export const hasChatConfig = isConfigured;

export const sendMessage = async (
    account: TCryptoAccount,
    message: string,
    roomId = DEFAULT_ROOM
): Promise<void> => {
    if (db === undefined) return;
    if (account.address === null) return;
    try {
        await addDoc(collection(db, "rooms", roomId, "messages"), {
            address: account.address,
            displayName:
                account?.ens || truncateWithEllipsis(account.address, 8),
            text: message.trim(),
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        Logger.error("ChatContext::sendMessage: ", error);
    }
};

export const getMessages = (
    callback: (m: Array<TChatMessage>) => void,
    prevMessages: TChatMessage[] | undefined,
    roomId = DEFAULT_ROOM
): Unsubscribe | undefined => {
    if (db === undefined) return undefined;
    try {
        const lastTimestamp = prevMessages
            ? prevMessages[prevMessages.length - 1]?.timestamp
            : null;
        const curQuery = lastTimestamp
            ? query(
                  collection(db, "rooms", roomId, "messages"),
                  orderBy("timestamp", "desc"),
                  where("timestamp", "<", lastTimestamp),
                  limit(20)
              )
            : query(
                  collection(db, "rooms", roomId, "messages"),
                  orderBy("timestamp", "desc"),
                  limit(20)
              );
        return onSnapshot(curQuery, (querySnapshot) => {
            const messages = querySnapshot.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            }));
            callback(messages as TChatMessage[]);
        });
    } catch (error) {
        Logger.error("ChatContext::getMessages: ", error);
        return undefined;
    }
};

export const ChatContext = createContext<IChatContext>({
    sendMessage,
    getMessages,
});

if (!hasChatConfig) Logger.error("ChatContext: Chat env. config was not found");

export const ChatProvider: FC<{ children?: React.ReactNode }> = ({
    children,
}) => {
    return (
        <ChatContext.Provider value={{ sendMessage, getMessages }}>
            {children}
        </ChatContext.Provider>
    );
};
