import { TTweets, TReferencedTweet } from "src/api/types";
import { TPagination, TSocialItem } from "../baseTypes";

export type TRemoteTweetEntity = {
    start: number;
    end: number;
};

export type TRemoteTweetImage = {
    url: string;
    width: number;
    height: number;
};

export type TRemoteTweetUrl = TRemoteTweetEntity & {
    url: string;
    expanded_url: string;
    display_url: string;
    media_key?: string;
    images?: TRemoteTweetImage[];
    status?: number;
    title?: string;
    description?: string;
    unwound_url?: string;
};

export type TRemoteTweetMention = TRemoteTweetEntity & {
    id?: string;
    username: string;
};

export type TRemoteTweetTag = TRemoteTweetEntity & {
    tag: string;
};

export type TRemoteTweetAnnotation = TRemoteTweetEntity & {
    probability: number;
    type:
        | "Product"
        | "Organization"
        | "Person"
        | "Location"
        | "Event"
        | "Other";
    normalized_text: string;
};

export type TRemoteTweetMetrics = {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
};

export type TRemoteTweetEntities = {
    urls?: TRemoteTweetUrl[];
    mentions?: TRemoteTweetMention[];
    cashtags?: TRemoteTweetTag[];
    hashtags?: TRemoteTweetTag[];
    annotations?: TRemoteTweetAnnotation[];
};

export type TRemoteTweet = {
    id: string;
    text: string;
    source: string;
    possibly_sensitive: boolean;
    entities?: TRemoteTweetEntities;
    author_id: string;
    author: TRemoteTweetUser;
    in_reply_to_user_id?: string;
    public_metrics: TRemoteTweetMetrics;
    reply_settings: string;
    referenced_tweets?: TReferencedTweet[];
    conversation_id: string;
    created_at: string;
    lang: string; // language code if we ever want to support with i18n
    attachments?: {
        media_keys: string[];
        attachments: TRemoteTweetMedia[];
    };
    edit_history_tweet_ids?: string[];
};

export type TRemoteTweetMedia = {
    url?: string;
    media_key: string;
    width?: number;
    height?: number;
    type: "photo" | "video";
    variants?: unknown;
    duration_ms?: number;
    public_metrics?: {
        view_count: number;
    };
    preview_image_url?: string;
};

export type TRemoteTweetUser = {
    id: string;
    name: string;
    username: string;
    description: string;
    url: string;
    profile_image_url: string;
    protected: boolean;
    verified: boolean;
    created_at: string;
    entities?: {
        url?: {
            urls?: TRemoteTweetUrl[];
        };
        description?: {
            mentions?: TRemoteTweetMention[];
            cashtags?: TRemoteTweetTag[];
            hashtags?: TRemoteTweetTag[];
        };
    };
    public_metrics: {
        followers_count: number;
        following_count: number;
        tweet_count: number;
        listed_count: number;
    };
};

export type TGetTweetsRequest = {
    page?: number;
    tags?: string;
};

export type TBaseRemoteTweet = TSocialItem<TRemoteTweet>;

export type TGetTweetsRawResponse = TPagination & {
    results: TBaseRemoteTweet[];
};

export type TGetTweetsResponse = TPagination & {
    results: TSocialItem<TTweets>[];
};
