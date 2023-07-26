import queryString from "query-string";
import { Logger } from "src/api/utils/logging";
import { alphadayApi } from "../alphadayApi";
import { TGetDynamicItemsRequest, TGetDynamicItemsResponse } from "./types";

export const dynamicApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getDynamicItems: builder.query<
            TGetDynamicItemsResponse,
            TGetDynamicItemsRequest
        >({
            query: (req) => {
                const { endpointUrl, ...queries } = req;
                const params: string = queryString.stringify(queries);
                Logger.debug(
                    "querying getDynamicItems...",
                    `${endpointUrl}?${params}`
                );
                return `${endpointUrl}?${params}`;
            },
        }),
    }),
    overrideExisting: false,
});

export const { useGetDynamicItemsQuery } = dynamicApi;
