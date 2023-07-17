import {
    TPagination,
    TRemoteBaseProject,
    TRemoteTagWithMeta,
    TRemoteChain,
    TRemoteLink,
    TTvlDatum,
} from "../baseTypes";

/**
 * Primitive types
 */

export type TRemoteProject = TRemoteBaseProject & {
    id: number;
    hash: string;
    tags: TRemoteTagWithMeta[];
    chains: TRemoteChain[];
    links: TRemoteLink[];
    metadata: TTvlDatum & {
        id: number;
        project?: number;
    };
};

/**
 * Queries
 */

export type TGetProjectsRequest = void;
export type TGetProjectsResponse = TRemoteProject[];

export type TGetProjectByIdRequest = { id: number };
export type TGetProjectByIdResponse = TRemoteProject;

export type TTrendingItem = {
    id: number;
    slug: string;
    name: string;
    icon: string;
    metadata: {
        floor_price: number;
        average_price: number;
        total_sales: number;
        volume_percent_change_1d: number;
        volume_percent_change_7d: number;
        market_cap: number;
        num_owners: number;
        total_supply: number;
        icytools_rank: number;
    };
};

export type TGetTrendingItemsRequest = {
    page?: number;
    tags?: string[];
};
export type TGetTrendingItemsRawResponse = TPagination & {
    results: TTrendingItem[];
};
export type TGetTrendingItemsResponse = TPagination & {
    results: TTrendingItem[];
};
