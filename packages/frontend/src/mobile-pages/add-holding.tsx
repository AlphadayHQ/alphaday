import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { usePagination } from "src/api/hooks";
import { useGetCoinsQuery } from "src/api/services";
import { TCoin } from "src/api/types";
import {
    buildUniqueItemList,
    shouldFetchMoreItems,
} from "src/api/utils/itemUtils";

import AddHolding from "src/mobile-components/portfolio/AddHolding";
import SelectHoldingCoin from "src/mobile-components/portfolio/SelectHoldingCoin";
import CONFIG from "src/config";
import { THolding } from "./types";

const INITIAL_PAGE = 1;

const AddHoldingPage = () => {
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);
    const [coins, setCoins] = useState<TCoin[] | undefined>();
    const [selectedCoin, setSelectedCoin] = useState<TCoin>();
    const [holding, setholding] = useState<THolding>();

    const {
        data: coinsDataResponse,
        isLoading: isLoadingCoinsData,
        isSuccess,
    } = useGetCoinsQuery({
        page: currentPage,
        tags: undefined,
        limit: CONFIG.WIDGETS.MARKET.QUERY_HARD_LIMIT,
    });

    const { nextPage, handleNextPage } = usePagination(
        coinsDataResponse?.links,
        CONFIG.UI.BOARD_LIBRARY.MAX_PAGE_NUMBER,
        isSuccess
    );

    const coinsData = useMemo(
        () => coinsDataResponse?.results ?? [],
        [coinsDataResponse]
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleScrollEvent = useCallback(
        ({ currentTarget }: FormEvent<HTMLElement>) => {
            if (shouldFetchMoreItems(currentTarget)) {
                handleNextPage("next");
            }
        },
        [handleNextPage]
    );

    useEffect(() => {
        if (coinsData !== undefined) {
            setCoins((prevItems) => {
                if (prevItems) {
                    const newItems = buildUniqueItemList([
                        ...prevItems,
                        ...coinsData,
                    ]);
                    return newItems;
                }
                return coinsData;
            });
        }
    }, [coinsData]);

    // set current page 350ms after next page is set.
    // RTK should cache requests, so we don't need to be too careful about rerenders.
    useEffect(() => {
        if (nextPage === undefined) {
            return () => null;
        }
        const timeout = setTimeout(() => {
            setCurrentPage(nextPage);
        }, 350);
        return () => {
            clearTimeout(timeout);
        };
    }, [nextPage]);

    if (selectedCoin !== undefined) {
        return (
            <div className="h-screen">
                <AddHolding
                    selectedCoin={selectedCoin}
                    setSelectedCoin={setSelectedCoin}
                    holding={holding}
                    setHolding={setholding}
                />
            </div>
        );
    }
    return (
        <div className="h-screen">
            <SelectHoldingCoin
                onScroll={handleScrollEvent}
                onInputChange={handleInputChange}
                inputValue={searchText}
                isLoadingCoinsData={isLoadingCoinsData}
                coins={coins}
                setSelectedCoin={setSelectedCoin}
            />
        </div>
    );
};

export default AddHoldingPage;
