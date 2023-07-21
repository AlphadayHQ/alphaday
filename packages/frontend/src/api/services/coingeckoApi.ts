import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import queryString from "query-string";
import CONFIG from "../../config/config";

const { API_BASE_URL, ROUTES } = CONFIG.API_PROVIDERS.COINGECKO;

export type TGetAssetsPriceRequest = {
    ids: string; // id of coins, comma-separated if querying more than 1 coin
    vs_currencies: string; // vs_currency of coins, comma-separated if querying more than 1 vs_currency
};

export type TGetAssetsPriceResponse = {
    [key: string]: {
        usd: number;
        eur: number;
    };
};

export const coingeckoApi = createApi({
    reducerPath: "coingeckoApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
    }),
    endpoints: (builder) => ({
        getAssetsPrice: builder.query<
            TGetAssetsPriceResponse,
            TGetAssetsPriceRequest
        >({
            query: (req) => {
                if (ROUTES?.PRICE == null) {
                    throw new Error(
                        "coingeckoApi::getAssetsPrice: invalid route"
                    );
                }
                const params: string = queryString.stringify(req);
                return `${API_BASE_URL}${ROUTES?.PRICE}?${params}`;
            },
        }),
    }),
});

export const { useGetAssetsPriceQuery } = coingeckoApi;
