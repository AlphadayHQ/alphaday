import { TTag } from "src/api/types";
import { TPagination, TRemoteTag } from "../baseTypes";

/**
 * Primitive types
 */

/**
 * Query types
 */

export type TGetTagsRequest = {
    item_type?: string | undefined;
    keywords?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
};
export type TGetTagsRawResponse = TPagination & {
    results: TRemoteTag[];
};
export type TGetTagsResponse = TPagination & {
    results: TTag[];
};

export type TGetTagByIdRequest = {
    id: number;
};
export type TGetTagByIdResponse = TRemoteTag;
