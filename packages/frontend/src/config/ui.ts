import { ETemplateNameRegistry } from "src/constants";

// keep z-index values in ascending order here
const Z_INDEX_REGISTRY = {
    AUDIO_PLAYER_DETAILS: 1,
    AUDIO_PLAYER_WRAP: 10,
    TOOLTIP_WRAPPER: 1,
    CALENDAR_LIST: 1,
    CALENDAR_LIST_HEADER: 1,
    CALENDAR_LIST_SWITCH: 2,
    CALENDAR_EVENT_DETAILS: 2,
    SWITCH: 2,
    PORTFOLIO_ERROR_MSG: 2,
    CALENDAR_FILTER_TOGGLE: 2,
    HEADER_MENU: 9,
    MODULE_LOADER: 4, // widget loading spinner
    CALENDAR_TOOLBAR_BUTTON: 5,
    SCROLLBAR: 8,
    DRAGGABLE: 9,
    DRAGGING: 10,
    HEADER: 10,
    CALENDAR_EVENTS_TOOLTIP: 50,
    CALENDAR_EVENTS_TOOLTIP_FULLSIZE: 1050,
    PRELOADER: 99,
    CAROUSEL: 100,
    DATE_PICKER: 9_999,
    TOAST_CONTAINER: 9_999,
    ERROR_MODAL: 10_000,
    OVERLAY: 10_000,
    TUTORIAL_MODAL: 10_000,
    MOBILE_BOARDS_DRAWER: 1060,
    PODCAST_LIST: 1,
    VIDEO_LIST: 1,
    CHANNEL_IMAGE: 1,
    CHANNEL_PAN: 2,
    WIDGET_LIBRARY_DELETE: 999,
    PIE_CHART_TOOLTIP: 10,
};

const UI_CONFIG = {
    WIDGET_SIZE_TRACKING_ID: "widget-size-tracking-id", // ID to get size of one widget
    FULL_SIZE_WIDGET_SLUG: "calendar_template",
    SMALL_NUM_DECIMAL_PLACES: 4, // typically for n < 1
    BASE_DECIMAL_PLACES: 2,
    PERCENTAGE_DECIMAL_PLACES: 2,
    ETH_DECIMAL_PLACES: 6,
    USD_DECIMAL_PLACES: 2,
    SKELETON_VIEW: [
        [ETemplateNameRegistry.News, ETemplateNameRegistry.Twitter],
        [
            ETemplateNameRegistry.Portfolio,
            ETemplateNameRegistry.Market,
            ETemplateNameRegistry.Tvl,
            ETemplateNameRegistry.Gas,
        ],
        [ETemplateNameRegistry.Calendar, ETemplateNameRegistry.Dao],
        [ETemplateNameRegistry.Dao, ETemplateNameRegistry.Twitter],
    ],
    NEW_WIDGET_IDENTIFIER: "-wlib", // suffix to identify widgets from the widget library
    /**
     * total time duration in milliseconds for toasts
     * to be animated in & out and displayed to the user
     */
    TOAST_DURATION: 8000,
    Z_INDEX_REGISTRY,
    TUTORIAL_DELAY: 5000, // delay time after load to show tutorial
    QUERY_KEYWORDS_HARD_LIMIT: 8,
    BOARD_LIBRARY: {
        LIMIT: 25,
        MAX_SUBSCRIPTIONS: 15,
        MAX_PAGE_NUMBER: 10,
    },
    WIDGETS_LIBRARY: {
        LIMIT: 25,
        MAX_PAGE_NUMBER: 10,
    },
};

export default UI_CONFIG;
