import html2canvas from "html2canvas";
import querystring from "query-string";
import { TVideoItem } from "src/api/types";
import CONFIG from "src/config";
import { Logger } from "./logging";

type TOnOrOff = 1 | 0;
type TEmbedOptions = {
    autoplay?: TOnOrOff;
    showinfo?: TOnOrOff;
    controls?: TOnOrOff;
    rel?: TOnOrOff;
    autohide?: TOnOrOff;
    loop?: TOnOrOff;
    modestbranding?: TOnOrOff;
    mute?: TOnOrOff;
};

const {
    WIDGETS: { MEDIA },
} = CONFIG;

export const entryEmbedUrl = (
    entryId: string,
    options: TEmbedOptions = {}
): string => {
    const params: string = querystring.stringify(options);
    return `${String(MEDIA.YOUTUBE_EMBED_BASE_URL)}${entryId}?${params}`;
};

/**
 * Extracts the YouTube video id from any of the common URL shapes:
 * - https://www.youtube.com/watch?v=ID
 * - https://www.youtube.com/shorts/ID
 * - https://youtu.be/ID
 * - https://www.youtube.com/embed/ID
 *
 * @returns the video id, or null when it can't be determined.
 */
export const getYoutubeVideoId = (url: string): string | null => {
    if (!url) return null;
    try {
        const parsed = new URL(url, "https://www.youtube.com");
        const { hostname } = parsed;
        // youtu.be short links carry the id as the first (and only) path segment
        if (hostname === "youtu.be") {
            return parsed.pathname.match(/^\/([^/?#]+)/)?.[1] ?? null;
        }
        // Only treat youtube.com hosts (www., m., music., …) as YouTube; any
        // other host is left for the caller to pass through unchanged.
        if (hostname.endsWith("youtube.com")) {
            const fromQuery = parsed.searchParams.get("v");
            if (fromQuery) return fromQuery;
            // /shorts/ID and /embed/ID — note a bare /watch with no `v` is not
            // a valid id source, so it correctly falls through to null.
            return (
                parsed.pathname.match(/\/(?:shorts|embed)\/([^/?#]+)/)?.[1] ??
                null
            );
        }
        return null;
    } catch (e) {
        Logger.error("getYoutubeVideoId::failed to parse url", url, e);
        return null;
    }
};

/**
 * Builds a playable YouTube embed URL from any YouTube URL shape.
 * Falls back to the original URL when the id can't be extracted, so
 * non-YouTube sources keep working.
 */
export const getVideoEmbedUrl = (
    url: string,
    options: TEmbedOptions = {}
): string => {
    const id = getYoutubeVideoId(url);
    if (!id) return url;
    return entryEmbedUrl(id, options);
};

/**
 * `true` when a YouTube URL points to a Short (vertical 9:16 content).
 */
export const isYoutubeShortUrl = (url: string): boolean =>
    /\/shorts\//.test(url ?? "");

/**
 * Normalizes a backend aspect ratio into a numeric width / height ratio.
 * Accepts a float (e.g. 0.5625) or a "W:H" string (e.g. "9:16").
 *
 * @returns the ratio, or undefined when it can't be parsed.
 */
export const parseAspectRatio = (
    aspectRatio: number | string | undefined
): number | undefined => {
    if (aspectRatio === undefined || aspectRatio === null) return undefined;
    if (typeof aspectRatio === "number") {
        return aspectRatio > 0 ? aspectRatio : undefined;
    }
    const colonMatch = aspectRatio.match(
        /^\s*(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)\s*$/
    );
    if (colonMatch) {
        const w = Number(colonMatch[1]);
        const h = Number(colonMatch[2]);
        return h > 0 ? w / h : undefined;
    }
    const numeric = Number(aspectRatio);
    return Number.isFinite(numeric) && numeric > 0 ? numeric : undefined;
};

const LANDSCAPE_RATIO = 16 / 9;
const VERTICAL_RATIO = 9 / 16;

/**
 * Resolves the orientation of a video using, in order of precedence:
 *   1. the backend `aspectRatio` (when present and parseable)
 *   2. the `/shorts/` URL heuristic (YouTube Shorts are vertical)
 *   3. a landscape (16:9) default
 */
export const resolveVideoAspect = (
    video: Pick<TVideoItem, "url" | "aspectRatio">
): { ratio: number; isVertical: boolean } => {
    const fromBackend = parseAspectRatio(video.aspectRatio);
    if (fromBackend !== undefined) {
        return { ratio: fromBackend, isVertical: fromBackend < 1 };
    }
    if (isYoutubeShortUrl(video.url)) {
        return { ratio: VERTICAL_RATIO, isVertical: true };
    }
    return { ratio: LANDSCAPE_RATIO, isVertical: false };
};

/**
 * Creates a Screenshot of an HTML element in the app.
 *
 * @param selector Element selector e.g #root, body etc
 * @param filter Filter to apply to elements to remove tainted elements from screenshot
 * @returns {Promise<string>} - base64 encoded image or null if screenshot fails
 *
 *
 * @example - screenshot the app
 * ```ts
 * // screenshot the entire app
 * const screenshot = createScreenshot("#root");
 * ```
 */
export const createScreenshot = async (
    selector: string,
    scale: number,
    filter?: (e: Element) => boolean
): Promise<string | null> => {
    Logger.debug("createScreenshot::called");
    const boardNode = document.body.querySelector<HTMLDivElement>(selector);

    if (boardNode === null) {
        Logger.error("createScreenshot::empty nodes, This should not happen");
        return null;
    }

    try {
        Logger.debug("createScreenshot::creating", boardNode);
        return await html2canvas(boardNode, {
            scale,
            ignoreElements: filter,
            height: Math.min(boardNode.clientHeight, 900),
            logging: !CONFIG.IS_PROD,
        }).then((canvas) => canvas.toDataURL());
    } catch (e) {
        Logger.error("createScreenshot::failed", e);
        return null;
    }
};
