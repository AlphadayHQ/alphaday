import { TDeveloperActivityData } from "src/api/types";

/**
 * Primitive types
 */

export type TRemoteDeveloperActivitySnapshot = {
    id: number;
    coin: string;
    commits_last_4_weeks: number;
    contributors_count: number;
    open_issues: number;
    stars: number;
    forks: number;
    date: string;
};

/**
 * Queries
 */

export type TGetDeveloperActivityRequest = {
    // coin slug (case insensitive) — required path param
    coin: string;
    limit?: number | undefined;
};

export type TGetDeveloperActivityRawResponse =
    TRemoteDeveloperActivitySnapshot[];

export type TGetDeveloperActivityResponse = TDeveloperActivityData;
