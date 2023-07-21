import { TForumItem } from "src/api/types";
import { TRemoteItem, TPagination } from "../baseTypes";

/**
 * Primitive types
 */

export type TRemoteForumItem = TRemoteItem & {
    published_at: string;
};

/**
 * Query types
 */

export type TGetForumItemsRequest = {
    page?: number;
    tags?: string;
};
export type TGetForumItemsRawResponse = TPagination & {
    results: TRemoteForumItem[];
};
export type TGetForumItemsResponse = TPagination & {
    results: TForumItem[];
};
