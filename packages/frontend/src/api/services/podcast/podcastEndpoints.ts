import queryString from "query-string";
import { EItemFeedPreference } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetPodcastItemsRequest,
    TGetPodcastItemsRawResponse,
    TGetPodcastItemsResponse,
    TOpenPodcastItemRequest,
    TOpenPodcastItemResponse,
    TBookmarkPodcastItemResponse,
    TBookmarkPodcastItemRequest,
    TGetPodcastChannelsResponse,
    TLikePodcastItemRequest,
    TLikePodcastItemResponse,
} from "./types";

const { PODCAST, SOURCES } = CONFIG.API.DEFAULT.ROUTES;

const PODCAST_ROUTE = {
    [EItemFeedPreference.Trending]: PODCAST.TRENDING,
    [EItemFeedPreference.Bookmark]: PODCAST.BOOKMARKS,
    [EItemFeedPreference.Last]: PODCAST.LIST,
};

export const podcastApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getPodcastList: builder.query<
            TGetPodcastItemsResponse,
            TGetPodcastItemsRequest
        >({
            query: (req) => {
                const { feedPreference, ...reqParams } = req;
                const params: string = queryString.stringify(reqParams);
                const route =
                    PODCAST_ROUTE[feedPreference || EItemFeedPreference.Last];
                const path = `${String(PODCAST.BASE)}${String(
                    route
                )}?${params}`;
                Logger.debug("getPodcastList: querying", path);
                return path;
            },
            transformResponse: (
                r: TGetPodcastItemsRawResponse
            ): TGetPodcastItemsResponse => ({
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
                    duration: i.duration,
                    fileUrl: i.file_url,
                })),
            }),
            keepUnusedDataFor: 0,
        }),
        getPodcastChannelsList: builder.query<
            TGetPodcastChannelsResponse,
            void
        >({
            query: () => {
                const path = `${SOURCES.BASE}${SOURCES.PODCAST}`;
                Logger.debug("getPodcastList: querying", path);
                return path;
            },
            keepUnusedDataFor: 0,
        }),
        bookmarkPodcastItem: builder.mutation<
            TBookmarkPodcastItemResponse,
            TBookmarkPodcastItemRequest
        >({
            query: (req: TBookmarkPodcastItemRequest) => {
                const { item } = req;
                const path = `${PODCAST.BASE}${PODCAST.BOOKMARK(item.id)}`;
                Logger.debug("bookmarkPodcastItem: querying", path);
                return {
                    url: path,
                    method: "POST",
                    body: {},
                };
            },
        }),
        likePodcastItem: builder.mutation<
            TLikePodcastItemResponse,
            TLikePodcastItemRequest
        >({
            query: (req: TLikePodcastItemRequest) => {
                const path = `${PODCAST.BASE}${PODCAST.LIKE(req.id)}`;
                Logger.debug("likePodcastItem: querying", path);
                return {
                    url: path,
                    method: "POST",
                    body: {},
                };
            },
            invalidatesTags: ["SuperfeedItems"],
        }),
        openPodcastItem: builder.mutation<
            TOpenPodcastItemResponse,
            TOpenPodcastItemRequest
        >({
            query: (request) => {
                const path = `${PODCAST.BASE}${PODCAST.CLICKED(request.id)}`;
                Logger.debug("openPodcastItem: querying", path);
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
    useGetPodcastListQuery,
    useOpenPodcastItemMutation,
    useBookmarkPodcastItemMutation,
    useGetPodcastChannelsListQuery,
    useLikePodcastItemMutation,
} = podcastApi;
