import { Timestamp } from "firebase/firestore";

export type TChatMessage = {
    id: string;
    timestamp: Timestamp | null;
    address: string;
    text: string;
    displayName: string;
};

export type TGroupedChatMessages = {
    [key: string]: TChatMessage[];
};
