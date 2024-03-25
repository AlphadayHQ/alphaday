import { TBaseItem } from "./primitives";

export enum EFeedItemType {
    NEWS = "newsitem",
    EVENT = "eventitem",
    VIDEO = "videoitem",
    PODCAST = "podcastitem",
    IMAGE = "imageitem",
    MEME = "memeitem",
    BLOG = "blogitem",
    FORUM = "forumitem",
    PERSON = "personitem",
    REDDIT = "reddititem",
    DISCORD = "discorditem",
    MARKET = "marketitem",
    TVL = "tvlitem",
    GAS = "gasitem",
}

/**
 * note: values here match keys in userFilter slice
 */
export enum ESupportedFilters {
    Coins = "coins",
    ConceptTags = "conceptTags",
    Chains = "chains",
    MediaTypes = "mediaTypes",
    TimeRange = "timeRange",
    SortBy = "sortBy",
}

export enum ESortFeedBy {
    Trendiness = "trendiness",
    Date = "date",
}

export enum ETimeRange {
    Anytime = "anytime",
    Last24 = "last-24",
    Last7Days = "last-7-days",
    Last30Days = "last-30-days",
    Last90Days = "last-90-days",
    Last6Months = "last-6-months",
}

export type TFilterKeyword = {
    id: number;
    name: string;
    slug: string;
    type: ESupportedFilters;
};

export type TGroupedFilterKeywords = {
    [ESupportedFilters.Coins]: TFilterKeyword[];
    [ESupportedFilters.Chains]: TFilterKeyword[];
    [ESupportedFilters.ConceptTags]: TFilterKeyword[];
};

/**
 * defines how filter group names are displayed in the UI
 */
export const GROUP_NAME_MAP: Record<string, string> = {
    [ESupportedFilters.Chains]: "Chains",
    [ESupportedFilters.Coins]: "Coins",
    [ESupportedFilters.ConceptTags]: "Other",
};

/**
 * filter search bar types
 */
export type TFilterKeywordOption = TFilterKeyword & {
    label: string;
    value: string;
};
export type TFilterKeywordOptionGroup = {
    label: string;
    options: TFilterKeywordOption[];
};

export type TTVLFeedDataItem = {
    tvl: number;
    icon: string;
    name: string;
    slug: string;
};

export type TFeedItemData = {
    coin?: {
        name: string;
        slug: string;
        ticker: string;
    };
    price?: number;
    history?: string;
    interval?: string;
    location?: string | null;
    itemType?: string | null;
    projects?: TTVLFeedDataItem[];
    projectType?: "protocol" | "chain";
    gasFast?: number;
    gasSlow?: number;
    gasStandard?: number;
    gasPercentChange?: number;
    gasPrevGasStandard?: number;
};

export type TSuperfeedItem = Omit<TBaseItem, "bookmarked"> & {
    itemId: number;
    trendiness: number;
    type: EFeedItemType;
    date: string;
    startsAt: string | null;
    endsAt: string | null;
    image: string | null;
    shortDescription?: string;
    tags: { name: string; slug: string }[];
    likes: number;
    isLiked: boolean;
    comments: number;
    fileUrl: string | null;
    duration: string | null;
    data: TFeedItemData | null;
};
