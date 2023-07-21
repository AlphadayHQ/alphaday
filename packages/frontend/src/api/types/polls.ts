export type TPollChoice = {
    id: number;
    choice: string;
    votes: number;
};

export type TPoll = {
    id: number;
    question: string;
    choices: TPollChoice[];
    selectedChoiceId: number | undefined;
    isPublished: boolean;
    totalVotes: number;
};
