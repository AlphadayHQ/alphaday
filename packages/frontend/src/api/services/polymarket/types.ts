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
    outcome_name: string;
    price: number;
    volume: number;
    liquidity: number;
};

export type TPolymarketMarket = {
    id: number;
    question: string;
    description: string;
    event: TPolymarketEvent;
    outcomes: TPolymarketOutcome[] | null;
    volume?: number;
    created_at: string;
    updated_at: string;
    end_date: string | null;
    resolved: boolean;
    winning_outcome: TPolymarketOutcome | null;
    url: string;
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
    active?: boolean;
    tags?: string;
    search?: string;
    ordering?: string;
};

export type TGetPolymarketMarketsResponse = TPagination & {
    results: TPolymarketMarket[];
};

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

export type TGetPolymarketMarketByTopVolumeRequest = {
    page?: number;
    limit?: number;
    active?: boolean;
    tags?: string;
    search?: string;
    ordering?: string;
};

export type TGetPolymarketMarketByTopVolumeResponse = TPagination & {
    results: TPolymarketMarket[];
};
