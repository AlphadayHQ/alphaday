import queryString from "query-string";
import { Logger } from "src/api/utils/logging";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetKeyValueRequest,
    TGetKeyValueResponse,
    TGetMultiKeyValueRequest,
    TGetMultiKeyValueResponse,
    TGetMultiKeyValueRawResponse,
    TGetKeyValueRawResponse,
    TGetEthereumLastBlockRequest,
    TGetEthereumLastBlockResponse,
} from "./types";

const API_CONFIG = CONFIG.API.DEFAULT;
const { KEY_VALUE } = API_CONFIG.ROUTES;

const keyValueApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getKeyValue: builder.query<TGetKeyValueResponse, TGetKeyValueRequest>({
            query: (req) => {
                const path = `${String(KEY_VALUE.BASE)}/${String(req.key)}/`;
                Logger.debug("getKeyValue: querying...", path);
                return path;
            },
            transformResponse: (
                r: TGetKeyValueRawResponse
            ): TGetKeyValueResponse => r,
        }),
        getMultiKeyValue: builder.query<
            TGetMultiKeyValueResponse,
            TGetMultiKeyValueRequest
        >({
            query: (req) => {
                const params: string = queryString.stringify({
                    keys: req.keys.join(","),
                    page: req.page,
                    limit: req.limit,
                });
                const path = `${String(KEY_VALUE.BASE)}/?${params}`;
                Logger.debug("getKeyValue: querying...", path);
                return path;
            },
            transformResponse: (
                r: TGetMultiKeyValueRawResponse
            ): TGetMultiKeyValueResponse => r,
        }),
        getEthereumLastBlock: builder.query<
            TGetEthereumLastBlockResponse,
            TGetEthereumLastBlockRequest
        >({
            query: () => {
                const path = `${String(KEY_VALUE.BASE)}/${String(
                    KEY_VALUE.STORE.ETHEREUM_LAST_BLOCK
                )}/`;
                Logger.debug("getKeyValue: querying...", path);
                return path;
            },
            transformResponse: (
                r: TGetKeyValueRawResponse
            ): TGetKeyValueResponse => r,
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetKeyValueQuery,
    useGetMultiKeyValueQuery,
    useGetEthereumLastBlockQuery,
} = keyValueApi;
