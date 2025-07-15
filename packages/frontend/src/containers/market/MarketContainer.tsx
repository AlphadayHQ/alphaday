import { FC, useEffect, useMemo, useCallback } from "react";
import { useGlobalSearch } from "src/api/hooks";
import {
    useGetCoinsQuery,
    useGetMarketHistoryQuery,
    useGetPinnedCoinsQuery,
    useTogglePinnedCoinMutation,
} from "src/api/services";
import {
    setSelectedMarket,
    setSelectedChartRange,
    selectSelectedChartType,
    setSelectedChartType,
} from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import { selectIsAuthenticated } from "src/api/store/slices/user";
import { TBaseEntity, TChartRange, TCoin } from "src/api/types";
import { filteringListToStr } from "src/api/utils/filterUtils";
import { Logger } from "src/api/utils/logging";
import { EToastRole, toast } from "src/api/utils/toastUtils";
import MarketModule from "src/components/market/MarketModule";
import { EChartType, TMarketMeta } from "src/components/market/types";
import CONFIG from "src/config";
import { EWidgetSettingsRegistry } from "src/constants";
import globalMessages from "src/globalMessages";
import { IModuleContainer } from "src/types";

const MarketContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const dispatch = useAppDispatch();
    const prevSelectedMarketData = useAppSelector(
        (state) => state.widgets.market?.[moduleData.hash]
    );
    const selectedChartRange = useMemo(
        () =>
            prevSelectedMarketData?.selectedChartRange ||
            CONFIG.WIDGETS.MARKET.DEFAULT_INTERVAL,
        [prevSelectedMarketData?.selectedChartRange]
    );

    const selectedChartType = useAppSelector(
        selectSelectedChartType(moduleData.hash)
    );

    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const onSelectChartType = useCallback(
        (chartType: EChartType) => {
            dispatch(
                setSelectedChartType({
                    chartType,
                    widgetHash: moduleData.hash,
                })
            );
        },
        [dispatch, moduleData.hash]
    );

    const { lastSelectedKeyword } = useGlobalSearch();

    const { data: pinnedCoinsData } = useGetPinnedCoinsQuery();
    const pinnedCoins = useMemo(
        () => pinnedCoinsData?.results || [],
        [pinnedCoinsData]
    );

    const [togglePinMut] = useTogglePinnedCoinMutation();

    const tagsSettings = moduleData.settings.filter(
        (s) =>
            s.widget_setting.setting.slug ===
            EWidgetSettingsRegistry.IncludedTags
    );
    const tags =
        tagsSettings[0] !== undefined ? tagsSettings[0].tags : undefined;

    const pollingInterval =
        (moduleData.widget.refresh_interval ||
            CONFIG.WIDGETS.MARKET.COIN_POLLING_INTERVAL) * 1000;

    const { data: coinsDataResponse, isLoading: isLoadingCoinsData } =
        useGetCoinsQuery(
            {
                tags: tags ? filteringListToStr(tags) : undefined,
                limit: CONFIG.WIDGETS.MARKET.QUERY_HARD_LIMIT,
            },
            {
                pollingInterval,
            }
        );

    const coinsData = useMemo(
        () => coinsDataResponse?.results ?? [],
        [coinsDataResponse]
    );

    const selectedMarket: TCoin | undefined = useMemo(() => {
        const storedMarket = [...pinnedCoins, ...coinsData].find(
            (c) => c.id === prevSelectedMarketData?.selectedMarket?.id
        );
        return storedMarket ?? pinnedCoins[0] ?? coinsData[0] ?? undefined;
    }, [prevSelectedMarketData?.selectedMarket, coinsData, pinnedCoins]);

    const { currentData: marketHistory, isFetching: isLoadingHistory } =
        useGetMarketHistoryQuery(
            {
                coin: selectedMarket?.slug,
                interval: selectedChartRange,
            },
            {
                pollingInterval:
                    CONFIG.WIDGETS.MARKET.HISTORY_POLLING_INTERVAL * 1000,
                skip: selectedMarket === undefined,
            }
        );

    const handleSelectedMarket = useCallback(
        (market: TMarketMeta) => {
            dispatch(
                setSelectedMarket({ widgetHash: moduleData.hash, market })
            );
        },

        [dispatch, moduleData.hash]
    );
    const handleSelectedChartRange = useCallback(
        (chartRange: TChartRange) => {
            dispatch(
                setSelectedChartRange({
                    widgetHash: moduleData.hash,
                    chartRange,
                })
            );
        },

        [dispatch, moduleData.hash]
    );

    /**
     * if user searches for some keyword and tags are included, automatically set the selected market
     * to some market that matches this new keyword, if any.
     * recall: currently market data should include a single tag per coin
     */
    useEffect(() => {
        if (
            lastSelectedKeyword &&
            tags?.find((t) => t.id === lastSelectedKeyword.tag.id)
        ) {
            const newMarketFromSearch = coinsData.find((marketMeta) => {
                // marketMeta.tags can be [] (an empty array)
                return marketMeta.tags?.find(
                    (t) => t.id === lastSelectedKeyword.tag.id
                );
            });
            if (newMarketFromSearch) {
                handleSelectedMarket(newMarketFromSearch);
            }
        }
    }, [lastSelectedKeyword, coinsData, tags, handleSelectedMarket]);

    return (
        <MarketModule
            isLoading={isLoadingCoinsData}
            isLoadingHistory={isLoadingHistory}
            isAuthenticated={isAuthenticated}
            availableMarkets={coinsData}
            selectedMarket={selectedMarket}
            onSelectMarket={handleSelectedMarket}
            selectedMarketHistory={marketHistory}
            selectedChartRange={selectedChartRange}
            onSelectChartRange={handleSelectedChartRange}
            selectedChartType={selectedChartType || EChartType.Line}
            onSelectChartType={onSelectChartType}
            pinnedCoins={pinnedCoins}
            onTogglePin={async (coin: TBaseEntity) => {
                try {
                    if (!isAuthenticated) {
                        toast(
                            globalMessages.callToAction.signUpToBookmark(
                                "coins"
                            )
                        );
                        return;
                    }
                    const isPreviouslyPinned = !!pinnedCoins.find(
                        (c) => c.id === coin.id
                    );
                    await togglePinMut({ coinId: coin.id }).unwrap();
                    toast(
                        `${coin.name} has been ${
                            isPreviouslyPinned ? "unpinned" : "pinned"
                        } successfully`
                    );
                } catch (e) {
                    Logger.error("MarketContainer::onTogglePin", e);
                    toast("Something went wrong, please try again later", {
                        type: EToastRole.Error,
                    });
                }
            }}
        />
    );
};

export default MarketContainer;
