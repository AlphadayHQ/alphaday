import blogIcon from "src/assets/feedIcons/blog.png";
import eventIcon from "src/assets/feedIcons/event.png";
import forumIcon from "src/assets/feedIcons/forum.png";
import imageIcon from "src/assets/feedIcons/image.png";
import newsIcon from "src/assets/feedIcons/news.png";
import personIcon from "src/assets/feedIcons/person.png";
import podcastIcon from "src/assets/feedIcons/podcast.png";
import socialIcon from "src/assets/feedIcons/social.png";
import trendDownIcon from "src/assets/feedIcons/trend-down.png";
import trendUpIcon from "src/assets/feedIcons/trend-up.png";
import tvlIcon from "src/assets/feedIcons/TVL.png";
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
    social: socialIcon,
    price: (down: boolean) => (down ? trendDownIcon : trendUpIcon),
    tvl: tvlIcon,
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
    SOCIAL = "social",
    PRICE = "price",
    TVL = "tvl",
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

export interface ISocialFeedItem extends Omit<INewsFeedItem, "type"> {
    type: EFeedItemType.SOCIAL;
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

export interface IPriceFeedItem
    extends Omit<
        INewsFeedItem,
        "type" | "source" | "title" | "description" | "img"
    > {
    type: EFeedItemType.PRICE;
    price: number;
    change: number;
    coin: {
        name: string;
        img: string;
    };
    history: number[][];
}

export interface ITVLFeedItem extends Omit<IPriceFeedItem, "type" | "price"> {
    type: EFeedItemType.TVL;
    tvl: number;
}

export type IFeedItem = {
    id: number;
    title: string;
    url: string;
    sourceIcon: string;
    sourceSlug: string;
    sourceName: string;
    type: EFeedItemType;
    startsAt: string | null;
    endsAt: string | null;
    image: string | null;
    shortDescription?: string;
    tags: { name: string; slug: string }[];
    likes: number;
    comments: number;
};

// export type IFeedItem =
//     | INewsFeedItem
//     | IBlogFeedItem
//     | IForumFeedItem
//     | IEventFeedItem
//     | IVideoFeedItem
//     | IPodcastFeedItem
//     | IPersonFeedItem
//     | IImageFeedItem
//     | ISocialFeedItem
//     | IPriceFeedItem
//     | ITVLFeedItem;
