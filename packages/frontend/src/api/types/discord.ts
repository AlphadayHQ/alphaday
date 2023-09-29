export type TDiscordAuthor = {
    id: string;
    avatar: string;
    username: string;
    name: string;
};

export type TDiscordEmbedFormat = "article" | "rich" | "video" | "image";

export type TDiscordEmbed<T extends TDiscordEmbedFormat = TDiscordEmbedFormat> =
    T extends "image" | "video" | "article"
        ? {
              url: string;
              type: T;
              title: string;
              thumbnail: {
                  url: string;
                  width: number;
                  height: number;
              };
          }
        : {
              url: string;
              type: T;
              title: string;
              description: string;
              image?: {
                  url: string;
                  width: number;
                  height: number;
              };
              color: number;
              footer: {
                  text: string;
                  icon_url: string;
              };
              author: {
                  name: string;
                  url: string;
                  icon_url: string;
              };
              timestamp: string;
          };

export type TDiscordItem = {
    id: string;
    author: TDiscordAuthor;
    source: {
        name: string;
        slug: string;
        icon: string;
    };
    flags: number;
    embeds: TDiscordEmbed[];
    pinned: boolean;
    content: string;
    href: string;
    timestamp: string;
    editedAt?: string;
};
