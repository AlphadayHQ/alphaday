import {
    TBaseProject,
    TChartRange,
    TPredictionCoin,
    TPredictions,
    EPredictionCase,
} from "src/api/types";
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

export type TRemotePredictionData = {
    id: number;
    coin: TPredictionCoin;
    case: EPredictionCase;
    interval: TChartRange;
    data: {
        price: number;
        price_percent_change: number;
        timestamp: number;
    }[];
    created: string;
};
export type TRemotePredictions = {
    [key in EPredictionCase]: TRemotePredictionData;
};

/**
 * Queries
 */
export type TGetPredictionsRequest = {
    coin: string;
    interval: TChartRange;
    limit?: number; // how many datapoints to return
};
export type TGetPredictionsRawResponse = TRemotePredictions;
export type TGetPredictionsResponse = TPredictions;
