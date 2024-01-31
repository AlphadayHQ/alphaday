import { TBaseItem } from "./primitives";

export enum EFeedItemType {
    NEWS = "newsitem",
    EVENT = "eventitem",
    VIDEO = "videoitem",
    PODCAST = "podcastitem",
}

export type TSuperfeedItem = Omit<TBaseItem, "bookmarked"> & {
    type: EFeedItemType;
    startsAt: string | null;
    endsAt: string | null;
    image: string | null;
    shortDescription?: string;
    tags: { name: string; slug: string }[];
    likes: number;
    comments: number;
};

export interface IVideoFeedItem extends Omit<TSuperfeedItem, "type"> {
    type: EFeedItemType.VIDEO;
}

export interface IPodcastFeedItem extends Omit<TSuperfeedItem, "type"> {
    type: EFeedItemType.PODCAST;
}

export interface IEventFeedItem
    extends Omit<TSuperfeedItem, "type" | "source" | "date"> {
    type: EFeedItemType.EVENT;
    startDate: Date;
    endDate: Date;
    category: string;
    location: string;
}

export type IFeedItem =
    | TSuperfeedItem
    | IEventFeedItem
    | IVideoFeedItem
    | IPodcastFeedItem;
