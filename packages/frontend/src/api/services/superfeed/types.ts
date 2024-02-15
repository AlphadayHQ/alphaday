import { EFeedItemType, TSuperfeedItem } from "src/api/types";
import { TPagination, TBaseFilterItem } from "../baseTypes";

export type TRemoteSuperfeedItem = {
    id: number;
    content_type: EFeedItemType;
    item_id: number;
    title: string;
    item_date: string;
    trendiness: number;
    url: string;
    image: string;
    short_description: string;
    file_url: string | null;
    duration: string | null;
    starts_at: string | null;
    ends_at: string | null;
    source: {
        icon: string;
        name: string;
        slug: string;
    };
    tags: {
        name: string;
        slug: string;
    }[];
    likes: number;
    comments: number;
};

export type TGetSuperfeedItemsRequest = {
    tags?: string;
    page?: number;
    limit?: number;
    content_types?: string;
    days?: number;
    user_filter?: boolean;
};

export type TGetSuperfeedItemsRawResponse = TPagination & {
    results: TRemoteSuperfeedItem[];
};
export type TGetSuperfeedItemsResponse = TPagination & {
    results: TSuperfeedItem[];
};

export type TGetSuperfeedFilterDataRequest = void;
export type TGetSuperfeedFilterDataRawResponse = {
    concept_tags: TBaseFilterItem[];
    coins: TBaseFilterItem[];
    projects: TBaseFilterItem[];
};
export type TGetSuperfeedFilterDataResponse = {
    conceptTags: TBaseFilterItem[];
    coins: TBaseFilterItem[];
    chains: TBaseFilterItem[];
};
