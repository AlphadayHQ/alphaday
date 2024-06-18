import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import CONFIG from "../../config/config";
import { Logger } from "../utils/logging";

const API_CONFIG = CONFIG.API.DEFAULT;
const { BLOBS_URL } = API_CONFIG;

export type TGetUniswapTokenListRequest = void;
export type TGetUniswapTokenListResponse = string;

export const blobsApi = createApi({
    reducerPath: "blobsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BLOBS_URL,
    }),
    endpoints: (builder) => ({
        getTokensList: builder.query<
            TGetUniswapTokenListResponse,
            TGetUniswapTokenListRequest
        >({
            query: () => {
                const path = `${BLOBS_URL}tokens-uniswap.json`;
                Logger.debug("getTokensList: querying", path);
                return path;
            },
        }),
    }),
});

export const { useGetTokensListQuery } = blobsApi;
