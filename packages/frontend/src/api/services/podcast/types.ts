import {
    EItemFeedPreference,
    TPodcastChannel,
    TPodcastItem,
} from "src/api/types";
import { TRemoteItem, TPagination } from "../baseTypes";

export type TRemotePodcastItem = TRemoteItem & {
    image: string;
    published_at: string;
    short_description: string;
    duration: string;
    file_url: string;
};

export type TGetPodcastItemsRequest = {
    published_at?: string;
    tags?: string;
    period?: string;
    page?: number;
    limit?: number;
    feedPreference?: EItemFeedPreference;
};
export type TGetPodcastItemsRawResponse = TPagination & {
    results: TRemotePodcastItem[];
};
export type TGetPodcastItemsResponse = TPagination & {
    results: TPodcastItem[];
};

export type TOpenPodcastItemRequest = {
    id: number;
};
export type TOpenPodcastItemResponse = Omit<TRemotePodcastItem, "id">;

export type TBookmarkPodcastItemRequest = {
    item: TPodcastItem;
};

export type TBookmarkPodcastItemResponse = Omit<TRemotePodcastItem, "id">;

export type TGetPodcastChannelsResponse = TPodcastChannel[];
