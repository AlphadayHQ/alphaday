/**
 * Guidelines to define API routes
 * - Endpoints' route objects should in general include a base route that
 * doesn't start nor end in `/`.
 * - OTOH, specific endpoints should start and finish with `/`
 * - When we only need to use `BASE/` we may just use a `DEFAULT = "/"`, eg.
 * `${String(MARKET.BASE)}${String(MARKET.DEFAULT)}?${params}`
 */

const API_V0 = {
    IS_PROD: true,
    DEFAULT_PARAMS: {
        RESPONSE_LIMIT: 20,
    },
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    ROUTES: {
        ACTIVITY_LOG: {
            BASE: "activity_log",
            DEFAULT: "/",
        },
        NEWS: {
            BASE: "items/news",
            TRENDING: "/trending/",
            SUMMARY: "/summary/",
            LIST: "/",
            BOOKMARKS: "/bookmarks/",
            CLICKED: (id: number): string => `/${id}/clicked/`,
            BOOKMARK: (id: number): string => `/${id}/toggle_bookmark/`,
        },
        BLOG: {
            BASE: "items/blogs",
            TRENDING: "/trending/",
            LIST: "/",
            BOOKMARKS: "/bookmarks/",
            CLICKED: (id: number): string => `/${id}/clicked/`,
            BOOKMARK: (id: number): string => `/${id}/toggle_bookmark/`,
        },
        COINS: {
            BASE: "coins",
            LIST: "/",
            PINNED: "/pinned_coins/",
            PIN: (id: number): string => `/${id}/toggle_pin/`,
        },
        DAO: {
            BASE: "items/dao",
            LIST: "/",
        },
        FORUM: {
            BASE: "items/forum",
            LIST: "/",
        },
        KEYWORDS: {
            BASE: "keywords",
            LIST: "/",
            TRENDING: "/trending/",
            FREQUENCY: "/frequency/",
            BY_ID: (id: number): string => `/${id}/`,
        },
        KEY_VALUE: {
            BASE: "key_value_store",
            STORE: {
                ETHEREUM_LAST_BLOCK: "ETHEREUM_LAST_BLOCK",
            },
        },
        LLM: {
            BASE: "llm",
            QNA: "/",
        },
        TAGS: {
            BASE: "tags",
            LIST: "/",
            BY_ID: (id: number): string => `/${id}/`,
        },
        EVENT: {
            BASE: "items/events",
            LIST: "/",
        },
        USER: {
            BASE: "user",
            LOGIN: "/auth/login/",
            LOGOUT: "/logout/",
            ACCOUNTS: "/accounts/",
            MULTI_ACCOUNTS: "/accounts/bulk_create/",
            ACCOUNT_BY_ID: (id: string): string => `accounts/${id}/`,
            CONNECT_WALLET: "/connect/",
            SEND_ADDRESS: "user/accounts/",
            GENERATE_MESSAGE: "/message/generate/",
            VERIFY_SIGNATURE: "/signature/verify/",
            PROFILE: "/profile/",
        },
        PROJECTS: {
            BASE: "projects",
            LIST: "/",
            BY_ID: (id: number): string => `/${id}/`,
            TRENDING_NFTS: "/nft/trending/",
        },
        MARKET: {
            BASE: "market",
            DEFAULT: "/",
            HISTORY: "/history/",
            BY_ID: (id: number): string => `/${id}/`,
        },
        STATUS: {
            BASE: "status",
            DEFAULT: "/",
        },
        SOCIALS: {
            BASE: "items/socials",
            DISCORD: "discord",
            LENS: "lens",
            REDDIT: "reddit",
            TWITTER: "twitter",
            TWITTER_V1: "/tweets/",
        },
        TVL: {
            BASE: "tvl",
            DEFAULT: "/",
            HISTORY: "/history/",
        },
        VIEWS: {
            BASE: "ui",
            AVAILABLE_VIEWS: "/views/",
            SUBSCRIBED_VIEWS: "/views/subscriptions/",
            VIEWS_CATEGORIES: "/views/categories/",
            VIEW_BY_ID: (id: number): string => `/views/${id}/`,
            SUBSCRIBE: (id: number): string => `/views/${id}/subscribe/`,
            UNSUBSCRIBE: (id: number): string => `/views/${id}/unsubscribe/`,
            RESOLVE: "/views/resolve/",
            WIDGETS: "/widgets/",
            VIEW_WIDGETS_BY_ID: (id: number): string => `/views/${id}/widgets/`,
            WIDGET_BY_ID: (id: number): string => `/widgets/${id}/`,
            WIDGET_CATEGORIES: "/widget_categories/",
            WALLET_VIEW: "/views/smart_board/",
        },
        PORTFOLIO: {
            BASE: "portfolio",
            BALANCES: "/data/",
            RESOLVE_ENS: (ens: string): string => `/resolve_ens/${ens}/`,
        },
        PODCAST: {
            BASE: "items/podcasts",
            TRENDING: "/trending/",
            LIST: "/",
            BOOKMARKS: "/bookmarks/",
            DETAILS: (id: number): string => `/${id}/`,
            CLICKED: (id: number): string => `/${id}/clicked/`,
            BOOKMARK: (id: number): string => `/${id}/toggle_bookmark/`,
        },
        VIDEO: {
            BASE: "items/videos",
            TRENDING: "/trending/",
            LIST: "/",
            LATEST: "/latest/",
            BOOKMARKS: "/bookmarks/",
            DETAILS: (id: number): string => `/${id}/`,
            CLICKED: (id: number): string => `/${id}/clicked/`,
            BOOKMARK: (id: number): string => `/${id}/toggle_bookmark/`,
        },
        SOURCES: {
            BASE: "/sources/",
            PODCAST: "?harvestor=podcast",
            VIDEO: "?harvestor=video",
        },
        NOTIFICATIONS: {
            BASE: "notifications/devices/fcm",
            DEVICE_BY_ID: (id: number): string => `/${id}/`,
        },
        FEATURES: {
            BASE: "features",
            LIST: "/allowed/",
        },
    },
};

// we might have different API versions running on prod concurrently in the future
export default {
    V0: API_V0,
    // V1: ...,
    DEFAULT: API_V0,
};
