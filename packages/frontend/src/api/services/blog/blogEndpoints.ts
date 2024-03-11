import queryString from "query-string";
import { EItemFeedPreference } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetBlogItemsRequest,
    TGetBlogItemsRawResponse,
    TGetBlogItemsResponse,
    TOpenBlogItemRequest,
    TOpenBlogItemResponse,
    TBookmarkBlogItemRequest,
    TBookmarkBlogItemResponse,
    TLikeBlogItemRequest,
    TLikeBlogItemResponse,
} from "./types";

const { BLOG } = CONFIG.API.DEFAULT.ROUTES;

const BLOG_ROUTE = {
    [EItemFeedPreference.Trending]: BLOG.TRENDING,
    [EItemFeedPreference.Bookmark]: BLOG.BOOKMARKS,
    [EItemFeedPreference.Last]: BLOG.LIST,
};

export const blogApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getBlogList: builder.query<TGetBlogItemsResponse, TGetBlogItemsRequest>(
            {
                query: (req) => {
                    const { feedPreference, ...reqParams } = req;
                    const params: string = queryString.stringify(reqParams);
                    const route =
                        BLOG_ROUTE[feedPreference || EItemFeedPreference.Last];
                    const path = `${BLOG.BASE}${String(route)}?${params}`;
                    Logger.debug("getBlogList: querying", path);
                    return path;
                },
                transformResponse: (
                    r: TGetBlogItemsRawResponse
                ): TGetBlogItemsResponse => ({
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
        bookmarkBlogItem: builder.mutation<
            TBookmarkBlogItemResponse,
            TBookmarkBlogItemRequest
        >({
            query: (req: TBookmarkBlogItemRequest) => {
                const { item } = req;
                const path = `${BLOG.BASE}${BLOG.BOOKMARK(item.id)}`;
                Logger.debug("bookmarkBlogItem: querying", path);
                return {
                    url: path,
                    method: "POST",
                    body: {},
                };
            },
        }),
        likeBlogItem: builder.mutation<
            TLikeBlogItemResponse,
            TLikeBlogItemRequest
        >({
            query: (req: TLikeBlogItemRequest) => {
                const path = `${BLOG.BASE}${BLOG.LIKE(req.id)}`;
                Logger.debug("likeBlogItem: querying", path);
                return {
                    url: path,
                    method: "POST",
                    body: {},
                };
            },
            invalidatesTags: ["Superfeed"],
        }),
        openBlogItem: builder.mutation<
            TOpenBlogItemResponse,
            TOpenBlogItemRequest
        >({
            query: (request) => {
                const path = `${String(BLOG.BASE)}${String(
                    BLOG.CLICKED(request.id)
                )}`;
                Logger.debug("openBlogItem: querying", path);
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
    useGetBlogListQuery,
    useOpenBlogItemMutation,
    useBookmarkBlogItemMutation,
    useLikeBlogItemMutation,
} = blogApi;
