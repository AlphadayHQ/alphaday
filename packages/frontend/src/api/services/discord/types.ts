import { TDiscordEmbed, TDiscordItem } from "src/api/types";
import { TRemoteItem, TPagination } from "../baseTypes";

/**
 * Primitive types
 */

export type TRemoteDiscordItem = Omit<
    TRemoteItem,
    "is_bookmarked" | "num_clicks" | "tags"
> & {
    published_at: string;
    social_network: "discord";
    image: string | null;
    tweet: TRemoteDiscordTweet;
};

export type TRemoteDiscordAuthor = {
    id: string;
    avatar: string | null;
    username: string;
    global_name: string | null;
    public_flags: number;
    discriminator: string;
    avatar_decoration: string | null;
};

export type TRemoteDiscordEmbed = TDiscordEmbed;

export type TRemoteDiscordTweet = {
    id: string;
    tts: boolean;
    type: number;
    flags: number;
    author: TRemoteDiscordAuthor;
    embeds: TRemoteDiscordEmbed[];
    pinned: boolean;
    content: string;
    mentions: never[];
    timestamp: string;
    channel_id: string;
    components: never[];
    attachments: never[];
    mention_roles: never[];
    edited_timestamp: string | null;
    mention_everyone: boolean;
};

export type TRemoteDiscordSource = {
    name: string;
    slug: string;
    icon: string;
};

/**
 * Query types
 */

export type TGetDiscordItemsRequest = {
    page?: number;
    tags?: string;
} | void;

export type TGetDiscordItemsRawResponse = TPagination & {
    results: TRemoteDiscordItem[];
};

export type TGetDiscordItemsResponse = TPagination & {
    results: TDiscordItem[];
};
