import { FC, useEffect, useMemo, useCallback, Suspense } from "react";
import { useGlobalSearch, useWidgetHeight } from "src/api/hooks";
import {
    useGetKasandraCoinsQuery,
    useGetMarketHistoryQuery,
} from "src/api/services";
import {
    useGetInsightsQuery,
    useGetPredictionsQuery,
} from "src/api/services/kasandra/kasandraEndpoints";
import { selectIsAuthenticated, setKasandraData } from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import { TChartRange, TCoin, TKasandraCase } from "src/api/types";

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
        (state) => state.widgets.kasandra?.[moduleData.hash]
    );
    const WIDGET_HEIGHT = useWidgetHeight(moduleData);

    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const selectedTimestamp = useAppSelector(
        (state) => state.widgets.kasandra?.[moduleData.hash]?.selectedTimestamp
    );

    const selectedChartRange = useMemo(
        () =>
            prevSelectedMarketData?.selectedChartRange ||
            CONFIG.WIDGETS.KASANDRA.DEFAULT_INTERVAL,
        [prevSelectedMarketData?.selectedChartRange]
    );

    const selectedCase = useMemo(
        () =>
            prevSelectedMarketData?.selectedCase ||
            CONFIG.WIDGETS.KASANDRA.DEFAULT_SELECTED_CASE,
        [prevSelectedMarketData?.selectedCase]
    );

    const disclaimerAccepted = useMemo(
        () =>
            prevSelectedMarketData?.disclaimerAccepted ??
            CONFIG.WIDGETS.KASANDRA.DEFAULT_DISCLAIMER_ACCEPTED,
        [prevSelectedMarketData?.disclaimerAccepted]
    );

    const { lastSelectedKeyword } = useGlobalSearch();

    const tagsSettings = moduleData.settings.filter(
        (s) =>
            s.widget_setting.setting.slug ===
            EWidgetSettingsRegistry.IncludedTags
    );
    const tags =
        tagsSettings[0] !== undefined ? tagsSettings[0].tags : undefined;

    const pollingInterval =
        (moduleData.widget.refresh_interval ||
            CONFIG.WIDGETS.KASANDRA.COINS_QUERY_HARD_LIMIT) * 1000;

    const { data: kasandraCoinsData, isLoading: isLoadingKasandraCoins } =
        useGetKasandraCoinsQuery(
            {
                // tags: tags ? filteringListToStr(tags) : undefined,
                limit: CONFIG.WIDGETS.MARKET.QUERY_HARD_LIMIT,
            },
            {
                pollingInterval,
            }
        );

    const kasandraCoins = useMemo(
        () => kasandraCoinsData?.results || [],
        [kasandraCoinsData]
    );

    const selectedMarket: TCoin | undefined = useMemo(() => {
        const storedMarket = kasandraCoins.find(
            (c) => c.id === prevSelectedMarketData?.selectedMarket?.id
        );

        return storedMarket ?? kasandraCoins[0] ?? undefined;
    }, [prevSelectedMarketData?.selectedMarket, kasandraCoins]);

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

    const { currentData: predictions, isFetching: isLoadingPredictions } =
        useGetPredictionsQuery(
            {
                coin: selectedMarket?.slug,
                interval: selectedChartRange,
                limit: 1000,
            },
            {
                pollingInterval:
                    CONFIG.WIDGETS.MARKET.HISTORY_POLLING_INTERVAL * 1000,
                skip: selectedMarket === undefined,
            }
        );

    const { data: insights } = useGetInsightsQuery({
        coin: selectedMarket?.slug,
        interval: selectedChartRange,
        limit: 24,
    });

    const handleSelectedMarket = useCallback(
        (market: TMarketMeta) => {
            dispatch(setKasandraData({ widgetHash: moduleData.hash, market }));
        },

        [dispatch, moduleData.hash]
    );

    const handleSelectedChartRange = useCallback(
        (chartRange: TChartRange) => {
            dispatch(
                setKasandraData({
                    widgetHash: moduleData.hash,
                    chartRange,
                })
            );
        },

        [dispatch, moduleData.hash]
    );

    const handleSelectedCase = useCallback(
        (kase: TKasandraCase) => {
            dispatch(
                setKasandraData({ widgetHash: moduleData.hash, case: kase })
            );
        },
        [dispatch, moduleData.hash]
    );

    const handleselectedTimestamp = useCallback(
        (timestamp: number) => {
            dispatch(
                setKasandraData({
                    widgetHash: moduleData.hash,
                    timestamp,
                })
            );
        },
        [dispatch, moduleData.hash]
    );

    const handleAcceptDisclaimer = useCallback(() => {
        dispatch(
            setKasandraData({
                widgetHash: moduleData.hash,
                disclaimerAccepted: true,
            })
        );
    }, [dispatch, moduleData.hash]);

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
            const newMarketFromSearch = kasandraCoins.find((marketMeta) => {
                // marketMeta.tags can be [] (an empty array)
                return marketMeta.tags?.find(
                    (t) => t.id === lastSelectedKeyword.tag.id
                );
            });
            if (newMarketFromSearch) {
                handleSelectedMarket(newMarketFromSearch);
            }
        }
    }, [lastSelectedKeyword, kasandraCoins, tags, handleSelectedMarket]);

    const contentHeight = useMemo(() => {
        return `${WIDGET_HEIGHT - 55}px`;
    }, [WIDGET_HEIGHT]);

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
            moduleData={moduleData}
            adjustable={false}
        >
            <Suspense
                fallback={<ModuleLoader $height={contentHeight} />} // 40px is the height of the header
            >
                <KasandraModule
                    isLoading={isLoadingKasandraCoins}
                    isLoadingHistory={isLoadingHistory}
                    isLoadingPredictions={isLoadingPredictions}
                    insights={insights || undefined}
                    selectedPredictions={predictions || undefined}
                    selectedMarketHistory={marketHistory}
                    selectedCase={selectedCase}
                    onSelectCase={handleSelectedCase}
                    selectedChartRange={selectedChartRange}
                    onSelectChartRange={handleSelectedChartRange}
                    selectedMarket={selectedMarket}
                    isAuthenticated={isAuthenticated}
                    supportedCoins={kasandraCoins}
                    onSelectMarket={handleSelectedMarket}
                    contentHeight={contentHeight}
                    selectedTimestamp={selectedTimestamp}
                    onSelectDataPoint={handleselectedTimestamp}
                    disclaimerAccepted={disclaimerAccepted}
                    onAcceptDisclaimer={handleAcceptDisclaimer}
                />
            </Suspense>
        </BaseContainer>
    );
};

export default KasandraContainer;
