export type TQnA = {
    id: number;
    question: string;
    answer: string | undefined;
    updatedAt?: string;
};

export type TConversation = TQnA[];
