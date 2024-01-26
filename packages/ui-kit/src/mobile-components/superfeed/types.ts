import blogIcon from "src/assets/feedIcons/blog.png";
import eventIcon from "src/assets/feedIcons/event.png";
import forumIcon from "src/assets/feedIcons/forum.png";
import imageIcon from "src/assets/feedIcons/image.png";
import newsIcon from "src/assets/feedIcons/news.png";
import personIcon from "src/assets/feedIcons/person.png";
import podcastIcon from "src/assets/feedIcons/podcast.png";
import videoIcon from "src/assets/feedIcons/video.png";

export const feedIcons = {
    news: newsIcon,
    events: eventIcon,
    video: videoIcon,
    podcast: podcastIcon,
    image: imageIcon,
    blog: blogIcon,
    forum: forumIcon,
    person: personIcon,
};
export enum EFeedItemType {
    NEWS = "news",
    EVENT = "events",
    VIDEO = "video",
    PODCAST = "podcast",
    IMAGE = "image",
    BLOG = "blog",
    FORUM = "forum",
    PERSON = "person",
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

export interface IPersonFeedItem extends Omit<INewsFeedItem, "type" | "img"> {
    type: EFeedItemType.PERSON;
}

export interface IForumFeedItem extends Omit<INewsFeedItem, "type" | "img"> {
    type: EFeedItemType.FORUM;
}
export interface IBlogFeedItem extends Omit<INewsFeedItem, "type" | "img"> {
    type: EFeedItemType.BLOG;
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
    | IBlogFeedItem
    | IForumFeedItem
    | IEventFeedItem
    | IVideoFeedItem
    | IPodcastFeedItem
    | IPersonFeedItem
    | IImageFeedItem;
