export enum EWidgetSettingsRegistry {
    IncludedTags = "included_tags_setting",
    PinnedCoins = "pinned_coins_setting",
    // ...add other settings here
}

/**
 * **EWidgetNameRegistry**
 *
 * Features may be toggled on/off by the backend.
 * The toggling may be of 4 types:
 */
export enum EFeatureStatus {
    /** this feature is disabled for all */
    Disabled,
    /** this feature is enabled for select authenticated users */
    Restricted,
    /** this feature is enabled for all authenticated users */
    Protected,
    /** this feature is enabled for all */
    Enabled,
}

/**
 * **EFeaturesRegistry**
 *
 * Specific features differ from Widgets in that they are not filtered by backend.
 * As such, they are included in this registry and whether or not they are enabled is determined by the backend.
 */
export enum EFeaturesRegistry {
    WalletConnect = "wallet_connect",
    TrendingKeywords = "trending_keywords",
    WalletBoard = "wallet_board",
    Notifications = "notification",
    MobileApp = "mobile_app",
    TranslationFr = "translation_fr",
    TranslationEs = "translation_es",
    TranslationTr = "translation_tr",
    TranslationJa = "translation_ja",
    TranslationZh = "translation_zh",
}

/**
 * **ETemplateNameRegistry**
 *
 * Templates are the backbone of widgets.
 * Every Alphaday widget is built with a corresponding template.
 * As such templates are almost always 1:1 with widgets.
 * Depending on the toggle on the backend, a widget may or may not be available to the user.
 */
export enum ETemplateNameRegistry {
    AlphaGpt = "ALPHAGPT",
    Blog = "BLOG",
    Calendar = "CALENDAR",
    Chat = "CHAT",
    Countdown = "COUNTDOWN",
    CustomCard = "CUSTOM_CARD",
    CustomChart = "CUSTOM_CHART",
    CustomTable = "CUSTOM_TABLE",
    Dao = "DAO",
    Discord = "DISCORD",
    FAQ = "FAQ",
    Forum = "FORUM",
    Gas = "GAS",
    Kasandra = "KASANDRA",
    LatestVideo = "LATEST_VIDEO",
    Lens = "LENS",
    Map = "MAP",
    Market = "MARKET",
    Media = "MEDIA",
    Network = "NETWORK",
    News = "NEWS",
    PieChart = "PIE_CHART",
    Podcast = "PODCAST",
    Polls = "POLLS",
    Portfolio = "PORTFOLIO",
    Reddit = "REDDIT",
    Reports = "REPORTS",
    Roadmap = "ROADMAP",
    Summary = "SUMMARY",
    Table = "TABLE",
    Talks = "TALKS",
    Tvl = "TVL",
    Twitter = "TWITTER",
    TwitterList = "TWITTER_LIST",
    Uniswap = "UNISWAP",
    VenueMap = "VENUE",
    VerasityTokenomics = "VERASITY_TOKENOMICS",
    Video = "VIDEO",
}
