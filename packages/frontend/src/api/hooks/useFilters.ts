import {
    useGetUserProfileQuery,
    useUpdateUserProfileFiltersMutation,
} from "src/api/services";
import {
    selectedSyncedFiltersSelector,
    setSortBy,
    setTimeRange,
    selectMediaType,
    selectSyncedFilter,
} from "src/api/store";
import { useAppSelector, useAppDispatch } from "src/api/store/hooks";
import { ESortFeedBy, ESupportedFilters } from "src/api/types";
import { Logger } from "../utils/logging";
import { useAuth } from "./useAuth";

interface IFilters {
    toggleFilter: (slug: string, filterType: ESupportedFilters) => void;
}

/**
 * TODO:
 * - upon login, sync local filter with remote
 */

export const useFilters = (): IFilters => {
    const dispatch = useAppDispatch();
    const [updateFilters] = useUpdateUserProfileFiltersMutation();

    const { isAuthenticated } = useAuth();

    const syncedFilters = useAppSelector(selectedSyncedFiltersSelector);

    // TODO(v-almonacid)
    // const { currentData } = useGetUserProfileQuery(undefined, {
    //    skip: !isAuthenticated,
    // });

    const toggleFilterInCache = (
        slug: string,
        filterType: ESupportedFilters
    ) => {
        switch (filterType) {
            case ESupportedFilters.SortBy:
                if (Object.values(ESortFeedBy).includes(slug as ESortFeedBy)) {
                    dispatch(setSortBy(slug as ESortFeedBy));
                } else {
                    Logger.warn("UserFiltersContainer: unknown sortBy filter");
                    dispatch(setSortBy(ESortFeedBy.Trendiness));
                }
                break;
            case ESupportedFilters.TimeRange:
                dispatch(setTimeRange({ slug }));
                break;
            case ESupportedFilters.MediaTypes:
                dispatch(selectMediaType({ slug }));
                break;
            case ESupportedFilters.Chains:
            case ESupportedFilters.Coins:
            case ESupportedFilters.ConceptTags:
                dispatch(selectSyncedFilter({ slug, type: filterType }));
                break;
            default:
                break;
        }
    };

    const toggleFilter = (
        selectedSlug: string,
        filterType: ESupportedFilters
    ) => {
        toggleFilterInCache(selectedSlug, filterType);

        const cachedFiltersCopy = { ...syncedFilters };

        if (
            isAuthenticated &&
            (filterType === ESupportedFilters.Chains ||
                filterType === ESupportedFilters.Coins ||
                filterType === ESupportedFilters.ConceptTags)
        ) {
            const filtersToUpdate = cachedFiltersCopy[filterType];
            if (filtersToUpdate === undefined) {
                Logger.warn(
                    "userFilters::toggleFilter: unknown filter type, exiting"
                );
                return;
            }
            if (filtersToUpdate.some((slug) => slug === selectedSlug)) {
                // when the filter is already selected, we remove it
                cachedFiltersCopy[filterType] = filtersToUpdate.filter(
                    (slug) => slug !== selectedSlug
                );
            } else {
                cachedFiltersCopy[filterType].push(selectedSlug);
            }
            const allFilters = new Set([
                ...cachedFiltersCopy.chains,
                ...cachedFiltersCopy.coins,
                ...cachedFiltersCopy.conceptTags,
            ]);

            updateFilters({
                filter_tags: Array.from(allFilters),
                filter_chains: cachedFiltersCopy.chains,
                filter_coins: cachedFiltersCopy.coins,
                filter_concept_tags: cachedFiltersCopy.conceptTags,
            })
                .unwrap()
                .then((resp) =>
                    Logger.debug(
                        "useFilters::toggleFilter: updated user filters",
                        resp
                    )
                )
                .catch((err) =>
                    Logger.error(
                        "useFilters::toggleFilter: error updating user filters",
                        err
                    )
                );
        }
    };

    return {
        toggleFilter,
    };
};
