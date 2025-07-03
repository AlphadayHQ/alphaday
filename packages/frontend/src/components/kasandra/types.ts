export type TMarketMeta = {
    id: number;
    name: string;
    slug: string;
    ticker: string;
    icon?: string | undefined;
};

export enum EChartType {
    Line = "line",
    Candlestick = "candlestick",
}
