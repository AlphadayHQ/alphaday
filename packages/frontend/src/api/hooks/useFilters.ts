import { useRef } from "react";
import {
    useGetUserProfileQuery,
    useUpdateUserProfileFiltersMutation,
    TRemoteProfileFilters,
} from "src/api/services";
import {
    selectedSyncedFiltersSelector,
    setSortBy,
    setTimeRange,
    setSelectedFiltersSynced,
    selectMediaType,
    selectSyncedFilter,
    TSelectedFiltersSynced,
} from "src/api/store";
import { useAppSelector, useAppDispatch } from "src/api/store/hooks";
import { ESortFeedBy, ESupportedFilters } from "src/api/types";
import { Logger } from "../utils/logging";
import { useAuth } from "./useAuth";

interface IFilters {
    toggleFilter: (slug: string, filterType: ESupportedFilters) => void;
}

export const useFilters = (): IFilters => {
    const dispatch = useAppDispatch();
    const [updateFilters] = useUpdateUserProfileFiltersMutation();

    const prevRemoteFiltersState = useRef<TRemoteProfileFilters>();

    const { isAuthenticated } = useAuth();

    const syncedFilters = useAppSelector(selectedSyncedFiltersSelector);

    const { currentData: currentProfileData } = useGetUserProfileQuery(
        undefined,
        {
            skip: !isAuthenticated,
        }
    );

    const remoteFiltersState = currentProfileData
        ? {
              filter_tags: currentProfileData.filter_tags,
              filter_concept_tags: currentProfileData.filter_concept_tags,
              filter_coins: currentProfileData.filter_coins,
              filter_chains: currentProfileData.filter_chains,
          }
        : undefined;

    if (
        isAuthenticated &&
        remoteFiltersState &&
        !prevRemoteFiltersState.current
    ) {
        // user just logged in -> sync cached filters
        dispatch(
            setSelectedFiltersSynced({
                chains: remoteFiltersState.filter_chains.map((f) => f.slug),
                coins: remoteFiltersState.filter_coins.map((f) => f.slug),
                conceptTags: remoteFiltersState.filter_concept_tags.map(
                    (f) => f.slug
                ),
            })
        );
        prevRemoteFiltersState.current = remoteFiltersState;
    }

    const toggleFilterInCache = (
        slug: string,
        filterType: ESupportedFilters
    ) => {
        switch (filterType) {
            case ESupportedFilters.SortBy:
                if (Object.values(ESortFeedBy).includes(slug as ESortFeedBy)) {
                    dispatch(setSortBy({ slug: slug as ESortFeedBy }));
                } else {
                    Logger.warn("UserFiltersContainer: unknown sortBy filter");
                    dispatch(setSortBy({ slug: ESortFeedBy.Trendiness }));
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
        // save filter state in store first
        toggleFilterInCache(selectedSlug, filterType);

        // perform a deep copy
        const cachedFiltersCopy = Object.entries(syncedFilters).reduce(
            (acc, [currKey, currValue]) => ({
                ...acc,
                [currKey]: [...currValue],
            }),
            {} as TSelectedFiltersSynced
        );

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
                filter_tags: Array.from(allFilters).map((f) => ({ slug: f })),
                filter_chains: cachedFiltersCopy.chains.map((f) => ({
                    slug: f,
                })),
                filter_coins: cachedFiltersCopy.coins.map((f) => ({ slug: f })),
                filter_concept_tags: cachedFiltersCopy.conceptTags.map((f) => ({
                    slug: f,
                })),
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
