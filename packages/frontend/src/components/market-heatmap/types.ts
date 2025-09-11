export enum EHeatmapSizeMetric {
    MarketCap = "market_cap",
    Volume = "volume",
}

export enum EHeatmapColorMetric {
    PriceChange24h = "price_percent_change_24h",
    PriceChange7d = "price_percent_change_7d",
}

export const HEATMAP_MAX_ITEMS_OPTIONS = [
    { value: 50, label: "50" },
    { value: 100, label: "100" },
    { value: 200, label: "200" },
] as const;

export type THeatmapMaxItems =
    (typeof HEATMAP_MAX_ITEMS_OPTIONS)[number]["value"];
