import { useMemo, useEffect, useCallback } from "react";
import { useGlobalSearch } from "src/api/hooks";
import { TBaseTag } from "src/api/services";
import { setSelectedMarket } from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import { TCoin } from "src/api/types";
import { TMarketMeta } from "src/components/market/types";

interface UseSelectedCoinReturn {
    selectedCoin: TCoin | undefined;
    handleSelectedCoin: (market: TMarketMeta) => void;
}

export const useSelectedCoin = (
    widgetHash: string,
    coinsData: TCoin[],
    pinnedCoins: TCoin[],
    tags?: TBaseTag[]
): UseSelectedCoinReturn => {
    const dispatch = useAppDispatch();
    const { lastSelectedKeyword } = useGlobalSearch();

    const prevSelectedMarketData = useAppSelector(
        (state) => state.widgets.market?.[widgetHash]
    );

    const selectedCoin: TCoin | undefined = useMemo(() => {
        const storedMarket = [...pinnedCoins, ...coinsData].find(
            (c) => c.id === prevSelectedMarketData?.selectedMarket?.id
        );
        return storedMarket ?? pinnedCoins[0] ?? coinsData[0] ?? undefined;
    }, [prevSelectedMarketData?.selectedMarket, coinsData, pinnedCoins]);

    const handleSelectedCoin = useCallback(
        (market: TMarketMeta) => {
            dispatch(setSelectedMarket({ widgetHash, market }));
        },
        [dispatch, widgetHash]
    );

    useEffect(() => {
        if (
            lastSelectedKeyword &&
            tags?.find((t) => t.id === lastSelectedKeyword.tag.id)
        ) {
            const newMarketFromSearch = coinsData.find((marketMeta) => {
                return marketMeta.tags?.find(
                    (t) => t.id === lastSelectedKeyword.tag.id
                );
            });
            if (newMarketFromSearch) {
                handleSelectedCoin(newMarketFromSearch);
            }
        }
    }, [lastSelectedKeyword, coinsData, tags, handleSelectedCoin]);

    return {
        selectedCoin,
        handleSelectedCoin,
    };
};
