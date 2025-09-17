import querystring from "query-string";
import { TCoin } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetCoinsRequest,
    TGetCoinsResponse,
    TGetCoinsRawResponse,
    TTogglePinnedCoinRequest,
    TTogglePinnedCoinRawResponse,
    TRemoteCoin,
    TGetKasandraCoinsResponse,
    TGetKasandraCoinsRawResponse,
} from "./types";

const { COINS } = CONFIG.API.DEFAULT.ROUTES;

const transformRemoteCoin = (coin: TRemoteCoin): TCoin => {
    const price = coin.price ?? 0;
    return {
        id: coin.id,
        name: coin.name,
        ticker: coin.ticker,
        slug: coin.slug,
        icon: coin.icon,
        description: coin.description,
        pinned: coin.is_pinned,
        tags:
            coin.tags?.map((t) => ({
                ...t,
                tagType: t.tag_type,
            })) ?? [],
        rank: coin.rank,
        price,
        volume: coin.volume ?? 0,
        marketCap: coin.market_cap ?? 0,
        percentChange24h: coin.price_percent_change_24h ?? 0,
        percentChange7d: coin.price_percent_change_7d ?? 0,
        percentChange14d: coin.price_percent_change_14d ?? 0,
        percentChange30d: coin.price_percent_change_30d ?? 0,
        percentChange60d: coin.price_percent_change_60d ?? 0,
    };
};

const coinsApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getCoins: builder.query<TGetCoinsResponse, TGetCoinsRequest>({
            query: (req) => {
                const path = `${COINS.BASE}${COINS.LIST}`;
                const query = querystring.stringify(req ?? {});
                Logger.debug("getCoins: querying", path, req);
                return `${path}?${query}`;
            },
            transformResponse: ({
                results,
                ...rest
            }: TGetCoinsRawResponse): TGetCoinsResponse => ({
                results: results?.map(transformRemoteCoin),
                ...rest,
            }),
            providesTags: ["PinnedCoins"],
        }),
        getPinnedCoins: builder.query<TGetCoinsResponse, TGetCoinsRequest>({
            query: () => `${COINS.BASE}${COINS.PINNED}`,
            transformResponse: ({
                results,
                ...rest
            }: TGetCoinsRawResponse): TGetCoinsResponse => ({
                results: results?.map(transformRemoteCoin),
                ...rest,
            }),
            providesTags: ["PinnedCoins"],
        }),
        getKasandraCoins: builder.query<
            TGetKasandraCoinsResponse,
            TGetCoinsRequest
        >({
            query: () => `${COINS.BASE}${COINS.KASANDRA_SUPPORTED}`,
            transformResponse: (
                res: TGetKasandraCoinsRawResponse
            ): TGetKasandraCoinsResponse => ({
                results: res?.map(transformRemoteCoin),
            }),
        }),
        togglePinnedCoin: builder.mutation<
            TTogglePinnedCoinRawResponse,
            TTogglePinnedCoinRequest
        >({
            query: ({ coinId }) => {
                Logger.debug("togglePinCoin: querying", coinId);
                return {
                    url: `${COINS.BASE}${COINS.PIN(coinId)}`,
                    method: "POST",
                };
            },
            invalidatesTags: ["PinnedCoins"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetCoinsQuery,
    useGetPinnedCoinsQuery,
    useGetKasandraCoinsQuery,
    useTogglePinnedCoinMutation,
} = coinsApi;
