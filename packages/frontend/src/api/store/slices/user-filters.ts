import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { signout } from "src/api/services/auth/authEndpoints";
import { logout } from "src/api/services/user/userEndpoints";
import { RootState } from "src/api/store/store";
import { ESortFeedBy, ESupportedFilters, ETimeRange } from "src/api/types";
import { Logger } from "src/api/utils/logging";

export type TSelectedFiltersLocal = {
    // TODO(v-almonacid): Not sure whether we need to keep search state in the store,
    // we may simply use component state instead.
    // keywords: TKeyword[] | undefined;
    // tags: TBaseTag[];
    sortBy: ESortFeedBy;
    timeRange: string | undefined;
    mediaTypes: string[];
};
export type TSelectedFiltersSynced = Omit<
    { [Key in ESupportedFilters]: string[] },
    "sortBy" | "timeRange" | "mediaTypes"
>;

export interface IUserFiltersState {
    /**
     * Object containing user selected filters which are only
     * stored *locally*
     */
    selectedFiltersLocal: TSelectedFiltersLocal;
    /**
     * Object containing user selected filters which are
     * are both stored locally and in the remote (hence need to
     * be "synced")
     */
    selectedFiltersSynced: TSelectedFiltersSynced;
}

const initialState: IUserFiltersState = {
    selectedFiltersLocal: {
        sortBy: ESortFeedBy.Trendiness,
        timeRange: ETimeRange.Anytime,
        mediaTypes: [],
    },
    selectedFiltersSynced: {
        coins: [],
        chains: [],
        conceptTags: [],
    },
};

const userFiltersSlice = createSlice({
    name: "userFilters",
    initialState,
    reducers: {
        setSortBy(draft, action: PayloadAction<{ slug: ESortFeedBy }>) {
            const { slug: sortBy } = action.payload;
            draft.selectedFiltersLocal.sortBy = sortBy;
        },
        setTimeRange(draft, action: PayloadAction<{ slug: string }>) {
            const { slug: timeRange } = action.payload;
            draft.selectedFiltersLocal.timeRange = timeRange;
        },
        selectMediaType(draft, action: PayloadAction<{ slug: string }>) {
            const { slug: mediaType } = action.payload;
            if (
                draft.selectedFiltersLocal.mediaTypes.some(
                    (slug) => slug === mediaType
                )
            ) {
                // when the filter is already selected, we remove it
                draft.selectedFiltersLocal.mediaTypes =
                    draft.selectedFiltersLocal.mediaTypes.filter(
                        (slug) => slug !== mediaType
                    );
            } else {
                draft.selectedFiltersLocal.mediaTypes.push(mediaType);
            }
        },
        selectSyncedFilter(
            draft,
            action: PayloadAction<{ slug: string; type: ESupportedFilters }>
        ) {
            const { slug: selectedSlug, type } = action.payload;
            if (
                type === ESupportedFilters.MediaTypes ||
                type === ESupportedFilters.SortBy ||
                type === ESupportedFilters.TimeRange
            ) {
                Logger.warn(
                    "userFilters::selectSyncedFilter: filter type does not match remotely synced filters"
                );
                return;
            }
            const selectedFilters = draft.selectedFiltersSynced[type];
            if (selectedFilters === undefined) {
                Logger.warn(
                    "userFilters::selectSyncedFilter: unknown filter type, exiting"
                );
                return;
            }
            if (selectedFilters.some((slug) => slug === selectedSlug)) {
                // when the filter is already selected, we remove it
                draft.selectedFiltersSynced[type] = selectedFilters.filter(
                    (slug) => slug !== selectedSlug
                );
            } else {
                selectedFilters.push(selectedSlug);
            }
        },
        setSelectedFiltersSynced(
            draft,
            action: PayloadAction<TSelectedFiltersSynced>
        ) {
            const newFilters = action.payload;
            draft.selectedFiltersSynced = newFilters;
        },
        resetSyncedFilter(draft) {
            Logger.debug(
                "user-filters::resetSyncedFilter: resetting cached filters"
            );
            draft.selectedFiltersSynced = initialState.selectedFiltersSynced;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(logout.matchFulfilled, (draft) => {
                Logger.debug(
                    "slices::user-filters: logout (legacy) fulfilled, resetting cached filters"
                );
                draft.selectedFiltersSynced =
                    initialState.selectedFiltersSynced;
            })
            .addMatcher(signout.matchFulfilled, (draft) => {
                Logger.debug(
                    "slices::user-filters: signout fulfilled, resetting cached filters"
                );
                draft.selectedFiltersSynced =
                    initialState.selectedFiltersSynced;
            });
    },
});

export const selectedLocalFiltersSelector = (
    state: RootState
): TSelectedFiltersLocal => state.userFilters.selectedFiltersLocal;

export const selectedSyncedFiltersSelector = (
    state: RootState
): TSelectedFiltersSynced => state.userFilters.selectedFiltersSynced;

export const {
    setSortBy,
    setTimeRange,
    selectSyncedFilter,
    selectMediaType,
    setSelectedFiltersSynced,
} = userFiltersSlice.actions;

export default userFiltersSlice.reducer;
