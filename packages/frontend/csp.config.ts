import type { Plugin } from "vite";

/**
 * Content Security Policy for production builds.
 *
 * The goal is to stop injected markup from running script: `script-src`
 * has no `'unsafe-inline'` or `'unsafe-eval'`, so inline `<script>` tags,
 * `on*=` handlers and `javascript:` URLs are blocked, and scripts may only
 * load from the hosts listed below.
 *
 * `connect-src`, `img-src`, `media-src` and `frame-src` are deliberately
 * broad (`https:`/`wss:`): the app talks to many RPC nodes and data APIs and
 * embeds backend-configured content (YouTube, maps, Dune...), and listing
 * them all would break widgets whenever the backend adds a source.
 *
 * `style-src` needs `'unsafe-inline'` because several libraries
 * (react-hot-toast, web3modal) inject `<style>` tags at runtime.
 *
 * When adding a third-party script (analytics, SDK, widget), add its host
 * to `script-src` here. Hotjar is currently disabled; enabling it needs its
 * snippet moved out of the inline `<script>` in SeoContainer and its hosts
 * added here.
 *
 * Limits of a `<meta>` CSP: `frame-ancestors`, `report-uri`/`report-to` and
 * report-only mode are ignored, so clickjacking protection still has to come
 * from a response header (CloudFront).
 */
//
// Restrict sources to the exact path where the host also serves JSONP or
// other user-controlled script: accounts.google.com is a known JSONP
// bypass, so allowing the whole host would let injected markup run script
// despite the CSP. A trailing "/" matches the directory as a prefix.
// googletagmanager.com stays host-wide because gtag.js loads further files
// from it.
const SCRIPT_HOSTS = [
    "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/", // Sign in with Apple (index.html)
    "https://accounts.google.com/gsi/client", // Google sign-in (@react-oauth/google)
    "https://www.googletagmanager.com", // GA4 (react-ga4) and Firebase Analytics
    "https://*.clarity.ms", // Microsoft Clarity (www.clarity.ms, scripts.clarity.ms)
];

const getNonHttpsOrigin = (url: string | undefined): string[] => {
    if (!url) return [];
    try {
        const { origin, protocol } = new URL(url);
        // https:/wss: origins are already covered by connect-src
        return protocol === "https:" ? [] : [origin];
    } catch {
        return [];
    }
};

export const buildCsp = (apiBaseUrl?: string): string => {
    const directives: Record<string, string[]> = {
        "default-src": ["'self'"],
        "script-src": ["'self'", ...SCRIPT_HOSTS],
        "style-src": [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
            "https://accounts.google.com/gsi/style",
        ],
        "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
        "img-src": ["'self'", "data:", "blob:", "https:"],
        "media-src": ["'self'", "data:", "blob:", "https:"],
        // a local build may point at an http:// API (e.g. localhost)
        "connect-src": [
            "'self'",
            "https:",
            "wss:",
            ...getNonHttpsOrigin(apiBaseUrl),
        ],
        "frame-src": ["'self'", "https:"],
        "worker-src": ["'self'", "blob:"],
        "manifest-src": ["'self'"],
        "object-src": ["'none'"],
        "base-uri": ["'self'"],
        "form-action": ["'self'"],
    };
    return Object.entries(directives)
        .map(([name, values]) => `${name} ${values.join(" ")}`)
        .join("; ");
};

const CHARSET_META = /<meta charset="utf-8"\s*\/?>/i;

/**
 * Injects the CSP right after `<meta charset>` in production builds only.
 * It must come before any `<script>`, since a `<meta>` CSP only applies to
 * content parsed after it, but after the charset, which browsers expect in
 * the first 1024 bytes. The dev server relies on inline scripts and a `ws:`
 * HMR socket, which this policy would block.
 *
 * Fails the build if the charset tag is missing, rather than silently
 * shipping without a CSP.
 */
export const cspPlugin = (apiBaseUrl?: string): Plugin => ({
    name: "alphaday-csp",
    apply: "build",
    transformIndexHtml: (html) => {
        if (!CHARSET_META.test(html)) {
            throw new Error(
                'alphaday-csp: <meta charset="utf-8"> not found in index.html; cannot inject the CSP'
            );
        }
        const meta = `<meta http-equiv="Content-Security-Policy" content="${buildCsp(
            apiBaseUrl
        )}" />`;
        return html.replace(
            CHARSET_META,
            (charset) => `${charset}\n    ${meta}`
        );
    },
});
