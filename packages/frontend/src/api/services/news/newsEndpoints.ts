import queryString from "query-string";
import { EItemFeedPreference } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetNewsItemsRequest,
    TGetNewsItemsRawResponse,
    TGetNewsItemsResponse,
    TOpenNewsItemRequest,
    TOpenNewsItemResponse,
    TBookmarkNewsItemRequest,
    TBookmarkNewsItemResponse,
    TGetNewsSummaryRawResponse,
    TGetNewsSummaryRequest,
} from "./types";

const { NEWS } = CONFIG.API.DEFAULT.ROUTES;

const NEWS_ROUTE = {
    [EItemFeedPreference.Trending]: NEWS.TRENDING,
    [EItemFeedPreference.Bookmark]: NEWS.BOOKMARKS,
    [EItemFeedPreference.Last]: NEWS.LIST,
};

const newsApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getNewsList: builder.query<TGetNewsItemsResponse, TGetNewsItemsRequest>(
            {
                query: (req) => {
                    const { feedPreference, ...reqParams } = req;
                    const params: string = queryString.stringify(reqParams);
                    const route =
                        NEWS_ROUTE[feedPreference || EItemFeedPreference.Last];
                    const path = `${NEWS.BASE}${String(route)}?${params}`;
                    Logger.debug("getNewsList: querying", path);
                    return path;
                },
                transformResponse: (
                    r: TGetNewsItemsRawResponse
                ): TGetNewsItemsResponse => ({
                    ...r,
                    results: r.results.map((i) => ({
                        id: i.id,
                        title: i.title,
                        url: i.url,
                        sourceIcon: i.source.icon,
                        sourceSlug: i.source.slug,
                        sourceName: i.source.name,
                        author: i.author,
                        publishedAt: i.published_at,
                        numClicks: i.num_clicks,
                        bookmarked: i.is_bookmarked,
                    })),
                }),
                keepUnusedDataFor: 0,
            }
        ),
        getNewsSummary: builder.query<
            TGetNewsSummaryRawResponse,
            TGetNewsSummaryRequest
        >({
            query: (req) => {
                const params: string = queryString.stringify(req);
                const path = `${NEWS.BASE}${NEWS.SUMMARY}?${params}`;
                Logger.debug("getNewsList: querying", path);
                return path;
            },
            keepUnusedDataFor: 0,
        }),
        bookmarkNewsItem: builder.mutation<
            TBookmarkNewsItemResponse,
            TBookmarkNewsItemRequest
        >({
            query: (req: TBookmarkNewsItemRequest) => {
                const { item } = req;
                const path = `${String(NEWS.BASE)}${String(
                    NEWS.BOOKMARK(item.id)
                )}`;
                Logger.debug("bookmarkNewsItem: querying", path);
                return {
                    url: path,
                    method: "POST",
                    body: {},
                };
            },
        }),
        likeNewsItem: builder.mutation<
            TBookmarkNewsItemResponse,
            TBookmarkNewsItemRequest
        >({
            query: (req: TBookmarkNewsItemRequest) => {
                const { item } = req;
                const path = `${String(NEWS.BASE)}${String(
                    NEWS.LIKE(item.id)
                )}`;
                Logger.debug("likeNewsItem: querying", path);
                return {
                    url: path,
                    method: "POST",
                    body: {},
                };
            },
        }),
        openNewsItem: builder.mutation<
            TOpenNewsItemResponse,
            TOpenNewsItemRequest
        >({
            query: (request) => {
                const path = `${String(NEWS.BASE)}${String(
                    NEWS.CLICKED(request.id)
                )}`;
                Logger.debug("openNewsItem: querying", path);
                return {
                    url: path,
                    method: "POST",
                    body: request,
                };
            },
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetNewsListQuery,
    useGetNewsSummaryQuery,
    useOpenNewsItemMutation,
    useBookmarkNewsItemMutation,
    useLikeNewsItemMutation,
} = newsApi;
