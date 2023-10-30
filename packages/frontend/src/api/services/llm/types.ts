export type TRemoteQnA = {
    question: string;
    answer: string;
};

export type TGetLlmQnARequest = {
    question: string;
};

export type TGetLlmQnAResponse = TRemoteQnA;
