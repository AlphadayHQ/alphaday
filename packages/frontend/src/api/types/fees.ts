/**
 * The `/tvl/fees/top/` endpoint ranks protocols by either the revenue they
 * keep (`revenue`) or the total fees paid by their users (`total`), over a
 * given timeframe. Data is powered by DefiLlama.
 */
export type TFeesMetric = "revenue" | "total";
export type TFeesTimeframe = "24h" | "7d" | "30d";
export type TFeesMode = "absolute" | "pct_change";

export type TFeesConfig = {
    timeframe: TFeesTimeframe;
    metric: TFeesMetric;
    mode: TFeesMode;
    attribution: string;
};

export type TFeesItem = {
    id: number;
    name: string;
    value: number;
    icon: string;
};

export type TFeesData = {
    config: TFeesConfig;
    items: TFeesItem[];
};
