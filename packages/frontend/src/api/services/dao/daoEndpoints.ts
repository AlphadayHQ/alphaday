import queryString from "query-string";
import { Logger } from "src/api/utils/logging";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetDaoItemsRequest,
    TGetDaoItemsResponse,
    TGetDaoItemsRawResponse,
} from "./types";

const { DAO } = CONFIG.API.DEFAULT.ROUTES;

const daoApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getDaoItems: builder.query<TGetDaoItemsResponse, TGetDaoItemsRequest>({
            query: (req) => {
                const params: string = queryString.stringify(req);
                Logger.debug(
                    "querying getDaoItems...",
                    `${DAO.BASE}${DAO.LIST}?${params}`
                );
                return `${DAO.BASE}${DAO.LIST}?${params}`;
            },
            transformResponse: (
                r: TGetDaoItemsRawResponse
            ): TGetDaoItemsResponse => ({
                ...r,
                results: r.results.map((i) => {
                    return {
                        id: i.id,
                        title: i.title,
                        url: i.url,
                        sourceIcon: i.source.icon,
                        sourceSlug: i.source.slug,
                        sourceName: i.source.name,
                        startsAt: i.starts_at,
                        endsAt: i.ends_at,
                        bookmarked: i.is_bookmarked,
                    };
                }),
            }),
            keepUnusedDataFor: 0,
        }),
    }),
    overrideExisting: false,
});

export const { useGetDaoItemsQuery } = daoApi;
