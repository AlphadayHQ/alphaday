import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TChartRange, EItemFeedPreference, TProjectType } from "src/api/types";
import { ECalendarType } from "src/components/calendar/types";
import { EChartType, TMarketMeta } from "src/components/market/types";
import { TEventCategory } from "src/components/types";
import type { RootState } from "../store";

export interface ICommonWidgetState {
    isMinimised: boolean;
    widgetHeight: number | undefined;
}

export interface IMarketWidgetState {
    selectedMarket: TMarketMeta | undefined;
    selectedChartRange: TChartRange | undefined;
    selectedChartType: EChartType | undefined;
}

export interface IPortfolioWidgetState {
    showAllAssets: boolean;
}

export interface ICalendarWidgetState {
    selectedDate: string | undefined;
    eventFilters: TEventCategory[] | undefined;
    selectedCalendarType: ECalendarType | undefined;
}

export interface INewsWidgetState {
    feedPreference: EItemFeedPreference;
}
export interface IBlogWidgetState {
    feedPreference: EItemFeedPreference;
}
export interface IKasandraWidgetState {
    feedPreference: EItemFeedPreference;
}
export interface IPodcastsWidgetState {
    feedPreference: EItemFeedPreference;
    preferredChannelIds: number[];
}
export interface IVideosWidgetState {
    feedPreference: EItemFeedPreference;
    preferredChannelIds: number[];
}

export interface ITvlWidgetState {
    selectedProjectType: TProjectType;
}

export interface IWidgetsState {
    common: Record<string, ICommonWidgetState>;
    market: Record<string, IMarketWidgetState>;
    news: Record<string, INewsWidgetState>;
    blog: Record<string, IBlogWidgetState>;
    portfolio: Record<string, IPortfolioWidgetState>;
    calendar: Record<string, ICalendarWidgetState>;
    podcast: Record<string, IPodcastsWidgetState>;
    video: Record<string, IVideosWidgetState>;
    tvl: Record<string, ITvlWidgetState>;
    kasandra: Record<string, IKasandraWidgetState>;
}

const initialState: IWidgetsState = {
    common: {},
    market: {},
    news: {},
    portfolio: {},
    calendar: {},
    podcast: {},
    video: {},
    blog: {},
    tvl: {},
    kasandra: {},
};

const widgetsSlice = createSlice({
    name: "widgets",
    initialState,
    reducers: {
        setSelectedMarket(
            draft,
            action: PayloadAction<{
                widgetHash: string;
                market: TMarketMeta | undefined;
            }>
        ) {
            const {
                payload: { widgetHash, market },
            } = action;

            draft.market = {
                ...draft.market,
                [widgetHash]: {
                    ...(draft?.market?.[widgetHash] || {}),
                    selectedMarket: market,
                },
            };
        },
        setNewsFeedPreference(
            draft,
            action: PayloadAction<{
                widgetHash: string;
                preference: EItemFeedPreference;
            }>
        ) {
            const {
                payload: { widgetHash, preference },
            } = action;
            draft.news[widgetHash] = {
                ...draft.news[widgetHash],
                feedPreference: preference,
            };
        },
        setBlogFeedPreference(
            draft,
            action: PayloadAction<{
                widgetHash: string;
                preference: EItemFeedPreference;
            }>
        ) {
            const {
                payload: { widgetHash, preference },
            } = action;
            draft.blog[widgetHash] = {
                ...draft.blog[widgetHash],
                feedPreference: preference,
            };
        },
        setKasandraFeedPreference(
            draft,
            action: PayloadAction<{
                widgetHash: string;
                preference: EItemFeedPreference;
            }>
        ) {
            const {
                payload: { widgetHash, preference },
            } = action;
            draft.kasandra[widgetHash] = {
                ...draft.kasandra[widgetHash],
                feedPreference: preference,
            };
        },
        setPodcastFeedPreference(
            draft,
            action: PayloadAction<{
                widgetHash: string;
                preference: EItemFeedPreference;
            }>
        ) {
            const {
                payload: { widgetHash, preference },
            } = action;
            draft.podcast[widgetHash] = {
                ...draft.podcast[widgetHash],
                feedPreference: preference,
            };
        },
        setPodcastPreferredChannelIds(
            draft,
            action: PayloadAction<{
                widgetHash: string;
                preference: number[];
            }>
        ) {
            const {
                payload: { widgetHash, preference },
            } = action;
            draft.podcast[widgetHash] = {
                ...draft.podcast[widgetHash],
                preferredChannelIds: preference,
            };
        },
        setVideoFeedPreference(
            draft,
            action: PayloadAction<{
                widgetHash: string;
                preference: EItemFeedPreference;
            }>
        ) {
            const {
                payload: { widgetHash, preference },
            } = action;
            draft.video[widgetHash] = {
                ...draft.video[widgetHash],
                feedPreference: preference,
            };
        },
        setVideoPreferredChannelIds(
            draft,
            action: PayloadAction<{
                widgetHash: string;
                preference: number[];
            }>
        ) {
            const {
                payload: { widgetHash, preference },
            } = action;
            draft.video[widgetHash] = {
                ...draft.video[widgetHash],
                preferredChannelIds: preference,
            };
        },
        setSelectedChartRange(
            draft,
            action: PayloadAction<{
                widgetHash: string;
                chartRange: TChartRange;
            }>
        ) {
            const {
                payload: { widgetHash, chartRange },
            } = action;

            draft.market[widgetHash] = {
                ...draft.market[widgetHash],
                selectedChartRange: chartRange,
            };
        },
        setSelectedCalendarType(
            draft,
            action: PayloadAction<{
                widgetHash: string;
                calType: ECalendarType;
            }>
        ) {
            const {
                payload: { widgetHash, calType },
            } = action;

            draft.calendar[widgetHash] = {
                ...draft.calendar[widgetHash],
                selectedCalendarType: calType,
            };
        },
        setSelectedChartType(
            draft,
            action: PayloadAction<{
                widgetHash: string;
                chartType: EChartType;
            }>
        ) {
            const {
                payload: { widgetHash, chartType },
            } = action;

            draft.market[widgetHash] = {
                ...draft.market[widgetHash],
                selectedChartType: chartType,
            };
        },
        setSelectedDate(
            draft,
            action: PayloadAction<{ widgetHash: string; date: string }>
        ) {
            const {
                payload: { widgetHash, date },
            } = action;

            draft.calendar[widgetHash] = {
                ...draft.calendar[widgetHash],
                selectedDate: date,
            };
        },
        setEventFilters(
            draft,
            action: PayloadAction<{
                widgetHash: string;
                filters: TEventCategory[];
            }>
        ) {
            const {
                payload: { widgetHash, filters },
            } = action;

            draft.calendar[widgetHash] = {
                ...draft.calendar[widgetHash],
                eventFilters: filters,
            };
        },
        toggleCollapse(
            draft,
            action: PayloadAction<{
                widgetHash: string;
            }>
        ) {
            const {
                payload: { widgetHash },
            } = action;
            draft.common = {
                ...draft.common,
                [widgetHash]: {
                    ...(draft.common[widgetHash] ?? {}),
                    isMinimised: !draft.common[widgetHash]?.isMinimised,
                },
            };
        },
        toggleShowAllAssets(
            draft,
            action: PayloadAction<{
                widgetHash: string;
            }>
        ) {
            const {
                payload: { widgetHash },
            } = action;
            draft.portfolio = {
                ...draft.portfolio,
                [widgetHash]: {
                    ...(draft.portfolio[widgetHash] ?? {}),
                    showAllAssets: !draft.portfolio[widgetHash]?.showAllAssets,
                },
            };
        },
        removeWidgetStateFromCache(
            draft,
            action: PayloadAction<{
                widgetHash: string;
            }>
        ) {
            const {
                payload: { widgetHash },
            } = action;

            Object.values(draft).forEach((widgetState) => {
                // eslint-disable-next-line no-param-reassign
                if (widgetHash in widgetState) delete widgetState[widgetHash];
            });
        },
        setWidgetHeight(
            draft,
            action: PayloadAction<{
                widgetHash: string;
                widgetHeight: number;
            }>
        ) {
            const {
                payload: { widgetHash, widgetHeight },
            } = action;
            draft.common = {
                ...draft.common,
                [widgetHash]: {
                    ...(draft.common[widgetHash] ?? {}),
                    widgetHeight,
                },
            };
        },
        setSelectedTvlProjectType(
            draft,
            action: PayloadAction<{
                widgetHash: string;
                projectType: TProjectType;
            }>
        ) {
            const {
                payload: { widgetHash, projectType },
            } = action;

            draft.tvl[widgetHash] = {
                ...draft.tvl[widgetHash],
                selectedProjectType: projectType,
            };
        },
    },
});

export const {
    setSelectedMarket,
    setNewsFeedPreference,
    setBlogFeedPreference,
    setKasandraFeedPreference,
    setPodcastFeedPreference,
    setPodcastPreferredChannelIds,
    setVideoFeedPreference,
    setVideoPreferredChannelIds,
    setSelectedChartRange,
    setSelectedDate,
    setSelectedCalendarType,
    setSelectedChartType,
    setEventFilters,
    toggleCollapse,
    toggleShowAllAssets,
    removeWidgetStateFromCache,
    setWidgetHeight,
    setSelectedTvlProjectType,
} = widgetsSlice.actions;
export default widgetsSlice.reducer;

/**
 * selectors
 */

export const selectNewsFeedPreference =
    (widgetHash: string) =>
    (state: RootState): EItemFeedPreference | undefined =>
        state.widgets.news[widgetHash]?.feedPreference;

export const selectPodcastFeedPreference =
    (widgetHash: string) =>
    (state: RootState): EItemFeedPreference | undefined =>
        state.widgets.podcast[widgetHash]?.feedPreference;

export const selectPodcastPreferredChannelIds =
    (widgetHash: string) =>
    (state: RootState): number[] | undefined =>
        state.widgets.podcast[widgetHash]?.preferredChannelIds;

export const selectKasandraFeedPreference =
    (widgetHash: string) =>
    (state: RootState): EItemFeedPreference | undefined =>
        state.widgets.kasandra[widgetHash]?.feedPreference;

export const selectBlogFeedPreference =
    (widgetHash: string) =>
    (state: RootState): EItemFeedPreference | undefined =>
        state.widgets.blog[widgetHash]?.feedPreference;

export const selectVideoFeedPreference =
    (widgetHash: string) =>
    (state: RootState): EItemFeedPreference | undefined =>
        state.widgets.video[widgetHash]?.feedPreference;

export const selectVideoPreferredChannelIds =
    (widgetHash: string) =>
    (state: RootState): number[] | undefined =>
        state.widgets.video[widgetHash]?.preferredChannelIds;

export const selectSelectedDate =
    (widgetHash: string) =>
    (state: RootState): string | undefined =>
        state.widgets.calendar[widgetHash]?.selectedDate;

export const selectSelectedCalendarType =
    (widgetHash: string) =>
    (state: RootState): ECalendarType | undefined =>
        state.widgets.calendar[widgetHash]?.selectedCalendarType;

export const selectSelectedChartType =
    (widgetHash: string) =>
    (state: RootState): EChartType | undefined =>
        state.widgets.market[widgetHash]?.selectedChartType;

export const selectShowAllAssets =
    (widgetHash: string) =>
    (state: RootState): boolean =>
        !!state.widgets.portfolio[widgetHash]?.showAllAssets;

export const selectIsMinimised =
    (widgetHash: string) =>
    (state: RootState): boolean =>
        !!state.widgets.common[widgetHash]?.isMinimised;

export const selectWidgetHeight =
    (widgetHash: string) =>
    (state: RootState): number | undefined =>
        state.widgets.common[widgetHash]?.widgetHeight;

export const selectTvlProjectType =
    (widgetHash: string) =>
    (state: RootState): TProjectType | undefined =>
        state.widgets.tvl[widgetHash]?.selectedProjectType;
