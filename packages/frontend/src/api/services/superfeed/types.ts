import { EFeedItemType, TSuperfeedItem } from "src/api/types";
import { TPagination } from "../baseTypes";

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
    duration: number | null;
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
};
export type TGetSuperfeedItemsRawResponse = TPagination & {
    results: TRemoteSuperfeedItem[];
};
export type TGetSuperfeedItemsResponse = TPagination & {
    results: TSuperfeedItem[];
};
