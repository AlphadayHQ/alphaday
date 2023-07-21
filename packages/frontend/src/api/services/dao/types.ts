import { TDaoItem } from "src/api/types";
import { TRemoteItem, TPagination } from "../baseTypes";

/**
 * Primitive types
 */

export type TRemoteDaoItem = TRemoteItem & {
    starts_at: string;
    ends_at: string;
};

/**
 * Query types
 */

export type TGetDaoItemsRequest = {
    page?: number;
    tags?: string;
};
export type TGetDaoItemsRawResponse = TPagination & {
    results: TRemoteDaoItem[];
};
export type TGetDaoItemsResponse = TPagination & {
    results: TDaoItem[];
};
