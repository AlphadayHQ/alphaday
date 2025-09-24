import { FC, useEffect, useMemo, useCallback, Suspense } from "react";
import {
    useFeatureFlags,
    useGlobalSearch,
    useWidgetHeight,
} from "src/api/hooks";
import { useCustomAnalytics } from "src/api/hooks/useCustomAnalytics";
import {
    useGetKasandraCoinsQuery,
    useGetMarketHistoryQuery,
} from "src/api/services";
import {
    useGetFlakeOffDataQuery,
    useGetInsightsQuery,
    useGetPredictionsQuery,
} from "src/api/services/kasandra/kasandraEndpoints";
import { selectIsAuthenticated, setKasandraData } from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import {
    EPredictionCase,
    TChartRange,
    TCoin,
    TKasandraCase,
} from "src/api/types";

import KasandraModule from "src/components/kasandra/KasandraModule";
import { TMarketMeta } from "src/components/kasandra/types";
import { ModuleLoader } from "src/components/moduleLoader/ModuleLoader";
import CONFIG from "src/config";
import { EFeaturesRegistry, EWidgetSettingsRegistry } from "src/constants";
import { IModuleContainer } from "src/types";
import BaseContainer from "../base/BaseContainer";

const KasandraContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const dispatch = useAppDispatch();
    const prevSelectedMarketData = useAppSelector(
        (state) => state.widgets.kasandra?.[moduleData.hash]
    );
    const WIDGET_HEIGHT = useWidgetHeight(moduleData);

    const { enabled: isKasandraHistoryAllowed } = useFeatureFlags(
        EFeaturesRegistry.KasandraHistory
    );

    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const { logButtonClicked } = useCustomAnalytics();

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
        type: isKasandraHistoryAllowed ? undefined : "prediction",
        limit: 30,
    });

    const { data: flakeOffData } = useGetFlakeOffDataQuery(
        {
            coin: selectedMarket?.slug || "bitcoin",
            interval: selectedChartRange,
            case:
                selectedCase.id === "all"
                    ? undefined
                    : (selectedCase.id as EPredictionCase),
        },
        { skip: selectedMarket === undefined }
    );

    const logData = useMemo(() => {
        return {
            selectedTimestamp: selectedTimestamp ?? 0,
            widgetName: moduleData.name,
            case: selectedCase,
            chartRange: selectedChartRange,
            marketId: selectedMarket?.id,
            marketTicker: selectedMarket?.ticker,
        };
    }, [
        moduleData.name,
        selectedCase,
        selectedChartRange,
        selectedMarket?.id,
        selectedMarket?.ticker,
        selectedTimestamp,
    ]);

    const handleSelectedMarket = useCallback(
        (market: TMarketMeta) => {
            dispatch(setKasandraData({ widgetHash: moduleData.hash, market }));
            logButtonClicked({
                buttonName: "kasandra-coin",
                data: {
                    ...logData,
                    marketId: market.id,
                    marketTicker: market.ticker,
                },
            });
        },

        [dispatch, logButtonClicked, logData, moduleData.hash]
    );

    const handleSelectedChartRange = useCallback(
        (chartRange: TChartRange) => {
            dispatch(
                setKasandraData({
                    widgetHash: moduleData.hash,
                    chartRange,
                })
            );
            logButtonClicked({
                buttonName: "kasandra-date-range",
                data: {
                    ...logData,
                    chartRange,
                },
            });
        },

        [dispatch, logButtonClicked, logData, moduleData.hash]
    );

    const handleSelectedCase = useCallback(
        (kase: TKasandraCase) => {
            dispatch(
                setKasandraData({ widgetHash: moduleData.hash, case: kase })
            );
            logButtonClicked({
                buttonName: "kasandra-case",
                data: {
                    ...logData,
                    case: kase,
                },
            });
        },
        [dispatch, logButtonClicked, logData, moduleData.hash]
    );

    const handleSelectedTimestamp = useCallback(
        (timestamp: number) => {
            dispatch(
                setKasandraData({
                    widgetHash: moduleData.hash,
                    timestamp,
                })
            );
            logButtonClicked({
                buttonName: "kasandra-datapoint",
                data: {
                    ...logData,
                    selectedTimestamp: timestamp,
                },
            });
        },
        [dispatch, logButtonClicked, logData, moduleData.hash]
    );

    const handleAcceptDisclaimer = useCallback(() => {
        dispatch(
            setKasandraData({
                widgetHash: moduleData.hash,
                disclaimerAccepted: true,
            })
        );
        logButtonClicked({
            buttonName: "kasandra-disclaimer",
            data: {
                widgetName: moduleData.name,
            },
        });
    }, [dispatch, logButtonClicked, moduleData.hash, moduleData.name]);

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
                dispatch(
                    setKasandraData({
                        widgetHash: moduleData.hash,
                        market: newMarketFromSearch,
                    })
                );
            }
        }
    }, [lastSelectedKeyword, kasandraCoins, tags, dispatch, moduleData.hash]);

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
                    flakeOffData={flakeOffData || undefined}
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
                    onSelectDataPoint={handleSelectedTimestamp}
                    disclaimerAccepted={disclaimerAccepted}
                    onAcceptDisclaimer={handleAcceptDisclaimer}
                />
            </Suspense>
        </BaseContainer>
    );
};

export default KasandraContainer;
