import eventIcon from "src/assets/feedIcons/event.png";
import newsIcon from "src/assets/feedIcons/news.png";
import videoIcon from "src/assets/feedIcons/video.png";

export const feedIcons = {
    news: newsIcon,
    events: eventIcon,
    video: videoIcon,
};
export enum EFeedItemType {
    NEWS = "news",
    EVENTS = "events",
    VIDEO = "video",
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

export type IFeedItem = INewsFeedItem | IEventsFeedItem | IVideoFeedItem;

// export type IFeedItem<T extends EFeedItemType> =
//     T extends EFeedItemType.NEWS ? INewsFeedItem : IEventsFeedItem;
