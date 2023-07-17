import { TPoll } from "src/api/types";
import { TPagination } from "../baseTypes";

export type TRemotePollChoice = {
    id: number;
    choice: string;
    votes: number;
};

export type TRemotePoll = {
    id: number;
    question: string;
    choices: TRemotePollChoice[];
    user_choice: number;
    is_published: boolean;
    votes_total: number;
};

export type TGetPollRawResponse = TPagination & {
    results: TRemotePoll[];
};

export type TGetPollResponse = TPoll;

export type TVotePollRequest = {
    choiceId: number;
    endpointUrl: string;
};
