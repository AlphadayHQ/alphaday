import { TProjectData, TProjectTvlHistory } from "src/api/types";
import { TTvlDatum, TPagination } from "../baseTypes";

/**
 * Primitive types
 */
type TRemoteTvlProject = {
    name: string;
    slug: string;
    network_id: number;
    icon?: string;
    url?: string;
};

export type TRemoteProjectTvlHistoryRead = {
    id: number;
    project: TRemoteTvlProject;
    interval: string;
    currency: string;
    history: TRemoteTvlHistory;
    requested_at: string;
};

export type TRemoteProjectDataRead = TTvlDatum & {
    id: number;
    project: TRemoteTvlProject;
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
    page?: number | undefined;
    limit?: number | undefined;
};
export type TGetTvlRawResponse = TPagination & {
    results: TRemoteProjectDataRead[];
};
export type TGetTvlResponse = TPagination & {
    results: TProjectData[];
};

/**
 * deprecated endpoint
 */
export type TGetTvlHistoryRequest = {
    projects: string | undefined; // comma separated list of project slugs
    page?: number | undefined;
    limit?: number | undefined;
};
export type TGetTvlHistoryRawResponse = TPagination & {
    results: TRemoteProjectTvlHistoryRead[];
};
export type TGetTvlHistoryResponse = TPagination & {
    results: TProjectTvlHistory[];
};
