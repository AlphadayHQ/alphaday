import { TCoin } from "./primitives";

export type TAssetPrice = {
    usdPrice: number;
    usd24hChange: number;
};

export type TMarketPricesDict = Record<string, TAssetPrice>;

export type TCoinMarketState = {
    id: number;
    coin: TCoin;
    currency: string;
    price: number;
    percentChange24h: number;
    percentChange7d: number;
    volume: number;
    volumeChange24h: number;
    marketCap: number;
    date: string;
};

export type TCoinOhlc = [number, number, number, number, number][];

export type TMarketHistory = {
    prices: [number, number][] | undefined;
    marketCaps: [number, number][] | undefined;
};

export type TCoinMarketHistory = {
    id: number;
    coin: TCoin;
    interval: string;
    currency: string;
    history: TMarketHistory | undefined;
    ohlc: TCoinOhlc | undefined;
    requestedAt: string;
};

export const CHART_RANGE_OPTIONS = {
    oneDay: { value: "1D", translationKey: `datelocale.d`, prefix: "1" },
    oneWeek: { value: "1W", translationKey: `datelocale.w`, prefix: "1" },
    oneMonth: { value: "1M", translationKey: `datelocale.M`, prefix: "1" },
    threeMonths: { value: "3M", translationKey: `datelocale.M`, prefix: "3" },
    yearToDate: { value: "YTD", translationKey: "datelocale.ytd", prefix: "" },
    oneYear: { value: "1Y", translationKey: `datelocale.y`, prefix: "1" },
    threeYear: { value: "3Y", translationKey: `datelocale.y`, prefix: "3" },
    all: { value: "ALL", translationKey: "navigation.general.all", prefix: "" },
} as const;
type TRangeKeys = keyof typeof CHART_RANGE_OPTIONS;
export type TChartRange = (typeof CHART_RANGE_OPTIONS)[TRangeKeys]["value"];
