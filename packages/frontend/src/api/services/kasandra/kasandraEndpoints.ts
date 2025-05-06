import { TMarketHistory } from "src/api/types";
import { isEmptyObj } from "src/api/utils/helpers";
import { Logger } from "src/api/utils/logging";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TRemoteMarketCoin,
    TRemoteMarketHistory,
    TGetPredictionsRequest,
    TGetPredictionsRawResponse,
    TGetPredictionsResponse,
} from "./types";

const { KASANDRA } = CONFIG.API.DEFAULT.ROUTES;

const mapRemoteMarketCoin = (coin: TRemoteMarketCoin) => {
    const price = coin.price ?? 0;
    return {
        id: coin.id,
        name: coin.name,
        ticker: coin.ticker,
        slug: coin.slug,
        icon: coin.icon,
        description: coin.description,
        pinned: coin.is_pinned,
        price,
        volume: coin.volume,
        marketCap: coin.market_cap,
        percentChange24h: coin.price_percent_change_24h,
    };
};

const mapHistory = (
    history: TRemoteMarketHistory
): TMarketHistory | undefined => {
    try {
        if (isEmptyObj(history)) return undefined;
        const prices = isEmptyObj(history.prices) ? undefined : history.prices;
        const marketCaps = isEmptyObj(history.market_caps)
            ? undefined
            : history.market_caps;
        return {
            prices,
            marketCaps,
        };
    } catch (e) {
        Logger.error(
            "tvlEndpoint::getTvlHistory:could not parse history data",
            history
        );
        throw e;
    }
};

const kasandraApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        // getPredictionsData: builder.query<
        //     TGetMarketDataResponse,
        //     TGetMarketDataRequest
        // >({
        //     query: (req) => {
        //         const params: string = queryString.stringify(req);
        //         const path = `${String(KASANDRA.BASE)}${String(
        //             KASANDRA.DEFAULT
        //         )}?${params}`;
        //         Logger.debug("getPredictionsData: querying", path);
        //         return `${KASANDRA.BASE}?${params}`;
        //     },
        //     transformResponse: (
        //         r: TGetMarketDataRawResponse
        //     ): TGetMarketDataResponse => {
        //         const facadeData = r.results.map((coinMarket) => ({
        //             id: coinMarket.id,
        //             coin: mapRemoteMarketCoin(coinMarket.coin),
        //             currency: coinMarket.currency,
        //             price: coinMarket.price,
        //             percentChange24h: coinMarket.price_percent_change_24h,
        //             percentChange7d: coinMarket.price_percent_change_7d,
        //             volume: coinMarket.volume,
        //             volumeChange24h: coinMarket.volume_change_24h,
        //             marketCap: coinMarket.market_cap,
        //             date: coinMarket.date,
        //         }));
        //         return {
        //             ...r,
        //             results: facadeData.sort(
        //                 (a, d) => d.marketCap - a.marketCap
        //             ),
        //         };
        //     },
        // }),
        getPredictions: builder.query<
            TGetPredictionsResponse,
            TGetPredictionsRequest
        >({
            query: (req) => {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                const route = `${KASANDRA.BASE}${KASANDRA.DEFAULT}${
                    req.coin
                }/${String(req.interval)}`;
                Logger.debug("querying", route);
                return route;
            },
            transformResponse: (
                r: TGetPredictionsRawResponse
            ): TGetPredictionsResponse => {
                return {
                    id: r.id,
                    coin: mapRemoteMarketCoin(r.coin),
                    interval: r.interval,
                    currency: r.currency,
                    history: mapHistory(r.history),
                    requestedAt: r.requested_at,
                };
            },
        }),
    }),
    overrideExisting: false,
});

export const { useGetPredictionsQuery } = kasandraApi;
