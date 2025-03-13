import { FC, useEffect, useMemo, useCallback, Suspense } from "react";
import { useGlobalSearch, useWidgetHeight } from "src/api/hooks";
import {
    useGetCoinsQuery,
    useGetMarketHistoryQuery,
    useGetPinnedCoinsQuery,
} from "src/api/services";
import { setSelectedMarket } from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import { TCoin } from "src/api/types";
import { filteringListToStr } from "src/api/utils/filterUtils";

import KasandraModule from "src/components/kasandra/KasandraModule";
import { TMarketMeta } from "src/components/kasandra/types";
import { ModuleLoader } from "src/components/moduleLoader/ModuleLoader";
import CONFIG from "src/config";
import { EWidgetSettingsRegistry } from "src/constants";
import { IModuleContainer } from "src/types";
import BaseContainer from "../base/BaseContainer";

const KasandraContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const dispatch = useAppDispatch();
    const prevSelectedMarketData = useAppSelector(
        (state) => state.widgets.market?.[moduleData.hash]
    );
    const WIDGET_HEIGHT = useWidgetHeight(moduleData);

    const selectedChartRange = useMemo(
        () =>
            prevSelectedMarketData?.selectedChartRange ||
            CONFIG.WIDGETS.MARKET.DEFAULT_INTERVAL,
        [prevSelectedMarketData?.selectedChartRange]
    );

    const { lastSelectedKeyword } = useGlobalSearch();

    const { data: pinnedCoinsData } = useGetPinnedCoinsQuery();
    const pinnedCoins = useMemo(
        () => pinnedCoinsData?.results || [],
        [pinnedCoinsData]
    );

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
                return marketMeta.tags?.[0]?.id === lastSelectedKeyword.tag.id;
            });
            if (newMarketFromSearch) {
                handleSelectedMarket(newMarketFromSearch);
            }
        }
    }, [lastSelectedKeyword, coinsData, tags, handleSelectedMarket]);

    // return (
    //     <KasandraModule
    //         isLoading={isLoadingCoinsData}
    //         isLoadingHistory={isLoadingHistory}
    //         selectedMarketHistory={marketHistory}
    //         selectedChartRange={selectedChartRange}
    //     />
    // );

    return (
        <BaseContainer
            uiProps={{
                dragProps: undefined,
                isDragging: false,
                onToggleShowFullSize: undefined,
                allowFullSize: false,
                showFullSize: false,
                setTutFocusElemRef: undefined,
            }}
            // TODO (xavier-charles): revert the code below once backend is ready
            moduleData={{
                ...moduleData,
                name: moduleData.name,
                widget: {
                    ...moduleData.widget,
                    name: moduleData.widget.name,
                },
            }}
            adjustable={false}
        >
            <Suspense
                fallback={<ModuleLoader $height={`${WIDGET_HEIGHT}px`} />}
            >
                <KasandraModule
                    isLoading={isLoadingCoinsData}
                    isLoadingHistory={isLoadingHistory}
                    selectedMarketHistory={marketHistory}
                    selectedChartRange={selectedChartRange}
                />
            </Suspense>
        </BaseContainer>
    );
};

export default KasandraContainer;
