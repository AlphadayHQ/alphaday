import {
    TCoinMarketState,
    TCoinMarketHistory,
    TChartRange,
} from "src/api/types";
import { TBaseCoin, TPagination } from "../baseTypes";

/**
 * Primitive types
 */

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

export type TRemoteCoinOhlc = [number, number, number, number, number][];

export type TRemoteCoinMarketHistory = {
    id: number;
    coin: TRemoteMarketCoin;
    interval: string;
    currency: string;
    history: TRemoteMarketHistory;
    ohlc: TRemoteCoinOhlc;
    requested_at: string;
};

/**
 * Queries
 */

// /market/
export type TGetMarketDataRequest = {
    tags?: string;
    page?: number;
    limit?: number;
};
export type TGetMarketDataRawResponse = TPagination & {
    results: TRemoteCoinData[];
};
export type TGetMarketDataResponse = TPagination & {
    results: TCoinMarketState[];
};

// /market/history/{coin}/{interval}
export type TGetMarketHistoryRequest = {
    coin: string;
    interval: TChartRange;
};
export type TGetMarketHistoryRawResponse = TRemoteCoinMarketHistory;
export type TGetMarketHistoryResponse = TCoinMarketHistory;
