import { TYieldPool } from "src/api/types";
import { TPagination } from "../baseTypes";

/**
 * Primitive types
 */

export type TRemoteYieldPool = {
    id: number;
    pool_id: string;
    project: string;
    chain: string;
    symbol: string;
    apy: number;
    apy_base: number | null;
    apy_reward: number | null;
    tvl_usd: number;
    il_risk: string;
    date: string;
};

/**
 * Queries
 */

export type TGetYieldsRequest = {
    page?: number | undefined;
    limit?: number | undefined;
};
export type TGetYieldsRawResponse = TPagination & {
    results: TRemoteYieldPool[];
};
export type TGetYieldsResponse = TPagination & {
    results: TYieldPool[];
};
