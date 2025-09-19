import { FC, useMemo, useCallback } from "react";
import { useSelectedCoin } from "src/api/hooks";
import {
    useGetCoinsQuery,
    useGetMarketHistoryQuery,
    useGetPinnedCoinsQuery,
    useTogglePinnedCoinMutation,
} from "src/api/services";
import {
    setSelectedChartRange,
    selectSelectedChartType,
    setSelectedChartType,
} from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import { selectIsAuthenticated } from "src/api/store/slices/user";
import { TBaseEntity, TChartRange } from "src/api/types";
import { filteringListToStr } from "src/api/utils/filterUtils";
import { Logger } from "src/api/utils/logging";
import { EToastRole, toast } from "src/api/utils/toastUtils";
import MarketModule from "src/components/market/MarketModule";
import { EChartType } from "src/components/market/types";
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

    const {
        selectedCoin: selectedMarket,
        handleSelectedCoin: handleSelectedMarket,
    } = useSelectedCoin(moduleData.hash, coinsData, pinnedCoins, tags);

    const { currentData: marketHistory, isFetching: isLoadingHistory } =
        useGetMarketHistoryQuery(
            {
                coin: selectedMarket?.slug || "",
                interval: selectedChartRange,
            },
            {
                pollingInterval:
                    CONFIG.WIDGETS.MARKET.HISTORY_POLLING_INTERVAL * 1000,
                skip: selectedMarket === undefined || !selectedMarket.slug,
            }
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
