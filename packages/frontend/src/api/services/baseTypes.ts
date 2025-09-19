/**
 * Alphaday remote base types
 */

export enum ETag {
    Global = "global",
    Local = "local",
}

export type TProtoItem = {
    name: string;
    slug: string;
};

export enum EItemsSortBy {
    Popular = "-popular",
    New = "-created",
    Name = "name",
}

export type TBaseTag = TProtoItem & {
    id: number;
    tag_type: ETag;
};

export type TRemoteTagMeta = {
    tag_type: string; // drct | prnt
    is_source_tag: boolean;
    is_locked: boolean;
};

export type TRemoteTagKeyword = {
    id: number;
    name: string;
    is_excluded: boolean;
};

export type TRemoteTagBase = {
    name: string;
    slug: string;
    keywords: TRemoteTagKeyword[];
};

export type TRemoteTagWithMeta = TBaseTag & {
    meta?: TRemoteTagMeta; // note: BE doesn't seem to return this
};

export type TRemoteTag = TRemoteTagWithMeta & {
    keywords: TRemoteTagKeyword[];
    parents: TRemoteTagBase[];
};

export type TRemoteTagReadOnly = TBaseTag;

export type TRemoteItem = {
    id: number;
    hash: string;
    title: string;
    url: string;
    tags: TRemoteTagReadOnly[];
    source: {
        name: string;
        slug: string;
        icon: string;
    };
    num_clicks: number;
    is_bookmarked: boolean;
};

export type TPagination = {
    links: {
        next: string | null;
        previous: string | null;
    };
    total: number;
};

export type TRemoteProjectType = "protocol" | "chain";

export type TRemoteChain = {
    name: string;
    slug: string;
};

export type TRemoteLink = {
    label: string;
    url: string;
};

export type TRemoteBaseProject = {
    name: string;
    slug: string;
    project_type: TRemoteProjectType;
    network_id: number;
    icon?: string;
    url?: string;
};

export type TBaseCoin = TProtoItem & {
    id: number;
    ticker: string;
    icon?: string;
    description?: string;
    price?: number;
    max_supply?: number;
    circulating_supply?: number;
    total_supply?: number;
    rank?: number;
    gecko_id?: number;
    cmc_id?: number;
    is_pinned: boolean;
    market_cap: number;
    volume: number;
    price_percent_change_24h: number;
    price_percent_change_7d: number;
    price_percent_change_14d: number;
    price_percent_change_30d: number;
    price_percent_change_60d: number;
    tags: TRemoteTagReadOnly[];
};

export type TRemoteWriteComment = {
    content_type: string;
    object_pk: string;
    timestamp: string;
    security_hash: string;
    honeypot: string;
    name: string;
    email: string;
    url: string;
    comment: string;
    followup: boolean;
    reply_to: number;
};

export type TRemoteFlag = {
    comment: number;
    flag: string;
};

export type TTvlDatum = {
    currency: string;
    tvl: number;
    tvl_percent_change_1h: number;
    tvl_percent_change_1d: number;
    tvl_percent_change_7d: number;
    date: string;
};

export type TSocialItemNetwork = "twitter" | "lenster" | "orb";

export type TSocialItemSource = {
    name: string;
    slug: string;
    icon: string;
};

export type TSocialAccount = {
    id: number;
    hash: string;
    account_id: string;
    social_network: string;
    name: string;
    username: string;
    image: string;
    description: string;
    followers: number;
    following: number;
    posts: number;
    verified: boolean;
    tags: string[];
};

export type TSocialItemPost = {
    id: string;
};

export type TSocialItem<T extends TSocialItemPost> = {
    id: number;
    hash: string;
    source: TSocialItemSource;
    title: string;
    url: string;
    image: string | null;
    tweet: T;
    social_account: TSocialAccount;
    social_network: TSocialItemNetwork;
    published_at: string;
};

export type TBaseFilterItem = TProtoItem;
