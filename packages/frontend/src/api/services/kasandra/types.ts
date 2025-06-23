import {
    TBaseProject,
    TChartRange,
    TPredictions,
    TInsights,
    EPredictionCase,
} from "src/api/types";
import {
    TBaseCoin,
    TPagination,
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
    price: number;
    timestamp: number;
    volatility: number;
};
export type TRemotePredictions = {
    [key in EPredictionCase]: TRemotePredictionData[];
};

export type TRemoteInsightSource = {
    url: string;
    title: string;
    name: string;
    icon: string;
    slug: string;
};

export type TRemoteInsight = {
    id: number;
    coin: TBaseCoin;
    timestamp: number;
    case: EPredictionCase;
    title: string;
    rationale: string;
    price_percent_change: number;
    sources: TRemoteInsightSource[];
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

export type TGetInsightsRequest = {
    coin: string;
    interval: TChartRange;
    limit?: number;
};
export type TGetInsightsRawResponse = TPagination & {
    results: TRemoteInsight[];
};
export type TGetInsightsResponse = TInsights;
