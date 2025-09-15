export enum EHeatmapSizeMetric {
    MarketCap = "marketCap",
    Volume = "volume",
}

export enum EHeatmapColorMetric {
    PriceChange24h = "percentChange24h",
    PriceChange7d = "percentChange7d",
}

export enum EHeatmapMaxItems {
    TwentyFive = 25,
    Fifty = 50,
    OneHundred = 100,
    TwoHundred = 200,
}

export const HEATMAP_MAX_ITEMS_OPTIONS = [
    { value: EHeatmapMaxItems.TwentyFive, label: "25" },
    { value: EHeatmapMaxItems.Fifty, label: "50" },
    { value: EHeatmapMaxItems.OneHundred, label: "100" },
    { value: EHeatmapMaxItems.TwoHundred, label: "200" },
] as const;
