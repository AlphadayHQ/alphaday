import { TBaseProject, TChartRange } from "src/api/types";
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
};
export type TRemotePredictions = {
    results: TRemotePredictionItem[];
};

export type TPredictionCoin = Omit<TBaseCoin, "gecko_id"> & {
    project: TBaseProject;
    geckoId: string;
    tags: TRemoteTagReadOnly[];
};
export type TPredictionItem = {
    id: number;
    coin: TPredictionCoin;
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
