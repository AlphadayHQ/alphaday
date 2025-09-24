import { useMemo, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useGlobalSearch, useQuery } from "src/api/hooks";
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
    const history = useHistory();
    const { lastSelectedKeyword } = useGlobalSearch();
    const query = useQuery();
    const coinSlugFromUrl = query.get("coin");

    const prevSelectedMarketData = useAppSelector(
        (state) => state.widgets.market?.[widgetHash]
    );

    // Helper function to remove coin parameter from URL
    const removeCoinFromUrl = useCallback(() => {
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.delete("coin");
        const newSearch = currentParams.toString();
        const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ""}`;
        history.replace(newUrl);
    }, [history]);

    const selectedCoin: TCoin | undefined = useMemo(() => {
        // Priority 1: URL parameter - find coin by slug
        if (coinSlugFromUrl) {
            const coinFromUrl = [...pinnedCoins, ...coinsData].find(
                (c) => c.slug === coinSlugFromUrl
            );
            if (coinFromUrl) {
                return coinFromUrl;
            }
            // Clean up URL if coin slug is not found in available coins
            if (coinsData.length > 0 || pinnedCoins.length > 0) {
                removeCoinFromUrl();
            }
        }

        // Priority 2: Redux stored selection
        const storedMarket = [...pinnedCoins, ...coinsData].find(
            (c) => c.id === prevSelectedMarketData?.selectedMarket?.id
        );

        // Priority 3: Fallback to first pinned coin or first available coin
        return storedMarket ?? pinnedCoins[0] ?? coinsData[0] ?? undefined;
    }, [
        coinSlugFromUrl,
        prevSelectedMarketData?.selectedMarket,
        coinsData,
        pinnedCoins,
        removeCoinFromUrl,
    ]);

    const handleSelectedCoin = useCallback(
        (market: TMarketMeta) => {
            dispatch(setSelectedMarket({ widgetHash, market }));

            // Remove coin URL parameter when user manually selects a coin
            if (coinSlugFromUrl) {
                removeCoinFromUrl();
            }
        },
        [dispatch, widgetHash, coinSlugFromUrl, removeCoinFromUrl]
    );

    // Sync URL parameter to Redux when coin from URL is found
    useEffect(() => {
        // Add guard for data availability
        if (!coinsData.length && !pinnedCoins.length) {
            return; // Wait for data to load
        }
        if (
            coinSlugFromUrl &&
            selectedCoin &&
            selectedCoin.slug === coinSlugFromUrl
        ) {
            // Only update Redux if the current Redux state doesn't match the URL selection
            if (
                selectedCoin.id !== prevSelectedMarketData?.selectedMarket?.id
            ) {
                handleSelectedCoin(selectedCoin);
            }
        }
    }, [
        coinSlugFromUrl,
        selectedCoin,
        prevSelectedMarketData?.selectedMarket?.id,
        handleSelectedCoin,
        coinsData.length,
        pinnedCoins.length,
    ]);

    // Existing useEffect for global search
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
