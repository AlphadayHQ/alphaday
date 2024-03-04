import { FC } from "react";
import { useFilters, useFilterKeywordSearch } from "src/api/hooks";
import {
    useGetFilterDataQuery,
    TFilterDatum,
    TTaggedFilterDatum,
} from "src/api/services";
import {
    selectedLocalFiltersSelector,
    selectedSyncedFiltersSelector,
    TSelectedFiltersLocal,
} from "src/api/store";
import { useAppSelector } from "src/api/store/hooks";
import { ESupportedFilters } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import {
    TLocalFilterOptions,
    TFilterOptions,
    STATIC_FILTER_OPTIONS,
    TOption,
} from "src/mobile-components/user-filters-modal/filterOptions";
import UserFiltersModal from "src/mobile-components/user-filters-modal/UserFiltersModal";

/**
 * Sort options and show selected ones first
 */
const sortBySelected = (a: TOption, d: TOption) =>
    Number(d.selected) - Number(a.selected);

const updateLocalFilterOptionsState = (
    selectedFilters: TSelectedFiltersLocal
): TLocalFilterOptions => ({
    ...STATIC_FILTER_OPTIONS,
    media: {
        ...STATIC_FILTER_OPTIONS.media,
        options: STATIC_FILTER_OPTIONS.media.options
            .map((option) => ({
                ...option,
                selected: selectedFilters.mediaTypes.some(
                    (slug) => slug === option.slug
                ),
            }))
            .sort(sortBySelected),
    },
    timeRange: {
        ...STATIC_FILTER_OPTIONS.timeRange,
        options: STATIC_FILTER_OPTIONS.timeRange.options.map((option) => ({
            ...option,
            selected: selectedFilters.timeRange === option.slug,
        })),
    },
    sortBy: {
        ...STATIC_FILTER_OPTIONS.sortBy,
        options: STATIC_FILTER_OPTIONS.sortBy.options.map((option) => ({
            ...option,
            selected: selectedFilters.sortBy === option.slug,
        })),
    },
});

/**
 * Note on filter data tyos: Some filters have a 1-to-1 correspondance with
 * the tag model. Others, like coins and projects/chains, include a parent tag
 * field which we use to identify the unique tag they belong to.
 */

const updateRemoteFilterOptionsState = (
    selectedOptions: string[],
    remoteOptions: TFilterDatum[]
): TOption[] =>
    remoteOptions
        .map((option) => ({
            name: option.name,
            slug: option.slug,
            selected: selectedOptions.some((slug) => slug === option.slug),
        }))
        .sort(sortBySelected);

const updateRemoteTaggedFilterOptionsState = (
    selectedOptions: string[],
    remoteOptions: TTaggedFilterDatum[]
): TOption[] =>
    remoteOptions
        .map((option) => ({
            name: option.name,
            slug: option.tags[0]?.slug ?? option.slug,
            selected: selectedOptions.some(
                (slug) => slug === option.slug || slug === option.tags[0]?.slug
            ),
        }))
        .sort(sortBySelected);

const UserFiltersContainer: FC<{
    onToggleFeedFilters: () => void;
    show: boolean;
}> = ({ onToggleFeedFilters, show }) => {
    const selectedLocalFilters = useAppSelector(selectedLocalFiltersSelector);
    const selectedSyncedFilters = useAppSelector(selectedSyncedFiltersSelector);

    const { data: filtersData, isLoading } = useGetFilterDataQuery();

    const { toggleFilter } = useFilters();

    const { setSearchState, keywordResults } = useFilterKeywordSearch();

    const filterOptions: TFilterOptions = {
        localFilterOptions: updateLocalFilterOptionsState(selectedLocalFilters),
        syncedFilterOptions: {
            coins: {
                label: "Coins",
                type: ESupportedFilters.Coins,
                options: updateRemoteTaggedFilterOptionsState(
                    selectedSyncedFilters.coins,
                    filtersData?.coins ?? []
                ),
            },
            chains: {
                label: "Chains",
                type: ESupportedFilters.Chains,
                options: updateRemoteTaggedFilterOptionsState(
                    selectedSyncedFilters.chains,
                    filtersData?.chains ?? []
                ),
            },
            conceptTags: {
                label: "General",
                type: ESupportedFilters.ConceptTags,
                options: updateRemoteFilterOptionsState(
                    selectedSyncedFilters.conceptTags,
                    filtersData?.conceptTags ?? []
                ),
            },
        },
    };

    const handleSelectFilter = (
        slug: string,
        filterType: ESupportedFilters
    ) => {
        Logger.debug("handleSlectedFilter:", slug, filterType);
        toggleFilter(slug, filterType);
    };

    return (
        <UserFiltersModal
            onToggleFeedFilters={onToggleFeedFilters}
            show={show}
            filterOptions={filterOptions}
            isLoading={isLoading}
            onSelectFilter={handleSelectFilter}
            filterKeywords={keywordResults}
            onSearchInputChange={setSearchState}
        />
    );
};

export default UserFiltersContainer;
