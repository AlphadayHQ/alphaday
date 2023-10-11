import { EItemFeedPreference } from "src/api/types";
import { ETemplateNameRegistry } from "src/constants";

const DEFAULT_WIDGET_HEIGHT = 500;

const WIDGETS_CONFIG = {
    COMMON: {
        HEADER_HEIGHT: 42,
        DEFAULT_WIDGET_HEIGHT,
    },
    [ETemplateNameRegistry.Calendar]: {
        TAG_ITEM_TYPE: "event",
        QUERY_EVENTS_HARD_LIMIT: 200,
        WIDGET_HEIGHT: 604, // gotten from cal-month
        POLLING_INTERVAL: 180 * 60, // 3h
        ADJUSTABLE: true,
    },
    [ETemplateNameRegistry.Chat]: {
        WIDGET_HEIGHT: 600,
        ADJUSTABLE: true,
    },
    [ETemplateNameRegistry.Dao]: {
        TAG_ITEM_TYPE: "dao",
        MAX_PAGE_NUMBER: 10,
        WIDGET_HEIGHT: 538,
        POLLING_INTERVAL: 15 * 60, // 15 min
        ADJUSTABLE: true,
    },
    [ETemplateNameRegistry.Forum]: {
        TAG_ITEM_TYPE: "forum",
        MAX_PAGE_NUMBER: 10,
        WIDGET_HEIGHT: 538,
        POLLING_INTERVAL: 15 * 60, // 15 min
        ADJUSTABLE: true,
    },
    [ETemplateNameRegistry.FAQ]: {
        WIDGET_HEIGHT: 550,
        ADJUSTABLE: true,
    },
    [ETemplateNameRegistry.Lens]: {
        WIDGET_HEIGHT: 570,
        ADJUSTABLE: true,
    },
    [ETemplateNameRegistry.Market]: {
        TAG_ITEM_TYPE: "coin",
        DEFAULT_INTERVAL: "1D",
        DEFAULT_MARKET: {
            id: 1,
            name: "Ethereum",
            slug: "ethereum",
            ticker: "eth",
            icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
        },
        QUERY_HARD_LIMIT: 30,
        COIN_POLLING_INTERVAL: 60, // 1 min
        HISTORY_POLLING_INTERVAL: 5 * 60, // 5 min
        ADJUSTABLE: false,
        WIDGET_HEIGHT: 550,
    },
    [ETemplateNameRegistry.Media]: {
        YOUTUBE_EMBED_BASE_URL: "//www.youtube.com/embed/",
        ADJUSTABLE: false,
        WIDGET_HEIGHT: DEFAULT_WIDGET_HEIGHT,
    },
    [ETemplateNameRegistry.LatestVideo]: {
        ADJUSTABLE: false,
        WIDGET_HEIGHT: DEFAULT_WIDGET_HEIGHT,
    },
    [ETemplateNameRegistry.Network]: {
        POLLING_INTERVAL: 30, // 30 sec
        ADJUSTABLE: false,
        WIDGET_HEIGHT: DEFAULT_WIDGET_HEIGHT,
    },
    [ETemplateNameRegistry.Gas]: {
        ADJUSTABLE: false,
        WIDGET_HEIGHT: DEFAULT_WIDGET_HEIGHT,
    },
    [ETemplateNameRegistry.News]: {
        TAG_ITEM_TYPE: "news",
        MAX_PAGE_NUMBER: 10,
        POLLING_INTERVAL: 8 * 60, // 8 min
        WIDGET_HEIGHT: 538,
        DEFAULT_FEED_PREFERENCE: EItemFeedPreference.Last,
        ADJUSTABLE: true,
    },
    [ETemplateNameRegistry.Blog]: {
        TAG_ITEM_TYPE: "blog",
        MAX_PAGE_NUMBER: 10,
        POLLING_INTERVAL: 8 * 60, // 8 min
        WIDGET_HEIGHT: 538,
        DEFAULT_FEED_PREFERENCE: EItemFeedPreference.Last,
        ADJUSTABLE: true,
    },
    [ETemplateNameRegistry.Podcast]: {
        WIDGET_HEIGHT: 650,
        MAX_PAGE_NUMBER: 20,
        POLLING_INTERVAL: 6 * 60 * 60, // 6h
        DEFAULT_FEED_PREFERENCE: EItemFeedPreference.Last,
        ADJUSTABLE: false,
    },
    [ETemplateNameRegistry.Portfolio]: {
        DONUT_TOKENS_COUNT: 5,
        POLLING_INTERVAL: 5 * 60, // 5 min
        WIDGET_HEIGHT: 500,
        SMALL_PRICE_CUTOFF_LG: 8, // display a max. of 8 digits for small numbers like $0.0000012
        SMALL_PRICE_CUTOFF_SM: 6, // display a max. of 8 digits for small numbers like $0.0000012
        ADJUSTABLE: true,
    },
    [ETemplateNameRegistry.Reddit]: {
        TAG_ITEM_TYPE: "reddit",
        MAX_PAGE_NUMBER: 10,
        WIDGET_HEIGHT: 538,
        POLLING_INTERVAL: 15 * 60, // 15 min
        ADJUSTABLE: true,
    },
    [ETemplateNameRegistry.Reports]: {
        WIDGET_HEIGHT: DEFAULT_WIDGET_HEIGHT,
        ADJUSTABLE: true,
    },
    [ETemplateNameRegistry.Roadmap]: {
        WIDGET_HEIGHT: DEFAULT_WIDGET_HEIGHT,
        ADJUSTABLE: true,
    },
    [ETemplateNameRegistry.Summary]: {
        WIDGET_HEIGHT: 250,
        ADJUSTABLE: false,
    },
    [ETemplateNameRegistry.Table]: {
        MAX_PAGE_NUMBER: 10,
        WIDGET_HEIGHT: 400,
        ADJUSTABLE: true,
    },
    [ETemplateNameRegistry.CustomTable]: {
        MAX_PAGE_NUMBER: 10,
        WIDGET_HEIGHT: 400,
        ADJUSTABLE: true,
    },
    [ETemplateNameRegistry.Twitter]: {
        WIDGET_HEIGHT: 570,
        ADJUSTABLE: true,
    },
    [ETemplateNameRegistry.TwitterList]: {
        WIDGET_HEIGHT: 570,
        ADJUSTABLE: true,
    },
    [ETemplateNameRegistry.Tvl]: {
        TAG_ITEM_TYPE: "project",
        POLLING_INTERVAL: 180, // 3 min
        WIDGET_HEIGHT: 253,
        MAX_PAGE_NUMBER: 10,
        ADJUSTABLE: true,
    },
    [ETemplateNameRegistry.Video]: {
        WIDGET_HEIGHT: 650,
        MAX_PAGE_NUMBER: 20,
        POLLING_INTERVAL: 6 * 60 * 60, // 6h
        DEFAULT_FEED_PREFERENCE: EItemFeedPreference.Last,
        ADJUSTABLE: false,
    },
    [ETemplateNameRegistry.Polls]: {
        ADJUSTABLE: false,
        WIDGET_HEIGHT: DEFAULT_WIDGET_HEIGHT,
    },
    [ETemplateNameRegistry.Countdown]: {
        ADJUSTABLE: true,
        WIDGET_HEIGHT: DEFAULT_WIDGET_HEIGHT,
    },
    [ETemplateNameRegistry.Talks]: {
        ADJUSTABLE: false,
        WIDGET_HEIGHT: DEFAULT_WIDGET_HEIGHT,
    },
    [ETemplateNameRegistry.VenueMap]: {
        ADJUSTABLE: false,
        WIDGET_HEIGHT: DEFAULT_WIDGET_HEIGHT,
    },
    [ETemplateNameRegistry.Map]: {
        ADJUSTABLE: false,
        WIDGET_HEIGHT: DEFAULT_WIDGET_HEIGHT,
    },
    [ETemplateNameRegistry.PieChart]: {
        ADJUSTABLE: false,
        WIDGET_HEIGHT: DEFAULT_WIDGET_HEIGHT,
    },
    [ETemplateNameRegistry.Uniswap]: {
        ADJUSTABLE: false,
        WIDGET_HEIGHT: DEFAULT_WIDGET_HEIGHT,
    },
    [ETemplateNameRegistry.Discord]: {
        POLLING_INTERVAL: 15 * 60,
        MAX_PAGE_NUMBER: 10,
        WIDGET_HEIGHT: 600,
        ADJUSTABLE: true,
    },
} as const;

export default WIDGETS_CONFIG;
