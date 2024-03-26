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
} from "src/api/services";
import {
    selectedLocalFiltersSelector,
    selectedSyncedFiltersSelector,
    TSelectedFiltersSynced,
} from "src/api/store";
import { useAppSelector } from "src/api/store/hooks";
<<<<<<< HEAD
import { ESortFeedBy, TSuperfeedItem } from "src/api/types";
=======
import {
    TSuperfeedItem,
    TFilterKeywordOption,
    ESupportedFilters,
} from "src/api/types";
import { groupedKeywordsAsOptions } from "src/api/utils/filterUtils";
>>>>>>> dev
import { Logger } from "src/api/utils/logging";
import { shareData } from "src/api/utils/shareUtils";
import { EToastRole, deferredToast, toast } from "src/api/utils/toastUtils";
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

    const flattenedKeywordResults = useMemo(
        () =>
            Object.values(keywordResults ?? {}).reduce(
                (acc, curr) => [...acc, ...curr],
                []
            ),
        [keywordResults]
    );

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

    const superfeedPageState = history.location.state as {
        sortBy?: ESortFeedBy;
        shouldUseFilters?: boolean;
    };

    const [likeSuperfeedItemMut] = useLikeSuperfeedItemMutation();
    const {
        currentData: feedDataResponse,
        isLoading,
        isSuccess,
        refetch,
    } = useGetSuperfeedListQuery({
        page: currentPage,
        content_types: contentTypes,
        days: timeRangeInDays?.value,
        sort_order: superfeedPageState?.sortBy ?? sortBy,
        user_filter:
            superfeedPageState?.shouldUseFilters || // if filters are disabled or not
            (isAuthenticated && !tagsFromSearch), // if tags are present, we don't want to use user filters
        tags: tagsFromSearch ?? tagsFromCustomFilters,
    });
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
        reset();
    }

    //  When results change, append them
    if (
        feedDataResponse?.results !== undefined &&
        prevFeedDataResponseRef.current !== feedDataResponse?.results
    ) {
        setFeedData((prevState) => {
            const newFeedItems = [
                ...(prevState ?? []).filter(
                    (it) =>
                        feedDataForCurrentPage.find((i) => i.id === it.id) ===
                        undefined
                ),
                ...feedDataForCurrentPage,
            ];
            if (newFeedItems.length === 0) {
                deferredToast(
                    {
                        delay: 1000,
                        messages: {
                            initial:
                                "No results for your current filter preferences.",
                            success: "Filters have been reset",
                        },
                        callback() {
                            history.replace("/superfeed", {
                                sortBy: ESortFeedBy.Trendiness,
                                shouldUseFilters: false,
                            });
                        },
                    },
                    {
                        duration: 1500,
                    }
                );
            }
            return newFeedItems;
        });
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
                toast("Error sharing item", {
                    type: EToastRole.Error,
                });
            }
        },
        [logShareSuperfeedItem]
    );

    const likeItem = useCallback(
        async (item: TSuperfeedItem) => {
            try {
                await likeSuperfeedItemMut({
                    id: item.id,
                }).unwrap();
            } catch (e) {
                Logger.error("SuperfeedModule::FeedCard: error liking item", e);
                toast("Error sharing item", {
                    type: EToastRole.Error,
                });
            }
        },
        [likeSuperfeedItemMut]
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
        if (
            tagsFromSearch &&
            !flattenedKeywordResults.find((kw) =>
                tagsFromSearch.includes(kw.slug)
            )
        ) {
            setSearchState(tagsFromSearch);
        }
    }, [tagsFromSearch, flattenedKeywordResults, setSearchState]);

    const keywordOptions = useMemo(
        () => groupedKeywordsAsOptions(keywordResults),
        [keywordResults]
    );

    const initialSearchValues = useMemo(() => {
        if (!tagsFromSearch) return undefined;
        const matchedKeywords = tagsFromSearch
            ?.split(",")
            .map((tag) => {
                return flattenedKeywordResults.filter((t) => t.slug === tag)[0];
            })
            .filter((kw) => kw)
            .map((kw) => ({
                ...kw,
                label: kw.name,
                value: kw.slug,
            }));
        if (matchedKeywords.length > 0) return matchedKeywords;
        return tagsFromSearch?.split(",").map((tagName, i) => ({
            // this is not accurate, but unfortunately the filter_keywords endpoint doesn't
            // provide good results so there is no guarantee that a superfeed item keyword
            // exists in the filter_keywords response
            id: i,
            name: tagName,
            slug: tagName,
            type: ESupportedFilters.ConceptTags,
            label: tagName,
            value: tagName,
        }));
    }, [tagsFromSearch, flattenedKeywordResults]);

    return (
        <AudioPlayerProvider>
            {(showSearchBar || (tagsFromSearch && keywordResults)) && (
                <div className="py-2 px-5">
                    <FilterSearchBar<TFilterKeywordOption>
                        isFetchingKeywordResults={isFetchingKeywordResults}
                        setSearchState={setSearchState}
                        keywords={keywordOptions}
                        onChange={(t) => {
                            if (t.length === 0) {
                                history.push("/superfeed", {});
                                return;
                            }
                            history.push(
                                `/superfeed/search/${t
                                    .map((tag) => tag.slug)
                                    .join(",")}`,
                                {}
                            );
                        }}
                        initialSearchValues={initialSearchValues}
                    />
                </div>
            )}
            <PullToRefreshContainer handleRefresh={refetch}>
                <SuperfeedModule
                    isLoading={isLoading}
                    isAuthenticated={isAuthenticated}
                    feed={feedData}
                    handlePaginate={handleNextPage}
                    toggleShowFeedFilters={onToggleFeedFilters}
                    selectedPodcast={selectedPodcast}
                    setSelectedPodcast={setSelectedPodcast}
                    onShareItem={shareItem}
                    onLikeItem={likeItem}
                />
            </PullToRefreshContainer>
        </AudioPlayerProvider>
    );
};

export default SuperfeedContainer;
