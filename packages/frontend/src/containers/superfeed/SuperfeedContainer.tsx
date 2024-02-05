import { useEffect, useRef, useState } from "react";
import { usePagination } from "src/api/hooks";
import { useGetSuperfeedListQuery } from "src/api/services/superfeed/superfeedEndpoints";
import { TSuperfeedItem } from "src/api/types";
// import { filteringListToStr } from "src/api/utils/filterUtils";
import SuperfeedModule from "src/components/superfeed/SuperfeedModule";

// Todo(xavier-charles) move this to config
const MAX_PAGE_NUMBER = 1000;

const SuperfeedContainer = () => {
    const [currentPage, setCurrentPage] = useState<number | undefined>();

    const {
        currentData: feedDataResponse,
        isLoading,
        isSuccess,
    } = useGetSuperfeedListQuery({
        page: currentPage,
        // tags: currentTags ? filteringListToStr(currentTags) : undefined,
    });
    const prevFeedDataResponseRef = useRef<TSuperfeedItem[]>();

    const {
        nextPage,
        handleNextPage,
        // reset: resetPagination,
    } = usePagination(feedDataResponse?.links, MAX_PAGE_NUMBER, isSuccess);

    const feedDataForCurrentPage = [...(feedDataResponse?.results ?? [])];

    const [feedData, setfeedData] = useState<TSuperfeedItem[]>([]);

    // Todo(xavier-charles) Will use this later
    // const reset = () => {
    //     if (feedData.length !== 0) setfeedData([]);
    //     if (currentPage !== undefined) setCurrentPage(undefined);
    //     resetPagination();
    // };

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

    // Todo(xavier-charles) Will use this lateradd
    // if (tags && !itemListsAreEqual(currentTags || [], tags)) {
    //     reset();
    //     setCurrentTags(tags);
    // }

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
        />
    );
};

export default SuperfeedContainer;
