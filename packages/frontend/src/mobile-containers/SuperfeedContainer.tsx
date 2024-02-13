import { FC, useEffect, useRef, useState } from "react";
import { usePagination } from "src/api/hooks";
import { useGetSuperfeedListQuery } from "src/api/services";
import { selectedLocalFiltersSelector } from "src/api/store";
import { useAppSelector } from "src/api/store/hooks";
import { TSuperfeedItem } from "src/api/types";
import SuperfeedModule from "src/mobile-components/Superfeed";
import { STATIC_FILTER_OPTIONS } from "src/mobile-components/user-filters-modal/filterOptions";
import CONFIG from "src/config";

const { MAX_PAGE_NUMBER } = CONFIG.SUPERFEED;

const SuperfeedContainer: FC<{ onToggleFeedFilters: () => void }> = ({
    onToggleFeedFilters,
}) => {
    // TODO(v-almonacid): implement superfeed search
    // const { tags } = useMobileGlobalSearch();
    const selectedLocalFilters = useAppSelector(selectedLocalFiltersSelector);

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
        user_filter: true,
    });
    const prevFeedDataResponseRef = useRef<TSuperfeedItem[]>();

    const { nextPage, handleNextPage } = usePagination(
        feedDataResponse?.links,
        MAX_PAGE_NUMBER,
        isSuccess
    );

    const feedDataForCurrentPage = [...(feedDataResponse?.results ?? [])];

    const [feedData, setfeedData] = useState<TSuperfeedItem[]>([]);

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

    return (
        <SuperfeedModule
            isLoading={isLoading}
            feed={feedData}
            handlePaginate={handleNextPage}
            toggleShowFeedFilters={onToggleFeedFilters}
        />
    );
};

export default SuperfeedContainer;
