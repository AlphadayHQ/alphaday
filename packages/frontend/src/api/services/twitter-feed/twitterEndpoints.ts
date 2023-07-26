import queryString from "query-string";
import { TTweets } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import { parseAsTweet, parseRemoteTweetV1 } from "src/api/utils/twitterUtils";
import CONFIG from "src/config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetTweetsRequest,
    TGetTweetsRawResponse,
    TGetTweetsResponse,
    TGetTweetsRequestV1,
    TGetTweetsRawResponseV1,
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
                results: r.results.map((t) => parseAsTweet(t.tweet)),
            }),
        }),
        getTweetsV1: builder.query<TGetTweetsResponse, TGetTweetsRequestV1>({
            query: (req) => {
                const params: string = queryString.stringify({
                    list_id: req.listId,
                    page_token: req.token,
                });
                const path = `${SOCIALS.TWITTER_V1}?${params}`;
                Logger.debug("getTweets: querying", path);
                return path;
            },
            transformResponse: (
                r: TGetTweetsRawResponseV1
            ): TGetTweetsResponse => {
                const parsedList: TTweets[] = [];
                r.data.forEach((t) => {
                    try {
                        const parsedTweet = parseAsTweet({
                            ...parseRemoteTweetV1(t, r),
                            referenced_tweets: t.referenced_tweets?.map(
                                (rt) => ({
                                    ...rt,
                                    tweet: {
                                        ...parseRemoteTweetV1(
                                            r.includes.tweets.filter(
                                                (tw) => tw.id === rt.id
                                            )[0],
                                            r
                                        ),
                                    },
                                })
                            ),
                        });
                        parsedList.push(parsedTweet);
                    } catch (_e) {
                        Logger.warn("getTweetsV1: Could not parse tweet", t);
                    }
                });
                return {
                    results: parsedList,
                    links: {
                        next: r.meta.next_token,
                        previous: null,
                    },
                    total: r.meta.result_count,
                };
            },
        }),
    }),
    overrideExisting: false,
});

export const { useGetTweetsQuery, useGetTweetsV1Query } = twitterApi;
