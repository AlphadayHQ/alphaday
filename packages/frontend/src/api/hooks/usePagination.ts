import { useState, useCallback } from "react";
import {
    extractPaginationNumbers,
    TPaginationLinks,
    TPaginationAction,
} from "src/api/utils/pagination";

interface IPaginationState {
    nextPage: number | undefined;
    handleNextPage: (type: "next" | "previous") => void;
}

export const usePagination = (
    remotePaginationState: TPaginationLinks,
    maxPaginationNumber: number,
    wasLastRequestSuccessful: boolean
): IPaginationState => {
    // note: usually the current page state is kept in the parent component
    const [nextPage, setNextPage] = useState<number | undefined>(undefined);

    const handleNextPage = useCallback(
        (type: TPaginationAction): void => {
            const paginationState = extractPaginationNumbers(
                remotePaginationState
            );
            const selectedPage = paginationState[type];
            if (
                selectedPage === undefined ||
                selectedPage >= maxPaginationNumber // do not allow to go beyond the allowed max page
            ) {
                return;
            }
            // change page only if last remote call was successful
            if (wasLastRequestSuccessful) {
                setNextPage(selectedPage);
            }
        },
        [remotePaginationState, wasLastRequestSuccessful, maxPaginationNumber]
    );

    return {
        nextPage,
        handleNextPage,
    };
};
