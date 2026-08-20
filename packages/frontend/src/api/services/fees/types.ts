import { TFeesData, TFeesMetric, TFeesTimeframe } from "src/api/types";

/**
 * Primitive types
 */

export type TRemoteFeesProject = {
    name: string;
    slug: string;
    project_type: string;
    network_id: number | null;
    icon: string;
    url: string;
};

export type TRemoteFeesItem = {
    id: number;
    project: TRemoteFeesProject;
    currency: string;
    total_24h: number;
    total_7d: number;
    total_30d: number;
    revenue_24h: number;
    revenue_7d: number;
    revenue_30d: number;
    date: string;
};

/**
 * Queries
 */

export type TGetTvlFeesRequest = {
    metric?: TFeesMetric | undefined;
    timeframe?: TFeesTimeframe | undefined;
};

export type TGetTvlFeesRawResponse = {
    links: {
        next: string | null;
        previous: string | null;
    };
    total: number;
    results: TRemoteFeesItem[];
};

export type TGetTvlFeesResponse = TFeesData;
