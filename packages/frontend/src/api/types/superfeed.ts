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
    PRICE = "priceitem",
    TVL = "tvlitem",
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

export type TSuperfeedItem = Omit<TBaseItem, "bookmarked"> & {
    type: EFeedItemType;
    date: string;
    startsAt: string | null;
    endsAt: string | null;
    image: string | null;
    shortDescription?: string;
    tags: { name: string; slug: string }[];
    likes: number;
    comments: number;
    fileUrl: string | null;
    duration: string | null;
};
