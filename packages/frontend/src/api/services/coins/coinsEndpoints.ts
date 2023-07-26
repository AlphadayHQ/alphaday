import querystring from "querystring";
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
    useTogglePinnedCoinMutation,
} = coinsApi;
