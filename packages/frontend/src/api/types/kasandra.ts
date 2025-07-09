export enum EPredictionCase {
    OPTIMISTIC = "optimistic",
    BASELINE = "baseline",
    PESSIMISTIC = "pessimistic",
}

export type TKasandraCase = {
    id: EPredictionCase | "all";
    name: string;
};

export type TInsightSource = {
    url: string;
    title: string;
    name: string;
    icon: string;
    slug: string;
};

export type TPredictionCoin = {
    id: number;
    name: string;
    ticker: string;
    slug: string;
    icon: string;
};

export type TPredictionItem = {
    id: number;
    coin: TPredictionCoin;
    price: number;
    pricePercentChange: number;
    insight?: {
        title: string;
        rationale: string;
        sources: TInsightSource[];
    };
    case: string;
    targetDate: string;
    created: string;
};

export type TPredictionData = {
    price: number;
    timestamp: number;
    volatility: number;
};

export type TInsightItem = {
    id: number;
    coin: TPredictionCoin;
    timestamp: number;
    case: EPredictionCase;
    title: string;
    rationale: string;
    price: number;
    sources: TInsightSource[];
};

export type TPredictions = {
    [key in EPredictionCase]: TPredictionData[];
};

export type TInsights = TInsightItem[];

// example
// {
//     "id": 8039,
//     "coin": {
//         "id": 31,
//         "name": "Ethereum",
//         "ticker": "ETH",
//         "slug": "ethereum",
//         "icon": "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png"
//     },
//     "timestamp": 1750809003549,
//     "title": "ETH Approaches $2,700 on Technical Breakout",
//     "rationale": "Ethereum is projected to reach $2,700 as it breaks above key resistance levels. A golden cross pattern and rising DeFi activity support the bullish trend. Institutional accumulation and strong on-chain metrics further reinforce upward momentum. Volatility is expected to rise as traders react to new highs, but the overall outlook remains positive.",
//     "pricePercentChange": 290.51,
//     "sources": [
//         {
//             "url": "https://www.tradingview.com/news/coinpedia:c38b84959094b:0-ethereum-eth-price-prediction-2025-2026-2030-will-ethereum-price-hit-3k/",
//             "name": "TradingView Ethereum Price Prediction"
//         }
//     ]
// }
