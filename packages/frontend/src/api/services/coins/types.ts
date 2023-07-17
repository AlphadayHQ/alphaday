import { TCoin } from "src/api/types";
import {
    TBaseCoin,
    TPagination,
    TRemoteBaseProject,
    TRemoteTagReadOnly,
} from "../baseTypes";

/**
 * Primitive types
 */
export type TRemoteCoin = TBaseCoin & {
    project: TRemoteBaseProject;
    tags: TRemoteTagReadOnly[];
};

/**
 * Queries
 */

// /coins/
export type TGetCoinsRequest = { tags?: string; limit?: number } | void;
export type TGetCoinsRawResponse = TPagination & {
    results: TRemoteCoin[];
};
export type TGetCoinsResponse = TPagination & {
    results: TCoin[];
};

// /coins/{coinId}/
export type TTogglePinnedCoinRequest = { coinId: number };
export type TTogglePinnedCoinRawResponse = TRemoteCoin;
export type TTogglePinnedCoinResponse = TCoin;
