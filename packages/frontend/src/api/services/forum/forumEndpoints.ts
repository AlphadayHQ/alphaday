import queryString from "query-string";
import { Logger } from "src/api/utils/logging";
import CONFIG from "src/config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetForumItemsRequest,
    TGetForumItemsResponse,
    TGetForumItemsRawResponse,
} from "./types";

const { FORUM } = CONFIG.API.DEFAULT.ROUTES;

const forumApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getForumItems: builder.query<
            TGetForumItemsResponse,
            TGetForumItemsRequest
        >({
            query: (req) => {
                const params: string = queryString.stringify(req);
                Logger.debug(
                    "querying getForumItems...",
                    `${FORUM.BASE}${FORUM.LIST}?${params}`
                );
                return `${FORUM.BASE}${FORUM.LIST}?${params}`;
            },
            transformResponse: (
                r: TGetForumItemsRawResponse
            ): TGetForumItemsResponse => ({
                ...r,
                results: r.results.map((i) => {
                    return {
                        id: i.id,
                        title: i.title,
                        url: i.url,
                        sourceIcon: i.source.icon,
                        sourceSlug: i.source.slug,
                        sourceName: i.source.name,
                        startsAt: i.published_at,
                        endsAt: i.published_at,
                        bookmarked: i.is_bookmarked,
                    };
                }),
            }),
            keepUnusedDataFor: 0,
        }),
    }),
    overrideExisting: false,
});

export const { useGetForumItemsQuery } = forumApi;
