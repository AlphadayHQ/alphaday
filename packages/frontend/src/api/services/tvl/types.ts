import { TProjectData } from "src/api/types";
import {
    TTvlDatum,
    TRemoteBaseProject,
    TRemoteProjectType,
    TPagination,
} from "../baseTypes";

/**
 * Primitive types
 */

export type TRemoteProjectTvlHistoryRead = {
    id: number;
    project: TRemoteBaseProject;
    interval: string;
    currency: string;
    history: TRemoteTvlHistory;
    requested_at: string;
};

export type TRemoteProjectDataRead = TTvlDatum & {
    id: number;
    project: TRemoteBaseProject;
    tvl_histories: TRemoteProjectTvlHistoryRead[];
};

export type TRemoteTvlHistoryDatum = {
    date: number;
    totalLiquidityUSD: number;
};

export type TRemoteTvlHistory =
    | TRemoteTvlHistoryDatum[]
    | Record<string, never>;

/**
 * Queries
 */

export type TGetTvlRequest = {
    tags: string | undefined;
    project_type?: TRemoteProjectType | undefined;
    page?: number | undefined;
    limit?: number | undefined;
};
export type TGetTvlRawResponse = TPagination & {
    results: TRemoteProjectDataRead[];
};
export type TGetTvlResponse = TPagination & {
    results: TProjectData[];
};
