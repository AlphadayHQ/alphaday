import queryString from "query-string";
import { Logger } from "src/api/utils/logging";
import { alphadayApi } from "../alphadayApi";
import { TGetDynamicItemsRequest } from "../dynamic-modules/types";
import {
    TGetPollResponse,
    TGetPollRawResponse,
    TRemotePollChoice,
    TVotePollRequest,
} from "./types";

export const pollsApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getPolls: builder.query<TGetPollResponse, TGetDynamicItemsRequest>({
            query: (req) => {
                const { endpointUrl, ...queries } = req;
                const params: string = queryString.stringify(queries);
                Logger.debug(
                    "querying getPolls...",
                    `${endpointUrl}?${params}`
                );
                return `${endpointUrl}?${params}`;
            },
            transformResponse: (r: TGetPollRawResponse) => {
                const data = r.results[0];
                return (
                    data && {
                        id: data.id,
                        question: data.question,
                        choices: data.choices,
                        selectedChoiceId: data.user_choice || undefined,
                        isPublished: data.is_published,
                        totalVotes: data.votes_total,
                    }
                );
            },
        }),
        votePoll: builder.mutation<TRemotePollChoice, TVotePollRequest>({
            query: ({ endpointUrl, choiceId }) => ({
                url: `${endpointUrl}vote/${choiceId}/`,
                method: "POST",
                body: undefined,
            }),
        }),
    }),
    overrideExisting: false,
});

export const { useGetPollsQuery, useVotePollMutation } = pollsApi;
