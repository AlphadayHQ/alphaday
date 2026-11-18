/**
 * Protocols that are safe to navigate to or embed. Anything else, notably
 * `javascript:`, `data:` and `vbscript:`, is rejected.
 */
const SAFE_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

/**
 * Returns `url` unchanged if it uses a safe protocol, otherwise `undefined`.
 *
 * Use this on every URL that comes from API or user data before it reaches
 * `href`, `window.open` or an iframe `src`. React does not block
 * `javascript:` URLs, so without this check a malicious link runs script in
 * the app's origin when clicked or loaded.
 *
 * Relative URLs (`/path`, `#hash`, `?q=1`) are resolved against the current
 * origin and allowed. The URL parser strips the tabs and newlines browsers
 * ignore, so obfuscated values such as `java\tscript:` are still caught.
 */
export const safeUrl = (url: unknown): string | undefined => {
    if (typeof url !== "string" || url.trim() === "") return undefined;
    try {
        const { protocol } = new URL(url, window.location.origin);
        return SAFE_PROTOCOLS.has(protocol) ? url : undefined;
    } catch {
        return undefined;
    }
};

/**
 * Opens `url` in a new tab if it passes {@link safeUrl}, and does nothing
 * otherwise. `noopener` stops the opened page from reaching back to this
 * tab through `window.opener` (reverse tabnabbing).
 */
export const openInNewTab = (url: unknown): void => {
    const safe = safeUrl(url);
    if (safe) window.open(safe, "_blank", "noopener,noreferrer");
};
