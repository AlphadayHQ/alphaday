import { TBaseItem } from "./primitives";

export enum EPredictionCase {
    OPTIMISTIC = "optimistic",
    BASELINE = "baseline",
    PESSIMISTIC = "pessimistic",
}

export type TKasandraItem = Omit<TBaseItem, "tags"> & {
    author: string;
    publishedAt: string;
    dataPoint: [number, number];
    expectedPercentChange: number;
    description: string;
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

export type TPredictions = {
    [key in EPredictionCase]: TPredictionData[];
};
