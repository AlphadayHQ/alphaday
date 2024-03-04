import queryString from "query-string";
import { EItemFeedPreference } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetVideoItemsRequest,
    TGetVideoItemsRawResponse,
    TGetVideoItemsResponse,
    TOpenVideoItemRequest,
    TOpenVideoItemResponse,
    TBookmarkVideoItemResponse,
    TBookmarkVideoItemRequest,
    TGetVideoChannelsResponse,
    TGetLatestVideoResponse,
    TGetLatestVideoRequest,
    TGetLatestVideoRawResponse,
} from "./types";

const { VIDEO, SOURCES } = CONFIG.API.DEFAULT.ROUTES;

const VIDEO_ROUTE = {
    [EItemFeedPreference.Trending]: VIDEO.TRENDING,
    [EItemFeedPreference.Bookmark]: VIDEO.BOOKMARKS,
    [EItemFeedPreference.Last]: VIDEO.LIST,
};

export const videoApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getLatestVideo: builder.query<
            TGetLatestVideoResponse,
            TGetLatestVideoRequest
        >({
            query: (req) => {
                const params: string = queryString.stringify(req);
                const path = `${String(VIDEO.BASE)}${String(
                    VIDEO.LATEST
                )}?${params}`;
                Logger.debug("getLatestVideo: querying", path);
                return path;
            },
            transformResponse: (
                r: TGetLatestVideoRawResponse
            ): TGetLatestVideoResponse => ({
                id: r.id,
                title: r.title,
                url: r.url,
                sourceIcon: r.source.icon,
                sourceSlug: r.source.slug,
                sourceName: r.source.name,
                publishedAt: r.published_at,
                bookmarked: r.is_bookmarked,
                image: r.image,
                shortDescription: r.short_description,
            }),
            keepUnusedDataFor: 0,
        }),
        getVideoList: builder.query<
            TGetVideoItemsResponse,
            TGetVideoItemsRequest
        >({
            query: (req) => {
                const { feedPreference, ...reqParams } = req;
                const params: string = queryString.stringify(reqParams);
                const route =
                    VIDEO_ROUTE[feedPreference || EItemFeedPreference.Last];
                const path = `${String(VIDEO.BASE)}${String(route)}?${params}`;
                Logger.debug("getVideoList: querying", path);
                return path;
            },
            transformResponse: (
                r: TGetVideoItemsRawResponse
            ): TGetVideoItemsResponse => ({
                ...r,
                results: r.results.map((i) => ({
                    id: i.id,
                    title: i.title,
                    url: i.url,
                    sourceIcon: i.source.icon,
                    sourceSlug: i.source.slug,
                    sourceName: i.source.name,
                    publishedAt: i.published_at,
                    numClicks: i.num_clicks,
                    bookmarked: i.is_bookmarked,
                    image: i.image,
                    shortDescription: i.short_description,
                })),
            }),
            keepUnusedDataFor: 0,
        }),
        getVideoChannelsList: builder.query<TGetVideoChannelsResponse, void>({
            query: () => {
                const path = `${String(SOURCES.BASE)}${String(SOURCES.VIDEO)}`;
                Logger.debug("getVideoList: querying", path);
                return path;
            },
            keepUnusedDataFor: 0,
        }),
        bookmarkVideoItem: builder.mutation<
            TBookmarkVideoItemResponse,
            TBookmarkVideoItemRequest
        >({
            query: (req: TBookmarkVideoItemRequest) => {
                const { item } = req;
                const path = `${String(VIDEO.BASE)}${String(
                    VIDEO.BOOKMARK(item.id)
                )}`;
                Logger.debug("bookmarkVideoItem: querying", path);
                return {
                    url: path,
                    method: "POST",
                    body: {},
                };
            },
        }),
        likeVideoItem: builder.mutation<
            TBookmarkVideoItemResponse,
            TBookmarkVideoItemRequest
        >({
            query: (req: TBookmarkVideoItemRequest) => {
                const { item } = req;
                const path = `${String(VIDEO.BASE)}${String(
                    VIDEO.LIKE(item.id)
                )}`;
                Logger.debug("likeVideoItem: querying", path);
                return {
                    url: path,
                    method: "POST",
                    body: {},
                };
            },
        }),
        openVideoItem: builder.mutation<
            TOpenVideoItemResponse,
            TOpenVideoItemRequest
        >({
            query: (request) => {
                const path = `${String(VIDEO.BASE)}${String(
                    VIDEO.CLICKED(request.id)
                )}`;
                Logger.debug("openVideoItem: querying", path);
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
    useGetVideoListQuery,
    useGetLatestVideoQuery,
    useOpenVideoItemMutation,
    useBookmarkVideoItemMutation,
    useGetVideoChannelsListQuery,
    useLikeVideoItemMutation,
} = videoApi;
