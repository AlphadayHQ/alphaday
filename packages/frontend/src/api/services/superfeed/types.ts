import { EFeedItemType, TFeedItemData, TSuperfeedItem } from "src/api/types";
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
    is_liked: boolean;
    comments: number;
    data: TFeedItemData | null;
};

/**
 * Filter data types
 */

export type TBaseFilterTag = {
    name: string;
    slug: string;
    tag_type: string;
};
export type TFilterDatum = TBaseFilterItem & { id: number };
export type TTaggedFilterDatum = TBaseFilterItem & {
    icon: string;
    tags: TBaseFilterTag[];
};

export type TRemoteFilterKeyword = {
    id: number;
    name: string;
    tag: {
        id: number;
        name: string;
        slug: string;
    };
};

/**
 * Query types
 */

export type TGetSuperfeedItemsRequest = {
    tags?: string;
    page?: number;
    limit?: number;
    content_types?: string;
    days?: number;
    user_filter?: boolean;
    sort_order?: string;
};

export type TGetSuperfeedItemsRawResponse = TPagination & {
    results: TRemoteSuperfeedItem[];
};
export type TGetSuperfeedItemsResponse = TPagination & {
    results: TSuperfeedItem[];
};

export type TGetSuperfeedFilterDataRequest = void;
export type TGetSuperfeedFilterDataRawResponse = {
    concept_tags: TFilterDatum[];
    coins: TTaggedFilterDatum[];
    projects: TTaggedFilterDatum[];
};
export type TGetSuperfeedFilterDataResponse = {
    conceptTags: TFilterDatum[];
    coins: TTaggedFilterDatum[];
    chains: TTaggedFilterDatum[];
};

export type TGetSuperfeedFilterKeywordsRequest = {
    filter_text: string;
};
export type TGetSuperfeedFilterKeywordsRawResponse = {
    concept_keywords: TRemoteFilterKeyword[];
    coin_keywords: TRemoteFilterKeyword[];
    chain_keywords: TRemoteFilterKeyword[];
};
export type TGetSuperfeedFilterKeywordsResponse = {
    conceptTags: TRemoteFilterKeyword[];
    coins: TRemoteFilterKeyword[];
    chains: TRemoteFilterKeyword[];
};

export type TLikeSuperfeedItemRequest = {
    id: number;
};
export type TLikeSuperfeedItemRawResponse = TRemoteSuperfeedItem;
export type TLikeSuperfeedItemResponse = TSuperfeedItem;
