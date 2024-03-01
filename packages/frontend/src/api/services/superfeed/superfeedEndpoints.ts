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
                    sourceIcon: i.source.icon,
                    sourceSlug: i.source.slug,
                    sourceName: i.source.name,
                    tags: i.tags || [],
                    likes: i.likes,
                    comments: i.comments,
                    data: i.data,
                })),
            }),
            // When commented out, keepUnsedDataFor defaults to 60s
            // TODO(v-almonacid): Re-assess this value post-MVP release
            // keepUnusedDataFor: 60,
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
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetSuperfeedListQuery,
    useGetFilterDataQuery,
    useGetFilterKeywordsQuery,
} = superfeedApi;
