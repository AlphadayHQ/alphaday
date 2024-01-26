import eventIcon from "src/assets/feedIcons/event.png";
import imageIcon from "src/assets/feedIcons/image.png";
import newsIcon from "src/assets/feedIcons/news.png";
import podcastIcon from "src/assets/feedIcons/podcast.png";
import videoIcon from "src/assets/feedIcons/video.png";

export const feedIcons = {
    news: newsIcon,
    events: eventIcon,
    video: videoIcon,
    podcast: podcastIcon,
    image: imageIcon,
};
export enum EFeedItemType {
    NEWS = "news",
    EVENT = "events",
    VIDEO = "video",
    PODCAST = "podcast",
    IMAGE = "image",
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

export interface IImageFeedItem extends Omit<INewsFeedItem, "type" | "source"> {
    type: EFeedItemType.IMAGE;
    source: {
        name: string;
    };
}

export interface IEventFeedItem
    extends Omit<INewsFeedItem, "type" | "source" | "date"> {
    type: EFeedItemType.EVENT;
    startDate: Date;
    endDate: Date;
    category: string;
    location: string;
}

export type IFeedItem =
    | INewsFeedItem
    | IEventFeedItem
    | IVideoFeedItem
    | IPodcastFeedItem
    | IImageFeedItem;
