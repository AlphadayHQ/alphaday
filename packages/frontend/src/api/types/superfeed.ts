import { TBaseItem } from "./primitives";

export enum EFeedItemType {
    NEWS = "newsitem",
    EVENT = "eventitem",
    VIDEO = "videoitem",
    PODCAST = "podcastitem",
    IMAGE = "imageitem",
    BLOG = "blogitem",
    FORUM = "forumitem",
    PERSON = "personitem",
    REDDIT = "reddititem",
    DISCORD = "discorditem",
    PRICE = "priceitem",
    TVL = "tvlitem",
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
};
