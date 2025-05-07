import { TBaseProject, TChartRange, TPredictionItem } from "src/api/types";
import {
    TBaseCoin,
    TRemoteProjectType,
    TRemoteTagReadOnly,
} from "../baseTypes";

/**
 * Primitive types
 */

export type TRemotePredictionCoin = Omit<TBaseCoin, "gecko_id"> & {
    project: Omit<TBaseProject, "projectType" | "networkId"> & {
        project_type: TRemoteProjectType;
        network_id: number;
    };
    gecko_id: string;
    tags: TRemoteTagReadOnly[];
};
export type TRemotePredictionItem = {
    id: number;
    coin: TRemotePredictionCoin;
    price: number;
    insight: string;
    verbose_references: string;
    case: string;
    target_date: string;
    created: string;
};
export type TRemotePredictions = {
    results: TRemotePredictionItem[];
};

/**
 * Queries
 */
export type TGetPredictionsRequest = {
    coin: number;
    interval: TChartRange;
    limit?: number; // how many datapoints to return
};
export type TGetPredictionsRawResponse = TRemotePredictions;
export type TGetPredictionsResponse = TPredictionItem[];
