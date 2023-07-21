import { Logger } from "src/api/utils/logging";
import { alphadayApi } from "../alphadayApi";
import { TGetMediaRequest, TGetMediaResponse } from "./types";

export const mediaApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        // a media source is a youtube video found in an rss feed
        getMediaSource: builder.query<TGetMediaResponse, TGetMediaRequest>({
            query: (req) => {
                Logger.debug("querying getMediaSource...", req.feedUrl);
                return {
                    url: req.feedUrl,
                    // we need to parse an RSS feed to get the latest video
                    // we'll still keep the code here for now, but we may remove it in the future
                    responseHandler: "text", // this ensures we get a string as response and not JSON
                };
            },
            // once we have the response as a string, we'll parse it into a usable format
            // we'll then read the nodes and return the last video entry id and thumbnail url
            // just as in query, we'll also keep the code here for now, but we may remove it in the future
            transformResponse: (response: string): TGetMediaResponse => {
                const nodes = new DOMParser().parseFromString(
                    response,
                    "text/xml"
                );
                const entryNode = nodes.querySelector("entry");
                const entryId = entryNode
                    ?.getElementsByTagName("yt:videoId")
                    ?.item(0)?.textContent;
                const thumbnailUrl = entryNode
                    ?.getElementsByTagName("media:thumbnail")
                    ?.item(0)
                    ?.getAttribute("url");
                return {
                    thumbnail: thumbnailUrl || undefined,
                    entryId: entryId || undefined,
                };
            },
        }),
    }),
    overrideExisting: false,
});

export const { useGetMediaSourceQuery } = mediaApi;
