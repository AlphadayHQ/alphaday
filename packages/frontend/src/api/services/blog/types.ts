import { TBlogItem, EItemFeedPreference } from "src/api/types";
import { TPagination } from "../baseTypes";
import { TRemoteNewsItem } from "../news/types";

export type TRemoteBlogItem = TRemoteNewsItem;

export type TGetBlogItemsRequest = {
    page?: number;
    tags?: string;
    feedPreference?: EItemFeedPreference;
};
export type TGetBlogItemsRawResponse = TPagination & {
    results: TRemoteBlogItem[];
};
export type TGetBlogItemsResponse = TPagination & {
    results: TBlogItem[];
};

export type TBookmarkBlogItemRequest = {
    item: TBlogItem;
};

export type TBookmarkBlogItemResponse = Omit<TRemoteBlogItem, "id">;

export type TOpenBlogItemRequest = {
    id: number;
};
export type TOpenBlogItemResponse = Omit<TRemoteBlogItem, "id">;

export type TLikeBlogItemRequest = {
    id: number;
};
export type TLikeBlogItemResponse = Omit<TRemoteBlogItem, "id">;
