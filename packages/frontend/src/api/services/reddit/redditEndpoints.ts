import queryString from "query-string";
import { Logger } from "src/api/utils/logging";
import CONFIG from "src/config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetRedditItemsRequest,
    TGetRedditItemsRawResponse,
    TGetRedditItemsResponse,
} from "./types";

const { SOCIALS } = CONFIG.API.DEFAULT.ROUTES;

const redditApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getRedditItems: builder.query<
            TGetRedditItemsResponse,
            TGetRedditItemsRequest
        >({
            query: (req) => {
                const params: string = queryString.stringify({
                    tags: req.tags,
                    page: req.page,
                    social_network: SOCIALS.REDDIT,
                });
                const path = `${String(SOCIALS.BASE)}?${params}`;
                Logger.debug("getRedditItems: querying", path);
                return path;
            },
            transformResponse: (
                r: TGetRedditItemsRawResponse
            ): TGetRedditItemsResponse => ({
                ...r,
                results: r.results.map((item) => ({
                    id: item.id,
                    title: item.title,
                    hash: item.hash,
                    url: item.url,
                    sourceName: item.source.name,
                    sourceUrl: item.url,
                    sourceIcon: item.source.icon,
                    sourceSlug: item.source.slug,
                    bookmarked: false, // default to false, implement later
                    startsAt: item.published_at,
                    endsAt: item.published_at,
                })),
            }),
        }),
    }),
    overrideExisting: false,
});

export const { useGetRedditItemsQuery } = redditApi;
