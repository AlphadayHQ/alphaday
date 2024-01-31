import queryString from "query-string";
import { Logger } from "src/api/utils/logging";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetSuperfeedItemsRawResponse,
    TGetSuperfeedItemsResponse,
    TGetSuperfeedItemsRequest,
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
                const path = `${String(SUPERFEED.BASE)}?${params}`;
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
                    itemDate: i.item_date,
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
                    tags: i.tags,
                    likes: i.likes,
                    comments: i.comments,
                })),
            }),
            keepUnusedDataFor: 0,
        }),
    }),
    overrideExisting: false,
});

export const { useGetSuperfeedListQuery } = superfeedApi;
