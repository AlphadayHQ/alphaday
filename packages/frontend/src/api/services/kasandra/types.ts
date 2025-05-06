import { TChartRange, TCoin, TMarketHistory } from "src/api/types";
import { TBaseCoin } from "../baseTypes";

/**
 * Primitive types
 */

export type TCoinMarketHistory = {
    id: number;
    coin: TCoin;
    interval: string;
    currency: string;
    history: TMarketHistory | undefined;
    requestedAt: string;
};

export type TRemoteMarketCoin = TBaseCoin & {
    project?: number;
    tags: number[];
};

export type TRemoteCoinData = {
    id: number;
    coin: TRemoteMarketCoin;
    currency: string;
    price: number;
    price_percent_change_24h: number;
    price_percent_change_7d: number;
    volume: number;
    volume_change_24h: number;
    market_cap: number;
    date: string;
};

export type TRemoteMarketHistory =
    | {
          prices: [number, number][];
          market_caps: [number, number][];
      }
    | Record<string, never>;

export type TRemoteCoinMarketHistory = {
    id: number;
    coin: TRemoteMarketCoin;
    interval: string;
    currency: string;
    history: TRemoteMarketHistory;
    requested_at: string;
};

/**
 * Queries
 */

// /predictions/{coin}/{interval}
export type TGetPredictionsRequest = {
    coin: string;
    interval: TChartRange;
};
export type TGetPredictionsRawResponse = TRemoteCoinMarketHistory;
export type TGetPredictionsResponse = TCoinMarketHistory;
