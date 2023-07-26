import html2canvas from "html2canvas";
import querystring from "query-string";
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
