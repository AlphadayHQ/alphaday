import queryString from "query-string";
import { Logger } from "src/api/utils/logging";
import { parseAsTweet } from "src/api/utils/twitterUtils";
import CONFIG from "src/config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetTweetsRequest,
    TGetTweetsRawResponse,
    TGetTweetsResponse,
} from "./types";

const { SOCIALS } = CONFIG.API.DEFAULT.ROUTES;

const twitterApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getTweets: builder.query<TGetTweetsResponse, TGetTweetsRequest>({
            query: (req) => {
                const params: string = queryString.stringify({
                    tags: req.tags,
                    page: req.page,
                    social_network: SOCIALS.TWITTER,
                });
                const path = `${String(SOCIALS.BASE)}?${params}`;
                Logger.debug("getTweets: querying", path);
                return path;
            },
            transformResponse: (
                r: TGetTweetsRawResponse
            ): TGetTweetsResponse => ({
                ...r,
                results: r.results.map((t) => ({
                    ...t,
                    tweet: parseAsTweet(t.tweet),
                })),
            }),
        }),
    }),
    overrideExisting: false,
});

export const { useGetTweetsQuery } = twitterApi;
