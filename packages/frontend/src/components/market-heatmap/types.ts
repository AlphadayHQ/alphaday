export enum EHeatmapSizeMetric {
    MarketCap = "marketCap",
    Volume = "volume",
}

export enum EHeatmapColorMetric {
    PriceChange24h = "percentChange24h",
    PriceChange7d = "percentChange7d",
}

export const HEATMAP_MAX_ITEMS_OPTIONS = [
    { value: 50, label: "50" },
    { value: 100, label: "100" },
    { value: 200, label: "200" },
] as const;

export type THeatmapMaxItems =
    (typeof HEATMAP_MAX_ITEMS_OPTIONS)[number]["value"];
