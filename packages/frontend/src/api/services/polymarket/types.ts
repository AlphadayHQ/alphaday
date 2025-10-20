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

// sample market in market group data
export const sampleMarketData = {
    id: 611,
    market_id: "574073",
    question: "Will Bitcoin reach $170,000 by December 31, 2025?",
    active: true,
    closed: false,
    archived: false,
    volume_num: 790855.69,
    liquidity_num: 49062.87,
    image: "https://polymarket-upload.s3.us-east-2.amazonaws.com/BTC+fullsize.png",
    category: null,
    tags: [
        {
            id: 136,
            name: "bitcoin",
            slug: "bitcoin",
            keywords: [
                {
                    id: 212,
                    name: "BTC",
                    is_excluded: false,
                    ignore_trending: false,
                },
                {
                    id: 7241,
                    name: "Bitcoins",
                    is_excluded: false,
                    ignore_trending: false,
                },
                {
                    id: 211,
                    name: "Bitcoin",
                    is_excluded: false,
                    ignore_trending: false,
                },
            ],
            parents: [
                {
                    name: "chain",
                    slug: "chain",
                    keywords: [
                        {
                            id: 81379,
                            name: "Chain",
                            is_excluded: false,
                            ignore_trending: true,
                        },
                    ],
                },
                {
                    name: "coin",
                    slug: "coin",
                    keywords: [],
                },
                {
                    name: "layer1 (l1)",
                    slug: "layer-1",
                    keywords: [
                        {
                            id: 15830,
                            name: "Layer1",
                            is_excluded: false,
                            ignore_trending: true,
                        },
                        {
                            id: 15831,
                            name: "Layer 1",
                            is_excluded: false,
                            ignore_trending: true,
                        },
                        {
                            id: 15832,
                            name: "L1",
                            is_excluded: false,
                            ignore_trending: true,
                        },
                        {
                            id: 19257,
                            name: "Layer 1s",
                            is_excluded: false,
                            ignore_trending: true,
                        },
                    ],
                },
                {
                    name: "pow",
                    slug: "proof-of-work",
                    keywords: [
                        {
                            id: 6714,
                            name: "Proof of Work",
                            is_excluded: false,
                            ignore_trending: true,
                        },
                        {
                            id: 12590,
                            name: "Proof-of-Work",
                            is_excluded: false,
                            ignore_trending: true,
                        },
                        {
                            id: 6715,
                            name: "PoW",
                            is_excluded: false,
                            ignore_trending: true,
                        },
                    ],
                },
            ],
        },
        {
            id: 185485,
            name: "reach",
            slug: "reach",
            keywords: [
                {
                    id: 70499,
                    name: "Reach",
                    is_excluded: false,
                    ignore_trending: true,
                },
                {
                    id: 70500,
                    name: "$REACH",
                    is_excluded: false,
                    ignore_trending: true,
                },
            ],
            parents: [],
        },
    ],
    end_date: null,
    outcomes: [
        {
            id: 5571,
            outcome_name: "Yes",
            outcome_id:
                "54897787457036657865994456184914764553135864680096835028443076525607070890895",
            price: 0.085,
            volume: 67222.73,
            liquidity: 4170.34,
            created_at: "2025-10-15T16:01:21.753474Z",
            updated_at: "2025-10-15T16:01:21.816557Z",
        },
        {
            id: 5572,
            outcome_name: "No",
            outcome_id:
                "78805316555677329424627438782382022900925020552651782446877236048212682328103",
            price: 0.915,
            volume: 723632.95,
            liquidity: 44892.52,
            created_at: "2025-10-15T16:01:21.753487Z",
            updated_at: "2025-10-15T16:01:21.816583Z",
        },
    ],
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

export type TRawGetPolymarketMarketByTopVolumeResponse = {
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

export type TGetPolymarketMarketByTopVolumeResponse = TPolymarketMarketGroup;
