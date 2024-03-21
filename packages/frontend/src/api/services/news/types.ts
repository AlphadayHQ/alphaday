import { TNewsItem, EItemFeedPreference } from "src/api/types";
import { TRemoteItem, TPagination } from "../baseTypes";

export type TRemoteNewsItem = Omit<TRemoteItem, "tags"> & {
    author: string;
    published_at: string;
};

export type TRemoteNewsSummary = {
    tags: string[];
    summary: string;
    updated_at: string;
};

export type TGetNewsItemsRequest = {
    page?: number;
    tags?: string;
    feedPreference?: EItemFeedPreference;
};
export type TGetNewsItemsRawResponse = TPagination & {
    results: TRemoteNewsItem[];
};

export type TGetNewsSummaryRequest = {
    tags?: string;
};
export type TGetNewsSummaryRawResponse = TRemoteNewsSummary;

export type TGetNewsItemsResponse = TPagination & {
    results: TNewsItem[];
};

export type TBookmarkNewsItemRequest = {
    item: TNewsItem;
};

export type TBookmarkNewsItemResponse = Omit<TRemoteNewsItem, "id">;

export type TOpenNewsItemRequest = {
    id: number;
};
export type TOpenNewsItemResponse = Omit<TRemoteNewsItem, "id">;
