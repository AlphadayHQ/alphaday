import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { AudioPlayerProvider } from "react-use-audio-player";
import {
    useAccount,
    useActivityLogger,
    useFilterKeywordSearch,
    usePagination,
    useValueWatcher,
} from "src/api/hooks";
import {
    useGetSuperfeedListQuery,
    useLikeSuperfeedItemMutation,
    useLogClickSuperfeedItemMutation,
} from "src/api/services";
import {
    TSelectedFiltersSynced,
    selectedLocalFiltersSelector,
    selectedSyncedFiltersSelector,
} from "src/api/store";
import { useAppSelector } from "src/api/store/hooks";
import {
    TSuperfeedItem,
    TFilterKeywordOption,
    ESupportedFilters,
    ESortFeedBy,
} from "src/api/types";
import { groupedKeywordsAsOptions } from "src/api/utils/filterUtils";
import { Logger } from "src/api/utils/logging";
import { shareData } from "src/api/utils/shareUtils";
import { EToastRole, toast } from "src/api/utils/toastUtils";
import FilterSearchBar from "src/mobile-components/FilterSearchBar";
import SuperfeedModule from "src/mobile-components/Superfeed";
import { STATIC_FILTER_OPTIONS } from "src/mobile-components/user-filters/filterOptions";
import PullToRefreshContainer from "src/mobile-containers/PullToRefreshContainer";
import CONFIG from "src/config";
import { EMobileRoutePaths } from "src/routes";

const buildTagsQueryParam = (syncedFilters: TSelectedFiltersSynced) =>
    Object.values(syncedFilters)
        .reduce((acc, curr) => [...acc, ...curr], [])
        .join(",");

const { MAX_PAGE_NUMBER } = CONFIG.SUPERFEED;

const SuperfeedContainer: FC<{
    showSearchBar: boolean;
    onToggleFeedFilters: () => void;
    tags: string | undefined;
}> = ({ tags: tagsFromSearch, onToggleFeedFilters, showSearchBar }) => {
    const history = useHistory();

    const { setSearchState, keywordResults, isFetchingKeywordResults } =
        useFilterKeywordSearch();

    const selectedLocalFilters = useAppSelector(selectedLocalFiltersSelector);
    const selectedSyncedFilters = useAppSelector(selectedSyncedFiltersSelector);

    // these come from the user filters page
    const tagsFromCustomFilters = useMemo(
        () => buildTagsQueryParam(selectedSyncedFilters),
        [selectedSyncedFilters]
    );

    const { isAuthenticated } = useAccount();

    const [selectedPodcast, setSelectedPodcast] =
        useState<TSuperfeedItem | null>(null);

    const contentTypes = Object.values(STATIC_FILTER_OPTIONS.media.options)
        .filter((op) => selectedLocalFilters.mediaTypes.includes(op.slug))
        .map((op) => op.contentType)
        .join(",");
    const timeRangeInDays = STATIC_FILTER_OPTIONS.timeRange.options.find(
        (t) => t.slug === selectedLocalFilters.timeRange
    );
    const { sortBy } = selectedLocalFilters;

    const [currentPage, setCurrentPage] = useState<number | undefined>();
    const [isEmptyFeedResult, setIsEmptyFeedResult] = useState(false);

    const feedQueryParams = useMemo(() => {
        if (isEmptyFeedResult) {
            return {
                sort_order: ESortFeedBy.Trendiness,
                user_filter: false,
                tags: "",
            };
        }
        return {
            page: currentPage,
            content_types: contentTypes,
            days: timeRangeInDays?.value,
            sort_order: sortBy,
            user_filter: isAuthenticated && !tagsFromSearch,
            tags: tagsFromSearch ?? tagsFromCustomFilters,
        };
    }, [
        contentTypes,
        currentPage,
        isAuthenticated,
        isEmptyFeedResult,
        sortBy,
        tagsFromCustomFilters,
        tagsFromSearch,
        timeRangeInDays?.value,
    ]);

    const [likeSuperfeedItemMut] = useLikeSuperfeedItemMutation();
    const [logClickSuperfeedItemMut] = useLogClickSuperfeedItemMutation();
    const {
        currentData: feedDataResponse,
        isLoading,
        isSuccess,
        refetch,
    } = useGetSuperfeedListQuery(feedQueryParams);
    const prevFeedDataResponseRef = useRef<TSuperfeedItem[]>();
    const feedDataForCurrentPage = [...(feedDataResponse?.results ?? [])];

    const { nextPage, handleNextPage, reset } = usePagination(
        feedDataResponse?.links,
        MAX_PAGE_NUMBER,
        isSuccess
    );

    const { logShareSuperfeedItem } = useActivityLogger();

    const didContentTypesChange = useValueWatcher(contentTypes, true);
    const didSortByChange = useValueWatcher(sortBy, true);
    const didTimeRangeChange = useValueWatcher(timeRangeInDays, true);
    const didTagsFromSearchChange = useValueWatcher(tagsFromSearch, true);
    const didTagsFromCustomFiltersChange = useValueWatcher(
        tagsFromCustomFilters,
        true
    );

    const [feedData, setFeedData] = useState<TSuperfeedItem[] | undefined>(
        undefined
    );

    if (
        didTagsFromSearchChange ||
        didTagsFromCustomFiltersChange ||
        didContentTypesChange ||
        didSortByChange ||
        didTimeRangeChange
    ) {
        Logger.debug("params changed, resetting feed data");
        setFeedData(undefined);
        setIsEmptyFeedResult(false);
        reset();
    }

    //  When results change, append them
    if (
        feedDataResponse?.results !== undefined &&
        prevFeedDataResponseRef.current !== feedDataResponse?.results
    ) {
        setFeedData((prevState) => [
            ...(prevState ?? []).filter(
                (it) =>
                    feedDataForCurrentPage.find((i) => i.id === it.id) ===
                    undefined
            ),
            ...feedDataForCurrentPage,
        ]);
        if (feedDataResponse?.results.length === 0) {
            setIsEmptyFeedResult(true);
        }
        prevFeedDataResponseRef.current = feedDataResponse?.results;
    }

    const shareItem = useCallback(
        async (item: TSuperfeedItem) => {
            try {
                await shareData({
                    title: item.title,
                    text: item.shortDescription,
                    url: item.url ?? EMobileRoutePaths.Superfeed,
                });

                // Log the share
                logShareSuperfeedItem(item);
            } catch (e) {
                Logger.error(
                    "SuperfeedModule::FeedCard: error sharing item",
                    e
                );
                // don't show toast if user chooses not to share
                if (!(e as Error)?.message.match(/Share canceled/i)) {
                    toast((e as Error)?.message ?? "Error sharing item", {
                        type: EToastRole.Error,
                    });
                }
            }
        },
        [logShareSuperfeedItem]
    );

    const likeItem = useCallback(
        async (item: TSuperfeedItem) => {
            try {
                await likeSuperfeedItemMut({
                    itemId: item.itemId,
                    contentType: item.type,
                }).unwrap();
            } catch (e) {
                Logger.error("SuperfeedModule::FeedCard: error liking item", e);
                toast("We could not save your preference at this time", {
                    type: EToastRole.Error,
                });
            }
        },
        [likeSuperfeedItemMut]
    );

    const logItemClick = useCallback(
        async (item: TSuperfeedItem) => {
            try {
                await logClickSuperfeedItemMut({
                    itemId: item.itemId,
                    contentType: item.type,
                }).unwrap();
            } catch (e) {
                Logger.error(
                    "SuperfeedModule::FeedCard: error logging item interaction",
                    e
                );
            }
        },
        [logClickSuperfeedItemMut]
    );

    // set current page 350ms after next page is set.
    // RTK should cache requests, so we don't need to be too careful about rerenders.
    useEffect(() => {
        if (nextPage === undefined) return () => null;
        const timeout = setTimeout(() => {
            setCurrentPage(nextPage);
        }, 350);
        return () => {
            clearTimeout(timeout);
        };
    }, [nextPage]);

    useEffect(() => {
        /**
         * If tags have been passed in, but keywordResults have not been fetched yet,
         * It means the tags are being passed in from the URL or some other source.
         *
         * In this case, we want to set the search state to the tags.
         */
        if (tagsFromSearch) {
            Logger.debug(
                "Setting search state from search params:",
                tagsFromSearch
            );
            setSearchState(tagsFromSearch);
        }
    }, [tagsFromSearch, setSearchState]);

    /**
     * It's safe to check only coins and chains since the results would mostly be coins and chains
     */
    const hasSufficientResults =
        (keywordResults?.[ESupportedFilters.Coins] ??
            keywordResults?.[ESupportedFilters.Chains]) !== undefined;

    const keywordOptions = useMemo(() => {
        if (keywordResults !== undefined && hasSufficientResults) {
            return groupedKeywordsAsOptions(keywordResults);
        }
        return [];
    }, [keywordResults, hasSufficientResults]);

    const initialSearchValues = useMemo(() => {
        if (!tagsFromSearch) return undefined;
        return tagsFromSearch?.split(",").map((tagName, i) => ({
            // this is not accurate, but unfortunately the filter_keywords endpoint doesn't
            // provide good results so there is no guarantee that a superfeed item keyword
            // exists in the filter_keywords response. Also, the filter_keywords response
            // only includes results from the current search, but the search bar can include
            // previously searched keywords.
            id: i,
            name: tagName,
            slug: tagName,
            type: ESupportedFilters.ConceptTags,
            label: tagName,
            value: tagName,
        }));
    }, [tagsFromSearch]);

    return (
        <AudioPlayerProvider>
            {(showSearchBar || (tagsFromSearch && keywordResults)) && (
                <div className="py-2 px-5 z-10 relative">
                    <FilterSearchBar<TFilterKeywordOption>
                        isFetchingKeywordResults={isFetchingKeywordResults}
                        setSearchState={setSearchState}
                        keywords={keywordOptions}
                        onChange={(t) => {
                            if (t.length === 0) {
                                history.push("/superfeed");
                                return;
                            }
                            history.push(
                                `/superfeed/search/${t.map((tag) => tag.slug).join(",")}`
                            );
                        }}
                        initialSearchValues={initialSearchValues}
                        autoFocus={showSearchBar}
                    />
                </div>
            )}
            <PullToRefreshContainer
                handleRefresh={() => {
                    refetch()
                        .then(() => {
                            setFeedData(undefined);
                            setIsEmptyFeedResult(false);
                            reset();
                        })
                        .catch(() => {
                            Logger.error("Error refreshing feed");
                        });
                }}
            >
                <SuperfeedModule
                    isLoading={isLoading}
                    isAuthenticated={isAuthenticated}
                    isEmptyFeedResult={isEmptyFeedResult}
                    feed={feedData}
                    handlePaginate={handleNextPage}
                    toggleShowFeedFilters={onToggleFeedFilters}
                    selectedPodcast={selectedPodcast}
                    setSelectedPodcast={setSelectedPodcast}
                    onShareItem={shareItem}
                    onLikeItem={likeItem}
                    onClickItem={logItemClick}
                />
            </PullToRefreshContainer>
        </AudioPlayerProvider>
    );
};

export default SuperfeedContainer;
