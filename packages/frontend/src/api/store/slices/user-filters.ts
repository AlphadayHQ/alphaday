import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "src/api/store/store";
import { ESortFeedBy, ESupportedFilters, ETimeRange } from "src/api/types";
import { Logger } from "src/api/utils/logging";
// import { ETag, TBaseTag } from "src/api/services";
// import { TKeyword } from "src/api/types";

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
     * local filters are only persisted locally
     * synced filters are both kept locally and in the remote
     */
    selectedFiltersLocal: TSelectedFiltersLocal;
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
        // TODO: use object payload instead for consistency
        setSortBy(draft, action: PayloadAction<ESortFeedBy>) {
            const { payload: sortBy } = action;
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
    },
});

export const selectedLocalFiltersSelector = (
    state: RootState
): TSelectedFiltersLocal => state.userFilters.selectedFiltersLocal;

export const selectedSyncedFiltersSelector = (
    state: RootState
): TSelectedFiltersSynced => state.userFilters.selectedFiltersSynced;

export const { setSortBy, setTimeRange, selectSyncedFilter, selectMediaType } =
    userFiltersSlice.actions;

export default userFiltersSlice.reducer;
