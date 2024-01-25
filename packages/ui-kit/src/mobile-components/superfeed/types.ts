import eventIcon from "src/assets/feedIcons/event.png";
import newsIcon from "src/assets/feedIcons/news.png";
import podcastIcon from "src/assets/feedIcons/podcast.png";
import videoIcon from "src/assets/feedIcons/video.png";

export const feedIcons = {
    news: newsIcon,
    events: eventIcon,
    video: videoIcon,
    podcast: podcastIcon,
};
export enum EFeedItemType {
    NEWS = "news",
    EVENTS = "events",
    VIDEO = "video",
    PODCAST = "podcast",
}

export interface INewsFeedItem {
    id: number;
    type: EFeedItemType.NEWS;
    title: string;
    date: Date;
    source: {
        name: string;
        img: string;
    };
    description?: string;
    tags: string[];
    likes: number;
    comments: number;
    link: string;
    img: string;
}

export interface IVideoFeedItem extends Omit<INewsFeedItem, "type"> {
    type: EFeedItemType.VIDEO;
}

export interface IPodcastFeedItem extends Omit<INewsFeedItem, "type"> {
    type: EFeedItemType.PODCAST;
}

interface IEventsFeedItem {
    id: number;
    type: EFeedItemType.EVENTS;
    title: string;
    date: Date;
    description: string;
    tags: string[];
    likes: number;
    comments: number;
    link: string;
    img: string;
}

export type IFeedItem =
    | INewsFeedItem
    | IEventsFeedItem
    | IVideoFeedItem
    | IPodcastFeedItem;
