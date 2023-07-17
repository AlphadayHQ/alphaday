import queryString from "query-string";
import { Logger } from "src/api/utils/logging";
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
                const params: string = queryString.stringify(queries);
                Logger.debug(
                    "getCustomItems: querying",
                    `${endpointUrl}?${params}`
                );
                return `${endpointUrl}?${params}`;
            },
        }),
    }),
    overrideExisting: false,
});

export const { useGetCustomItemsQuery } = customApi;
