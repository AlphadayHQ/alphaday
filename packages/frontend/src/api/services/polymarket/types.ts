import type { TPagination, TRemoteTagReadOnly } from "../baseTypes";

/**
 * Polymarket types
 */

export type TPolymarketEvent = {
    id: number;
    title: string;
    description: string;
    category: string;
    created_at: string;
    updated_at: string;
    start_date: string | null;
    end_date: string | null;
    image: string | null;
    slug: string;
    tags: TRemoteTagReadOnly[];
};

export type TPolymarketOutcome = {
    id: number;
    name: string;
    price: number;
    volume_24h: number;
    liquidity: number;
    outcome_token: string;
    probability: number;
};

export type TPolymarketMarket = {
    id: number;
    question: string;
    description: string;
    event: TPolymarketEvent;
    outcomes: TPolymarketOutcome[] | null;
    total_volume?: number;
    total_liquidity: number;
    created_at: string;
    updated_at: string;
    end_date: string | null;
    resolved: boolean;
    winning_outcome: TPolymarketOutcome | null;
    market_slug: string;
    image: string | null;
    tags: TRemoteTagReadOnly[];
};

export type TPolymarketMarketCard = {
    id: number;
    question: string;
    event_title: string;
    category: string;
    total_volume?: number;
    end_date: string | null;
    resolved: boolean;
    image: string | null;
    market_slug: string;
    top_outcome: TPolymarketOutcome | null;
};

/**
 * API Request/Response types
 */

export type TGetPolymarketEventsRequest = {
    page?: number;
    limit?: number;
    category?: string;
    tags?: string;
    search?: string;
};

export type TGetPolymarketEventsResponse = TPagination & {
    results: TPolymarketEvent[];
};

export type TGetPolymarketMarketsRequest = {
    page?: number;
    limit?: number;
    event?: number;
    resolved?: boolean;
    tags?: string;
    search?: string;
    ordering?: string;
};

export type TGetPolymarketMarketsResponse = TPagination & {
    results: TPolymarketMarket[];
};

export type TGetPolymarketMarketStatsRequest = {
    days?: number;
    market_id?: number;
};

export type TPolymarketMarketStats = {
    total_volume: number;
    total_markets: number;
    active_markets: number;
    resolved_markets: number;
    volume_24h: number;
    volume_change_24h: number;
};

export type TGetPolymarketMarketStatsResponse = TPolymarketMarketStats;

export type TGetPolymarketMarketHistoryRequest = {
    market_id: number;
    interval?: string;
    days?: number;
};

export type TPolymarketPricePoint = {
    timestamp: string;
    price: number;
    volume: number;
};

export type TGetPolymarketMarketHistoryResponse = {
    market_id: number;
    outcome_data: {
        [outcome_id: string]: TPolymarketPricePoint[];
    };
};
