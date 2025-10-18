import type { TPagination, TRemoteTagReadOnly } from "../baseTypes";

/**
 * Polymarket types
 */

export type TPolymarketEvent = {
    id: number;
    eventId: string;
    title: string;
    description: string;
    slug: string;
    url: string;
    image: string;
    icon: string;
    category: string | null;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    marketsCount: number;
    volume: number;
    markets: {
        id: number;
        marketId: string;
        question: string;
        active: boolean;
        closed: boolean;
        archived: boolean;
        volume: number;
        liquidity: number;
        image: string;
        category: string | null;
        endDate: string | null;
        outcomes: {
            id: number;
            outcomeName: string;
            outcomeId: string;
            price: number;
            volume: number;
            liquidity: number;
        }[];
    }[];
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

export type TPolymarketMarketGroup = {
    id: number;
    eventId: string;
    title: string;
    description: string;
    slug: string;
    url: string;
    image: string;
    icon: string;
    category: string | null;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    marketsCount: number;
    volume: number;
    markets: {
        id: number;
        marketId: string;
        question: string;
        active: boolean;
        closed: boolean;
        archived: boolean;
        volume: number;
        liquidity: number;
        image: string;
        category: string | null;
        endDate: string | null;
        outcomes: {
            id: number;
            outcomeName: string;
            outcomeId: string;
            price: number;
            volume: number;
            liquidity: number;
        }[];
    }[];
};

/**
 * API Request/Response types
 */

export type TGetPolymarketEventsRequest = {
    page?: number;
    limit?: number;
    active?: boolean;
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
    results: TPolymarketEvent[];
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

export type TGetPolymarketMarketByTopVolumeResponse = TPolymarketEvent;

export type TRawPolymarketMarketEvent = {
    id: number;
    event_id: string;
    title: string;
    description: string;
    slug: string;
    url: string;
    image: string;
    icon: string;
    category: string | null;
    active: boolean;
    created_at: string;
    updated_at: string;
    markets_count: number;
    volume: number;
    markets: {
        id: number;
        market_id: string;
        question: string;
        active: boolean;
        closed: boolean;
        archived: boolean;
        volume_num: number;
        liquidity_num: number;
        image: string;
        category: string | null;
        end_date: string | null;
        outcomes: {
            id: number;
            outcome_name: string;
            outcome_id: string;
            price: number;
            volume: number;
            liquidity: number;
            created_at: string;
            updated_at: string;
        }[];
    }[];
};

export type TRawGetPolymarketMarketByTopVolumeResponse =
    TRawPolymarketMarketEvent;

export type TRawGetPolymarketMarketEventsResponse = TPagination & {
    results: TRawPolymarketMarketEvent[];
};
