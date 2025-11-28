import queryString from "query-string";
import { Logger } from "src/api/utils/logging";
import CONFIG from "src/config";
import { alphadayApi } from "../alphadayApi";
import { TGetCustomItemsRequest, TGetCustomItemsResponse } from "./types";

export const customApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getCustomItems: builder.query<
            TGetCustomItemsResponse,
            TGetCustomItemsRequest
        >({
            query: (req) => {
                const { endpointUrl, ...queries } = req;
                const endpoint = new URL(
                    endpointUrl,
                    CONFIG.API.DEFAULT.API_BASE_URL
                );
                // endpoint may have existing query params, so we need to merge them
                const existingQueries = queryString.parse(endpoint.search);
                const mergedQueries = { ...existingQueries, ...queries };
                endpoint.search = queryString.stringify(mergedQueries);
                Logger.debug(
                    "getCustomItems: querying",
                    `${endpoint.toString()}`
                );
                return endpoint.toString();
            },
        }),
    }),
    overrideExisting: false,
});

export const { useGetCustomItemsQuery } = customApi;
