import { TRedditItem } from "src/api/types";
import { TRemoteItem, TPagination } from "../baseTypes";

/**
 * Primitive types
 */
export type TRemoteRedditItem = Omit<
    TRemoteItem,
    "is_bookmarked" | "num_clicks" | "tags"
> & {
    published_at: string;
    social_network: "reddit";
};

/**
 * Query types
 */
export type TGetRedditItemsRequest = {
    page?: number;
    tags?: string;
};
export type TGetRedditItemsRawResponse = TPagination & {
    results: TRemoteRedditItem[];
};
export type TGetRedditItemsResponse = TPagination & {
    results: TRedditItem[];
};
