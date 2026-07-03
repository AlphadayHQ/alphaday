import {
    TFeesConfig,
    TFeesData,
    TFeesItem,
    TFeesMetric,
    TFeesMode,
    TFeesTimeframe,
} from "src/api/types";

/**
 * Primitive types
 */

export type TRemoteFeesConfig = TFeesConfig;

export type TRemoteFeesItem = TFeesItem;

/**
 * Queries
 */

export type TGetTvlFeesRequest = {
    metric?: TFeesMetric | undefined;
    timeframe?: TFeesTimeframe | undefined;
    mode?: TFeesMode | undefined;
};

export type TGetTvlFeesRawResponse = {
    protocols: {
        config: TRemoteFeesConfig;
        data: TRemoteFeesItem[];
    };
};

export type TGetTvlFeesResponse = TFeesData;
