import type {
    TRemoteTweetImage,
    TRemoteTweetTag,
    TRemoteTweetMention,
    TRemoteTweet,
} from "../services";

export type TReferencedTweet = {
    id: string;
    type: "retweeted" | "replied_to" | "quoted";
    tweet?: TRemoteTweet;
};

export type TTweetTag = TRemoteTweetTag;

export type TTweetMention = TRemoteTweetMention;

export type TTweetImage = TRemoteTweetImage;

export type TTweetMetric = {
    retweets: number;
    replies: number;
    likes: number;
    quotes: number;
};

export type TTweetEntities = {
    urls?: TTweetUrl[];
    hashtags?: TTweetTag[];
    cashtags?: TTweetTag[];
    mentions?: TTweetMention[];
};

export type TTweetAttachment = {
    id: string;
    width: number | undefined;
    height: number | undefined;
    type: "photo" | "video";
    views: number;
    duration: number | undefined;
    previewImageUrl: string | undefined;
    url: string | undefined;
};

export type TTweetUrl = {
    url: string;
    status?: number;
    title?: string;
    displayUrl: string;
    expandedUrl: string;
    description?: string;
    images?: TTweetImage[];
    mediaKey?: string;
    start: number;
    end: number;
};

export type TTweetAuthor = {
    id: string;
    name: string;
    username: string;
    bio: string;
    photoUrl: string;
    verified: boolean;
    metrics: {
        tweets: number;
        followers: number;
        following: number;
    };
    joinedAt: string;
};

export type TTweets = {
    id: string;
    text: string;
    source: string;
    sensitive: boolean;
    author: TTweetAuthor;
    entities: TTweetEntities | undefined;
    attachments: TTweetAttachment[] | undefined;
    referencedTweets: TReferencedTweet[] | undefined;
    retweet: TTweets | undefined;
    createdAt: string;
    lang: string; // language code if we ever want to support with i18n
};
