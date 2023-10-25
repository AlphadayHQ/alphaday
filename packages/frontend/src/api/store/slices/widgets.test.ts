import "src/mocks/libraryMocks";
import { EItemFeedPreference } from "src/api/types";
import { ECalendarType } from "src/components/calendar/types";
import { EChartType } from "src/components/market/types";
import { RootState } from "../store";
import widgetsReducer, {
    IWidgetsState,
    removeWidgetStateFromCache,
    setBlogFeedPreference,
    selectBlogFeedPreference,
    selectIsMinimised,
    selectNewsFeedPreference,
    selectPodcastFeedPreference,
    selectPodcastPreferredChannelIds,
    selectSelectedCalendarType,
    selectSelectedChartType,
    selectSelectedDate,
    selectShowAllAssets,
    selectVideoFeedPreference,
    selectVideoPreferredChannelIds,
    selectWidgetHeight,
    setEventFilters,
    setNewsFeedPreference,
    setPodcastFeedPreference,
    setPodcastPreferredChannelIds,
    setSelectedCalendarType,
    setSelectedChartRange,
    setSelectedChartType,
    setSelectedDate,
    setSelectedMarket,
    setVideoFeedPreference,
    setVideoPreferredChannelIds,
    setWidgetHeight,
    toggleShowAllAssets,
    toggleCollapse,
    selectTvlProjectType,
    setSelectedTvlProjectType,
} from "./widgets";

let initialState: IWidgetsState;
let rootState: RootState;

const widgetHash = "widgetHash";
const tvlWidgetHash = "tvl-widget-hash";

beforeEach(() => {
    initialState = {
        common: {
            [widgetHash]: {
                isMinimised: true,
                widgetHeight: 500,
            },
            [tvlWidgetHash]: {
                isMinimised: false,
                widgetHeight: 500,
            },
        },
        market: {
            [widgetHash]: {
                selectedChartRange: "1M",
                selectedMarket: undefined,
                selectedChartType: undefined,
            },
        },
        news: {},
        portfolio: {},
        calendar: {},
        podcast: {},
        video: {},
        blog: {},
        tvl: {
            [tvlWidgetHash]: {
                selectedProjectType: "chain",
            },
        },
    };

    rootState = {
        widgets: initialState,
    } as RootState;
});

describe("removeWidgetStateFromCache", () => {
    it("should remove widget state from cache", () => {
        expect(initialState.common[widgetHash]).toBeDefined();

        const action = removeWidgetStateFromCache({ widgetHash });
        const state = widgetsReducer(initialState, action);

        expect(state.common[widgetHash]).toBeUndefined();
    });
});

describe("selectIsMinimised", () => {
    it("should return isMinimised", () => {
        const isMinimisedSelector = selectIsMinimised(widgetHash);
        const isMinimised = isMinimisedSelector(rootState);
        expect(isMinimised).toBe(true);
    });
});

describe("toggleCollapse", () => {
    it("should toggle isMinimised", () => {
        const action = toggleCollapse({ widgetHash });
        const state = widgetsReducer(initialState, action);
        const isMinimisedSelector = selectIsMinimised(widgetHash);

        const isMinimised = isMinimisedSelector({
            ...rootState,
            widgets: state,
        });
        expect(isMinimised).toBe(false);
    });
});

describe("newsFeedPreference", () => {
    const newsFeedPreference = EItemFeedPreference.Last;
    const newsFeedPreferenceSelector = selectNewsFeedPreference(widgetHash);

    it("should select the news feed preference", () => {
        const selectedNewsFeedPreference =
            newsFeedPreferenceSelector(rootState);
        expect(selectedNewsFeedPreference).toBeUndefined();
    });

    it("should set the news feed preference", () => {
        const action = setNewsFeedPreference({
            widgetHash,
            preference: newsFeedPreference,
        });
        const state = widgetsReducer(initialState, action);

        const selectedNewsFeedPreference = newsFeedPreferenceSelector({
            ...rootState,
            widgets: state,
        });

        expect(selectedNewsFeedPreference).toEqual(newsFeedPreference);
    });
});

describe("blogFeedPreference", () => {
    const blogFeedPreference = EItemFeedPreference.Last;
    const blogFeedPreferenceSelector = selectBlogFeedPreference(widgetHash);

    it("should set the blog feed preference", () => {
        const action = setBlogFeedPreference({
            widgetHash,
            preference: blogFeedPreference,
        });
        const state = widgetsReducer(initialState, action);
        const selectedBlogFeedPreference = blogFeedPreferenceSelector({
            ...rootState,
            widgets: state,
        });

        expect(selectedBlogFeedPreference).toEqual(blogFeedPreference);
    });
});

describe("selectPodcastFeedPreference", () => {
    const podcastFeedPreference = EItemFeedPreference.Last;
    const podcastFeedPreferenceSelector =
        selectPodcastFeedPreference(widgetHash);

    it("should select the podcast feed preference", () => {
        const selectedPodcastFeedPreference =
            podcastFeedPreferenceSelector(rootState);
        expect(selectedPodcastFeedPreference).toBeUndefined();
    });

    it("should set the podcast feed preference", () => {
        const action = setPodcastFeedPreference({
            widgetHash,
            preference: podcastFeedPreference,
        });
        const state = widgetsReducer(initialState, action);

        const selectedPodcastFeedPreference = podcastFeedPreferenceSelector({
            ...rootState,
            widgets: state,
        });

        expect(selectedPodcastFeedPreference).toEqual(podcastFeedPreference);
    });
});

describe("videoFeedPreference", () => {
    const videoFeedPreference = EItemFeedPreference.Last;
    const videoFeedPreferenceSelector = selectVideoFeedPreference(widgetHash);

    it("should select the video feed preference", () => {
        const selectedVideoFeedPreference =
            videoFeedPreferenceSelector(rootState);
        expect(selectedVideoFeedPreference).toBeUndefined();
    });

    it("should set the video feed preference", () => {
        const action = setVideoFeedPreference({
            widgetHash,
            preference: videoFeedPreference,
        });
        const state = widgetsReducer(initialState, action);

        const selectedVideoFeedPreference = videoFeedPreferenceSelector({
            ...rootState,
            widgets: state,
        });

        expect(selectedVideoFeedPreference).toEqual(videoFeedPreference);
    });
});

describe("setSelectedMarket", () => {
    const marketMeta = {
        id: 1,
        name: "market",
        slug: "mrt",
        ticker: "MRT",
    };

    it("should set the selectedMarket", () => {
        expect(initialState.market[widgetHash]).not.toBe(undefined);
        expect(initialState.market[widgetHash].selectedMarket).toBeUndefined();

        const action = setSelectedMarket({ market: marketMeta, widgetHash });
        const state = widgetsReducer(initialState, action);

        expect(state.market[widgetHash].selectedMarket).toEqual(marketMeta);
    });
});

describe("selectedCalendarType", () => {
    const selectedCalendarType = ECalendarType.Month;
    const selectedCalendarTypeSelector = selectSelectedCalendarType(widgetHash);

    it("should select the selected calendar type", () => {
        const selected = selectedCalendarTypeSelector(rootState);
        expect(selected).toBeUndefined();
    });

    it("should set the selected calendar type", () => {
        const action = setSelectedCalendarType({
            widgetHash,
            calType: selectedCalendarType,
        });
        const state = widgetsReducer(initialState, action);

        const selected = selectedCalendarTypeSelector({
            ...rootState,
            widgets: state,
        });

        expect(selected).toEqual(selectedCalendarType);
    });
});

describe("selectedChartType", () => {
    const selectedChartType = EChartType.Line;
    const selectedChartTypeSelector = selectSelectedChartType(widgetHash);

    it("should select the selected chart type", () => {
        const selected = selectedChartTypeSelector(rootState);
        expect(selected).toBeUndefined();
    });

    it("should set the selected chart type", () => {
        const action = setSelectedChartType({
            widgetHash,
            chartType: selectedChartType,
        });
        const state = widgetsReducer(initialState, action);

        const selected = selectedChartTypeSelector({
            ...rootState,
            widgets: state,
        });

        expect(selected).toEqual(selectedChartType);
    });
});

describe("selectedDate", () => {
    const selectedDate = new Date();
    const selectedDateSelector = selectSelectedDate(widgetHash);

    it("should select the selected date", () => {
        const selected = selectedDateSelector(rootState);
        expect(selected).toBeUndefined();
    });

    it("should set the selected date", () => {
        const action = setSelectedDate({
            widgetHash,
            date: selectedDate.toISOString(),
        });
        const state = widgetsReducer(initialState, action);

        const selected = selectedDateSelector({
            ...rootState,
            widgets: state,
        });

        expect(selected).toEqual(selectedDate.toISOString());
    });
});

describe("showAllAssets", () => {
    const showAllAssetsSelector = selectShowAllAssets(widgetHash);

    it("should select showAllAssets", () => {
        const showAllAssets = showAllAssetsSelector(rootState);
        expect(showAllAssets).toBe(false);
    });

    it("should toggle showAllAssets", () => {
        const action = toggleShowAllAssets({ widgetHash });
        const state = widgetsReducer(initialState, action);

        const showAllAssets = showAllAssetsSelector({
            ...rootState,
            widgets: state,
        });

        expect(showAllAssets).toBe(true);
    });
});

describe("widgetHeight", () => {
    const widgetHeight = 500;
    const widgetHeightSelector = selectWidgetHeight(widgetHash);

    it("should select the widget height", () => {
        const selectedWidgetHeight = widgetHeightSelector(rootState);
        expect(selectedWidgetHeight).toBe(500);
    });

    it("should set the widget height", () => {
        const action = setWidgetHeight({
            widgetHash,
            widgetHeight,
        });
        const state = widgetsReducer(initialState, action);

        const selectedWidgetHeight = widgetHeightSelector({
            ...rootState,
            widgets: state,
        });

        expect(selectedWidgetHeight).toEqual(widgetHeight);
    });
});

describe("setEventFilters", () => {
    const eventFilters = [
        {
            value: "bitcoin",
            label: "Bitcoin",
            category: "coin",
            color: "#f7931a",
        },
    ];

    it("should set the event filters", () => {
        expect(initialState.calendar.eventFilters).toBeUndefined();

        const action = setEventFilters({
            widgetHash,
            filters: eventFilters,
        });
        const state = widgetsReducer(initialState, action);

        expect(state.calendar[widgetHash].eventFilters).toEqual(eventFilters);
    });
});

describe("setPodcastPreferredChannelIds", () => {
    const podcastPreferredChannelIds = [1, 2, 3];

    const preferredChannelIdsSelector =
        selectPodcastPreferredChannelIds(widgetHash);

    it("should select the podcast channels", () => {
        const selectedPodcastPreferredChannelIds =
            preferredChannelIdsSelector(rootState);
        expect(selectedPodcastPreferredChannelIds).toBeUndefined();
    });

    it("should set the podcast preferred channel ids", () => {
        const action = setPodcastPreferredChannelIds({
            widgetHash,
            preference: podcastPreferredChannelIds,
        });
        const state = widgetsReducer(initialState, action);
        const selectedPodcastPreferredChannelIds = preferredChannelIdsSelector({
            ...rootState,
            widgets: state,
        });

        expect(selectedPodcastPreferredChannelIds).toEqual(
            podcastPreferredChannelIds
        );
    });
});

describe("setVideoPreferredChannelIds", () => {
    const videoPreferredChannelIds = [1, 2, 3];
    const videoPreferredChannelIdsSelector =
        selectVideoPreferredChannelIds(widgetHash);

    it("should select the video preferred channel ids", () => {
        const selectedVideoPreferredChannelIds =
            videoPreferredChannelIdsSelector(rootState);
        expect(selectedVideoPreferredChannelIds).toBeUndefined();
    });

    it("should set the video preferred channel ids", () => {
        const action = setVideoPreferredChannelIds({
            widgetHash,
            preference: videoPreferredChannelIds,
        });
        const state = widgetsReducer(initialState, action);

        const selectedVideoPreferredChannelIds =
            videoPreferredChannelIdsSelector({
                ...rootState,
                widgets: state,
            });

        expect(selectedVideoPreferredChannelIds).toEqual(
            videoPreferredChannelIds
        );
    });
});

describe("setSelectedChartRange", () => {
    const chartRange = "1D";

    it("should set the selected chart range", () => {
        expect(initialState.market[widgetHash].selectedChartRange).toBe("1M");

        const action = setSelectedChartRange({
            widgetHash,
            chartRange,
        });
        const state = widgetsReducer(initialState, action);

        expect(state.market[widgetHash].selectedChartRange).toEqual(chartRange);
    });
});

describe("selectedTvlProjectType", () => {
    const selectedProjectTypeSelector = selectTvlProjectType(tvlWidgetHash);

    it("should select the selected tvl project type", () => {
        const selectedTvlProjectType = selectedProjectTypeSelector(rootState);
        expect(selectedTvlProjectType).toBe("chain");
    });

    it("should set the selected project type", () => {
        const action = setSelectedTvlProjectType({
            widgetHash: tvlWidgetHash,
            projectType: "protocol",
        });
        const state = widgetsReducer(initialState, action);

        const newSelectedProjectType = selectedProjectTypeSelector({
            ...rootState,
            widgets: state,
        });

        expect(newSelectedProjectType).toEqual("protocol");
    });
});
