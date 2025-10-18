import queryString from "query-string";
import CONFIG from "src/config/config";
import { alphadayApi } from "../alphadayApi";
import type {
    TGetPolymarketEventsRequest,
    TGetPolymarketEventsResponse,
    TGetPolymarketMarketsRequest,
    TGetPolymarketMarketsResponse,
    TGetPolymarketMarketHistoryRequest,
    TGetPolymarketMarketHistoryResponse,
    TPolymarketEvent,
    TPolymarketMarket,
    TRawGetPolymarketMarketByTopVolumeResponse,
    TGetPolymarketMarketByTopVolumeRequest,
    TGetPolymarketMarketByTopVolumeResponse,
    TRawPolymarketMarketEvent,
    TRawGetPolymarketMarketEventsResponse,
} from "./types";

const { POLYMARKET } = CONFIG.API.DEFAULT.ROUTES;

const mapRawGetPolymarketEvent = (
    response: TRawPolymarketMarketEvent
): TPolymarketEvent => {
    return {
        id: response.id,
        title: response.title,
        description: response.description,
        slug: response.slug,
        url: response.url,
        image: response.image,
        icon: response.icon,
        category: response.category,
        active: response.active,
        eventId: response.event_id,
        createdAt: response.created_at,
        updatedAt: response.updated_at,
        marketsCount: response.markets_count,
        volume: response.volume,
        markets: response.markets.map((market) => ({
            id: market.id,
            marketId: market.market_id,
            question: market.question,
            active: market.active,
            closed: market.closed,
            archived: market.archived,
            volume: market.volume_num,
            liquidity: market.liquidity_num,
            image: market.image,
            category: market.category,
            endDate: market.end_date,
            outcomes: market.outcomes.map((outcome) => ({
                id: outcome.id,
                outcomeName: outcome.outcome_name,
                outcomeId: outcome.outcome_id,
                price: outcome.price,
                volume: outcome.volume,
                liquidity: outcome.liquidity,
            })),
        })),
    };
};

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
            transformResponse: (
                response: TRawGetPolymarketMarketEventsResponse
            ) => {
                const events = response.results.map((event) =>
                    mapRawGetPolymarketEvent(event)
                );
                return {
                    ...response,
                    results: events,
                };
            },
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
            query: ({ page, limit, active, tags, search, ordering }) => {
                const params = queryString.stringify({
                    page,
                    limit:
                        limit ||
                        CONFIG.API.DEFAULT.DEFAULT_PARAMS.RESPONSE_LIMIT,
                    active,
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
        getPolymarketMarketByTopVolume: builder.query<
            TGetPolymarketMarketByTopVolumeResponse,
            TGetPolymarketMarketByTopVolumeRequest
        >({
            query: ({ page, tags, limit, active, search, ordering }) => {
                const params = queryString.stringify({
                    page,
                    limit,
                    active,
                    tags,
                    search,
                    ordering,
                });
                return `${POLYMARKET.BASE}${POLYMARKET.TOP_VOLUME}?${params}`;
            },
            transformResponse: (
                response: TRawGetPolymarketMarketByTopVolumeResponse
            ) => {
                return mapRawGetPolymarketEvent(response);
            },
        }),
    }),
});

export const {
    useGetPolymarketEventsQuery,
    useGetPolymarketEventByIdQuery,
    useGetPolymarketMarketsQuery,
    useGetPolymarketMarketByIdQuery,
    useGetPolymarketMarketHistoryQuery,
    useGetPolymarketMarketByTopVolumeQuery,
} = polymarketApi;

export default polymarketApi;
