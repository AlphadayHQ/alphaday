import { FC } from "react";
import { useDispatch } from "react-redux";
import { useGetFilterDataQuery, TBaseFilterItem } from "src/api/services";
import {
    selectedLocalFiltersSelector,
    selectedSyncedFiltersSelector,
    setSortBy,
    setTimeRange,
    selectMediaType,
    selectSyncedFilter,
    TSelectedFiltersLocal,
} from "src/api/store";
import { useAppSelector } from "src/api/store/hooks";
import { ESortFeedBy, ESupportedFilters } from "src/api/types";
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

const updateRemoteFilterOptionsState = (
    selectedOptions: string[],
    remoteOptions: TBaseFilterItem[]
): TOption[] =>
    remoteOptions
        .map((option) => ({
            name: option.name,
            slug: option.slug,
            selected: selectedOptions.some((slug) => slug === option.slug),
        }))
        .sort(sortBySelected);

const UserFiltersContainer: FC<{
    onToggleFeedFilters: () => void;
    show: boolean;
}> = ({ onToggleFeedFilters, show }) => {
    const dispatch = useDispatch();

    const selectedLocalFilters = useAppSelector(selectedLocalFiltersSelector);
    const selectedSyncedFilters = useAppSelector(selectedSyncedFiltersSelector);

    const { data: filtersData, isLoading } = useGetFilterDataQuery();

    const filterOptions: TFilterOptions = {
        localFilterOptions: updateLocalFilterOptionsState(selectedLocalFilters),
        syncedFilterOptions: {
            coins: {
                label: "Coins",
                type: ESupportedFilters.Coins,
                options: updateRemoteFilterOptionsState(
                    selectedSyncedFilters.coins,
                    filtersData?.coins ?? []
                ),
            },
            chains: {
                label: "Chains",
                type: ESupportedFilters.Chains,
                options: updateRemoteFilterOptionsState(
                    selectedSyncedFilters.chains,
                    filtersData?.chains ?? []
                ),
            },
        },
    };

    const handleSelectFilter = (
        slug: string,
        filterType: ESupportedFilters
    ) => {
        Logger.debug("handleSlectedFilter:", slug, filterType);
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

    return (
        <UserFiltersModal
            onToggleFeedFilters={onToggleFeedFilters}
            show={show}
            filterOptions={filterOptions}
            isLoading={isLoading}
            onSelectFilter={handleSelectFilter}
        />
    );
};

export default UserFiltersContainer;
