import queryString from "query-string";
import CONFIG from "src/config/config";
import { alphadayApi } from "../alphadayApi";
import type {
    TGetPolymarketEventsRequest,
    TGetPolymarketEventsResponse,
    TGetPolymarketMarketsRequest,
    TGetPolymarketMarketsResponse,
    TGetPolymarketMarketStatsRequest,
    TGetPolymarketMarketStatsResponse,
    TGetPolymarketMarketHistoryRequest,
    TGetPolymarketMarketHistoryResponse,
    TPolymarketEvent,
    TPolymarketMarket,
} from "./types";

const { POLYMARKET } = CONFIG.API.DEFAULT.ROUTES;

const polymarketApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getPolymarketEvents: builder.query<
            TGetPolymarketEventsResponse,
            TGetPolymarketEventsRequest
        >({
            query: ({ page, limit, category, tags, search }) => {
                const params = queryString.stringify({
                    page,
                    limit:
                        limit ||
                        CONFIG.API.DEFAULT.DEFAULT_PARAMS.RESPONSE_LIMIT,
                    category,
                    tags,
                    search,
                });
                return `${POLYMARKET.BASE}${POLYMARKET.EVENTS}?${params}`;
            },
            providesTags: ["PolymarketEvents"],
        }),

        getPolymarketEventById: builder.query<TPolymarketEvent, { id: number }>(
            {
                query: ({ id }) =>
                    `${POLYMARKET.BASE}${POLYMARKET.EVENT_BY_ID(id)}`,
                providesTags: (_result, _error, { id }) => [
                    { type: "PolymarketEvents", id },
                ],
            }
        ),

        getPolymarketMarkets: builder.query<
            TGetPolymarketMarketsResponse,
            TGetPolymarketMarketsRequest
        >({
            query: ({
                page,
                limit,
                event,
                resolved,
                tags,
                search,
                ordering,
            }) => {
                const params = queryString.stringify({
                    page,
                    limit:
                        limit ||
                        CONFIG.API.DEFAULT.DEFAULT_PARAMS.RESPONSE_LIMIT,
                    event,
                    resolved,
                    tags,
                    search,
                    ordering,
                });
                return `${POLYMARKET.BASE}${POLYMARKET.MARKETS}?${params}`;
            },
            providesTags: ["PolymarketMarkets"],
        }),

        getPolymarketMarketById: builder.query<
            TPolymarketMarket,
            { id: number }
        >({
            query: ({ id }) =>
                `${POLYMARKET.BASE}${POLYMARKET.MARKET_BY_ID(id)}`,
            providesTags: (_result, _error, { id }) => [
                { type: "PolymarketMarkets", id },
            ],
        }),

        getPolymarketMarketStats: builder.query<
            TGetPolymarketMarketStatsResponse,
            TGetPolymarketMarketStatsRequest
        >({
            query: ({ days, market_id }) => {
                const params = queryString.stringify({
                    days,
                    market_id,
                });
                return `${POLYMARKET.BASE}${POLYMARKET.MARKET_STATS}?${params}`;
            },
            providesTags: ["PolymarketStats"],
        }),

        getPolymarketMarketHistory: builder.query<
            TGetPolymarketMarketHistoryResponse,
            TGetPolymarketMarketHistoryRequest
        >({
            query: ({ market_id, interval, days }) => {
                const params = queryString.stringify({
                    interval,
                    days,
                });
                return `${POLYMARKET.BASE}${POLYMARKET.MARKET_HISTORY(market_id)}?${params}`;
            },
            providesTags: (_result, _error, { market_id }) => [
                { type: "PolymarketHistory", id: market_id },
            ],
        }),
    }),
});

export const {
    useGetPolymarketEventsQuery,
    useGetPolymarketEventByIdQuery,
    useGetPolymarketMarketsQuery,
    useGetPolymarketMarketByIdQuery,
    useGetPolymarketMarketStatsQuery,
    useGetPolymarketMarketHistoryQuery,
} = polymarketApi;

export default polymarketApi;
