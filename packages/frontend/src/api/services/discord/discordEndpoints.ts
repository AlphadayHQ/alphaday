import queryString from "query-string";
import { Logger } from "src/api/utils/logging";
import CONFIG from "src/config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetDiscordItemsRequest,
    TGetDiscordItemsRawResponse,
    TGetDiscordItemsResponse,
} from "./types";

const { SOCIALS } = CONFIG.API.DEFAULT.ROUTES;

const discordApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getDiscordItems: builder.query<
            TGetDiscordItemsResponse,
            TGetDiscordItemsRequest
        >({
            query: (req) => {
                const params: string = queryString.stringify({
                    ...req,
                    social_network: SOCIALS.DISCORD,
                });
                const path = `${String(SOCIALS.BASE)}?${params}`;
                Logger.debug("getDiscordItems: querying", path);
                return path;
            },
            transformResponse: (
                r: TGetDiscordItemsRawResponse
            ): TGetDiscordItemsResponse => ({
                ...r,
                results: r.results.map(({ tweet: item, source, url }) => ({
                    id: item.id,
                    author: {
                        id: item.author.id,
                        avatar: item.author.avatar ?? "",
                        username: `${item.author.username}#${item.author.discriminator}`,
                        name: item.author.global_name ?? item.author.username,
                    },
                    content: item.content,
                    href: url,
                    embeds: item.embeds,
                    pinned: item.pinned,
                    flags: item.flags,
                    timestamp: new Date(item.timestamp),
                    editedAt: item.edited_timestamp
                        ? new Date(item.edited_timestamp)
                        : undefined,
                    source,
                })),
            }),
        }),
    }),
    overrideExisting: false,
});

export const { useGetDiscordItemsQuery } = discordApi;
