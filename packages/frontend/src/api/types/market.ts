import i18next from "i18next";
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
    oneDay: `1${i18next.t("datelocale.d")}`,
    oneWeek: `1${i18next.t("datelocale.w")}`,
    oneMonth: `1${i18next.t("datelocale.M")}`,
    threeMonths: `3${i18next.t("datelocale.M")}`,
    yearToDate: i18next.t("datelocale.ytd"),
    oneYear: `1${i18next.t("datelocale.y")}`,
    threeYear: `3${i18next.t("datelocale.y")}`,
    all: i18next.t("navigation.general.all"),
} as const;
type TRangeKeys = keyof typeof CHART_RANGE_OPTIONS;
export type TChartRange = (typeof CHART_RANGE_OPTIONS)[TRangeKeys];
