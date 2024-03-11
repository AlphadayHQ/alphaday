import { EItemFeedPreference, TVideoChannel, TVideoItem } from "src/api/types";
import { TRemoteItem, TPagination } from "../baseTypes";

export type TRemoteVideoItem = TRemoteItem & {
    image: string;
    published_at: string;
    short_description: string;
};

export type TGetVideoItemsRequest = {
    published_at?: string;
    tags?: string;
    period?: string;
    page?: number;
    limit?: number;
    feedPreference?: EItemFeedPreference;
};
export type TGetLatestVideoRawResponse = TRemoteVideoItem;

export type TGetVideoItemsRawResponse = TPagination & {
    results: TRemoteVideoItem[];
};
export type TGetVideoItemsResponse = TPagination & {
    results: TVideoItem[];
};

export type TGetLatestVideoRequest = {
    tags?: string;
};

export type TGetLatestVideoResponse = TVideoItem;

export type TOpenVideoItemRequest = {
    id: number;
};
export type TOpenVideoItemResponse = Omit<TRemoteVideoItem, "id">;

export type TBookmarkVideoItemRequest = {
    item: TVideoItem;
};

export type TBookmarkVideoItemResponse = Omit<TRemoteVideoItem, "id">;

export type TGetVideoChannelsResponse = TVideoChannel[];

export type TLikeVideoItemRequest = {
    id: number;
};
export type TLikeVideoItemResponse = Omit<TRemoteVideoItem, "id">;
