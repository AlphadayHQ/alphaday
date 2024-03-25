import queryString from "query-string";
import { Logger } from "src/api/utils/logging";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetSuperfeedItemsRawResponse,
    TGetSuperfeedItemsResponse,
    TGetSuperfeedItemsRequest,
    TGetSuperfeedFilterDataRawResponse,
    TGetSuperfeedFilterDataResponse,
    TGetSuperfeedFilterDataRequest,
    TGetSuperfeedFilterKeywordsResponse,
    TGetSuperfeedFilterKeywordsRequest,
    TGetSuperfeedFilterKeywordsRawResponse,
    TLikeSuperfeedItemResponse,
    TLikeSuperfeedItemRequest,
    TLikeSuperfeedItemRawResponse,
} from "./types";

const { SUPERFEED } = CONFIG.API.DEFAULT.ROUTES;

export const superfeedApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getSuperfeedList: builder.query<
            TGetSuperfeedItemsResponse,
            TGetSuperfeedItemsRequest
        >({
            query: (req) => {
                const { ...reqParams } = req;
                const params: string = queryString.stringify(reqParams);
                const path = `${SUPERFEED.BASE}${SUPERFEED.DEFAULT}?${params}`;
                Logger.debug("getSuperfeedList: querying", path);
                return path;
            },
            transformResponse: (
                r: TGetSuperfeedItemsRawResponse
            ): TGetSuperfeedItemsResponse => ({
                ...r,
                results: r.results.map((i) => ({
                    id: i.id,
                    type: i.content_type,
                    itemId: i.item_id,
                    title: i.title,
                    date: i.item_date,
                    trendiness: i.trendiness,
                    url: i.url,
                    image: i.image,
                    shortDescription: i.short_description,
                    duration: i.duration,
                    fileUrl: i.file_url,
                    startsAt: i.starts_at,
                    endsAt: i.ends_at,
                    sourceIcon: i.source?.icon,
                    sourceSlug: i.source?.slug,
                    sourceName: i.source?.name,
                    tags: i.tags || [],
                    likes: i.likes,
                    isLiked: i.is_liked,
                    comments: i.comments,
                    data: {
                        coin: i.data?.coin,
                        price: i.data?.price,
                        history: i.data?.history,
                        location: i.data?.location,
                        itemType: i.data?.item_type,
                        projects: i.data?.projects,
                        projectType: i.data?.project_type,
                        gasFast: i.data?.GAS_FAST,
                        gasSlow: i.data?.GAS_SLOW,
                        gasStandard: i.data?.GAS_STANDARD,
                        gasPercentChange: i.data?.PERCENT_CHANGE,
                        gasPrevGasStandard: i.data?.PREV_GAS_STANDARD,
                    },
                })),
            }),
            providesTags: ["Superfeed"],
            // When commented out, keepUnsedDataFor defaults to 60s
            // TODO(v-almonacid): Re-assess this value post-MVP release
            // keepUnusedDataFor: 60,
        }),
        likeSuperfeedItem: builder.mutation<
            TLikeSuperfeedItemResponse,
            TLikeSuperfeedItemRequest
        >({
            query: (req) => ({
                url: `${SUPERFEED.BASE}${SUPERFEED.LIKE(req.id)}`,
                method: "POST",
                body: undefined,
            }),
            transformResponse: (
                i: TLikeSuperfeedItemRawResponse
            ): TLikeSuperfeedItemResponse => ({
                id: i.id,
                type: i.content_type,
                title: i.title,
                date: i.item_date,
                itemId: i.item_id,
                trendiness: i.trendiness,
                url: i.url,
                image: i.image,
                shortDescription: i.short_description,
                duration: i.duration,
                fileUrl: i.file_url,
                startsAt: i.starts_at,
                endsAt: i.ends_at,
                sourceIcon: i.source?.icon,
                sourceSlug: i.source?.slug,
                sourceName: i.source?.name,
                tags: i.tags || [],
                likes: i.likes,
                isLiked: i.is_liked,
                comments: i.comments,
                data: i.data,
            }),
            invalidatesTags: ["Superfeed"],
        }),
        getFilterData: builder.query<
            TGetSuperfeedFilterDataResponse,
            TGetSuperfeedFilterDataRequest
        >({
            query: () => {
                const path = `${SUPERFEED.BASE}${SUPERFEED.FILTER_DATA}`;
                Logger.debug("getSuperfeedFilterData: querying", path);
                return path;
            },
            transformResponse: (
                r: TGetSuperfeedFilterDataRawResponse
            ): TGetSuperfeedFilterDataResponse => ({
                coins: r.coins.filter(
                    (item, index, self) =>
                        self.findIndex(
                            (innerItem) => innerItem.slug === item.slug
                        ) === index
                ),
                conceptTags: r.concept_tags.filter(
                    (item, index, self) =>
                        self.findIndex(
                            (innerItem) => innerItem.slug === item.slug
                        ) === index
                ),
                chains: r.projects.filter(
                    (item, index, self) =>
                        self.findIndex(
                            (innerItem) => innerItem.slug === item.slug
                        ) === index
                ),
            }),
        }),
        getFilterKeywords: builder.query<
            TGetSuperfeedFilterKeywordsResponse,
            TGetSuperfeedFilterKeywordsRequest
        >({
            query: (req) => {
                const { ...reqParams } = req;
                const params: string = queryString.stringify(reqParams);
                const path = `${SUPERFEED.BASE}${SUPERFEED.FILTER_KEYWORDS}?${params}`;
                Logger.debug("getSuperfeedFilterKeywords: querying", path);
                return path;
            },
            transformResponse: (
                r: TGetSuperfeedFilterKeywordsRawResponse
            ): TGetSuperfeedFilterKeywordsResponse => ({
                coins: r.coin_keywords,
                conceptTags: r.concept_keywords,
                chains: r.chain_keywords,
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetSuperfeedListQuery,
    useGetFilterDataQuery,
    useGetFilterKeywordsQuery,
    useLikeSuperfeedItemMutation,
} = superfeedApi;
