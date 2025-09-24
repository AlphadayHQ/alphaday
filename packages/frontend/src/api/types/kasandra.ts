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
    type: "prediction";
    // sources: TInsightSource[];
};

export type THistoryInsightItem = Omit<TInsightItem, "case" | "type"> & {
    type: "history";
};

export type TPredictions = {
    [key in EPredictionCase]: TPredictionData[];
};

export type TInsights = {
    predictions: TInsightItem[];
    history: THistoryInsightItem[];
};
