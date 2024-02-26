import { FC, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { AudioPlayerProvider } from "react-use-audio-player";
import { usePagination } from "src/api/hooks";
import { useKeywordSearch } from "src/api/hooks/useKeywordSearch";
import { useGetSuperfeedListQuery } from "src/api/services";
import { selectedLocalFiltersSelector } from "src/api/store";
import { useAppSelector } from "src/api/store/hooks";
import { TSuperfeedItem } from "src/api/types";
import FilterSearchBar from "src/mobile-components/FilterSearchBar";
import SuperfeedModule from "src/mobile-components/Superfeed";
import { STATIC_FILTER_OPTIONS } from "src/mobile-components/user-filters-modal/filterOptions";
import CONFIG from "src/config";

const { MAX_PAGE_NUMBER } = CONFIG.SUPERFEED;

const SuperfeedContainer: FC<{
    showSearchBar: boolean;
    onToggleFeedFilters: () => void;
    tags: string | undefined;
}> = ({ tags, onToggleFeedFilters, showSearchBar }) => {
    const history = useHistory();
    const { setSearchState, keywordResults } = useKeywordSearch();
    const selectedLocalFilters = useAppSelector(selectedLocalFiltersSelector);
    const prevTagsRef = useRef<string | undefined>(tags);

    const [selectedPodcast, setSelectedPodcast] =
        useState<TSuperfeedItem | null>(null);
    const contentTypes = Object.values(STATIC_FILTER_OPTIONS.media.options)
        .filter((op) => selectedLocalFilters.mediaTypes.includes(op.slug))
        .map((op) => op.contentType)
        .join(",");
    const timeRangeInDays = STATIC_FILTER_OPTIONS.timeRange.options.find(
        (t) => t.slug === selectedLocalFilters.timeRange
    );

    const [currentPage, setCurrentPage] = useState<number | undefined>();

    const {
        currentData: feedDataResponse,
        isLoading,
        isSuccess,
    } = useGetSuperfeedListQuery({
        page: currentPage,
        content_types: contentTypes,
        days: timeRangeInDays?.value,
        user_filter: !tags, // if tags are present, we don't want to use user filters
        tags,
    });
    const prevFeedDataResponseRef = useRef<TSuperfeedItem[]>();

    const { nextPage, handleNextPage } = usePagination(
        feedDataResponse?.links,
        MAX_PAGE_NUMBER,
        isSuccess
    );

    const feedDataForCurrentPage = [...(feedDataResponse?.results ?? [])];

    const [feedData, setfeedData] = useState<TSuperfeedItem[]>([]);

    if (tags !== prevTagsRef.current) {
        prevTagsRef.current = tags;
        setfeedData([...feedDataForCurrentPage]);
    }

    // Todo(xavier-charles) Will use this later
    // If the current response changes, it means the request parameters changed
    // This happens 1. when user scrolled to the bottom or 2. tags changed.
    // Case 2 is handled separately.
    if (
        feedDataResponse?.results !== undefined &&
        prevFeedDataResponseRef.current !== feedDataResponse?.results
    ) {
        setfeedData((prevState) => [...prevState, ...feedDataForCurrentPage]);
        prevFeedDataResponseRef.current = feedDataResponse?.results;
    }
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
        if (tags && !keywordResults?.find((kw) => tags.includes(kw.tag.slug))) {
            setSearchState(tags);
        }
    }, [tags, keywordResults, setSearchState]);

    return (
        <AudioPlayerProvider>
            {showSearchBar && (!tags || (tags && keywordResults)) && (
                <div className="py-2 px-5">
                    <FilterSearchBar
                        tags={tags}
                        setSearchState={setSearchState}
                        tagsList={
                            keywordResults?.map((kw) => ({
                                name: kw.tag.name,
                                slug: kw.tag.slug,
                                id: kw.tag.id,
                                label: kw.tag.name,
                                value: kw.tag.slug,
                            })) ?? []
                        }
                        onChange={(t) => {
                            if (t.length === 0) {
                                history.push("/superfeed");
                                return;
                            }
                            history.push(
                                `/superfeed/search/${t
                                    .map((tag) => tag.slug)
                                    .join(",")}`
                            );
                        }}
                    />
                </div>
            )}
            <SuperfeedModule
                isLoading={isLoading}
                feed={feedData}
                handlePaginate={handleNextPage}
                toggleShowFeedFilters={onToggleFeedFilters}
                selectedPodcast={selectedPodcast}
                setSelectedPodcast={setSelectedPodcast}
            />
        </AudioPlayerProvider>
    );
};

export default SuperfeedContainer;
