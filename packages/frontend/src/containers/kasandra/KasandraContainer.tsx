import { FC, useEffect, useMemo, useCallback, Suspense, useState } from "react";
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
import { TChartRange, TCoin } from "src/api/types";

import KasandraModule from "src/components/kasandra/KasandraModule";
import { TMarketMeta } from "src/components/kasandra/types";
import { ModuleLoader } from "src/components/moduleLoader/ModuleLoader";
import CONFIG from "src/config";
import { EWidgetSettingsRegistry } from "src/constants";
import { IModuleContainer } from "src/types";
import BaseContainer from "../base/BaseContainer";

const mockSystemPrompt = `
Analyze the following cryptocurrency data and predict the price movements.

Current Market Data:
- Coin: {coin.name} ({coin.symbol.upper()})
- Current Price: {current_price:.4f}
- Market Cap: {market_cap:,.0f}
- 24h Volume: {volume_24h:,.0f}
- 24h Change: {price_change_24h:.2f}%
- 7d Change: {price_change_7d:.2f}%
- 30d Change: {price_change_30d:.2f}%

Historical Analysis:
{chr(10).join(historical_context)}
{formatted_references}

Target Prediction:
- Prediction Date: {target_date.strftime('%Y-%m-%d')}
- Prediction Interval: {prediction_interval}

Based on the historical data, technical indicators, current market conditions, and any relevant news, provide price predictions for OPTIMISTIC, BASELINE, and PESSIMISTIC scenarios in the following JSON format:

{{
  "predictions": [
    {{
      "case": "optimistic",
      "predicted_price": <predicted price in optimistic scenario>,
      "price_percent_change": <percentage change from current price>,
      "probability": <probability of this scenario 0-100>
    }},
    {{
      "case": "baseline", 
      "predicted_price": <predicted price in baseline scenario>,
      "price_percent_change": <percentage change from current price>,
      "probability": <probability of this scenario 0-100>
    }},
    {{
      "case": "pessimistic",
      "predicted_price": <predicted price in pessimistic scenario>,
      "price_percent_change": <percentage change from current price>,
      "probability": <probability of this scenario 0-100>
    }}
  ],
  "most_likely_scenario": "<optimistic, baseline, or pessimistic>",
  "confidence_level": "<high, medium, or low>",
  "technical_analysis": {{
    "overall_trend": "<optimistic, pessimistic, or baseline>",
    "support_levels": [<list of 2-3 support price levels>],
    "resistance_levels": [<list of 2-3 resistance price levels>],
    "key_indicators": [<list of 3-5 key technical/fundamental indicators to watch>]
  }}
}}

Ensure your predictions are data-driven and the probabilities across all scenarios sum to 100.

`;

const KasandraContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const dispatch = useAppDispatch();
    const prevSelectedMarketData = useAppSelector(
        (state) => state.widgets.kasandra?.[moduleData.hash]
    );
    const WIDGET_HEIGHT = useWidgetHeight(moduleData);

    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const [prompts, setPrompts] = useState({
        system: mockSystemPrompt,
        user: "",
    });

    const selectedTimestamp = useAppSelector(
        (state) => state.widgets.kasandra?.[moduleData.hash]?.selectedTimestamp
    );

    const selectedChartRange = useMemo(
        () =>
            prevSelectedMarketData?.selectedChartRange ||
            CONFIG.WIDGETS.MARKET.DEFAULT_INTERVAL,
        [prevSelectedMarketData?.selectedChartRange]
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
                return marketMeta.tags?.[0]?.id === lastSelectedKeyword.tag.id;
            });
            if (newMarketFromSearch) {
                handleSelectedMarket(newMarketFromSearch);
            }
        }
    }, [lastSelectedKeyword, kasandraCoins, tags, handleSelectedMarket]);

    const contentHeight = useMemo(() => {
        return `${WIDGET_HEIGHT}px`;
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
            promptProps={{
                prompts,
                onPromptsChange: (p) => {
                    setPrompts(p);
                },
                selectedMarket,
                selectedChartRange,
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
                fallback={<ModuleLoader $height={contentHeight} />} // 40px is the height of the header
            >
                <KasandraModule
                    isLoading={isLoadingKasandraCoins}
                    isLoadingHistory={isLoadingHistory}
                    isLoadingPredictions={isLoadingPredictions}
                    insights={insights || undefined}
                    selectedPredictions={predictions || undefined}
                    selectedMarketHistory={marketHistory}
                    selectedChartRange={selectedChartRange}
                    onSelectChartRange={handleSelectedChartRange}
                    selectedMarket={selectedMarket}
                    isAuthenticated={isAuthenticated}
                    supportedCoins={kasandraCoins}
                    onSelectMarket={handleSelectedMarket}
                    contentHeight={contentHeight}
                    selectedTimestamp={selectedTimestamp}
                    onSelectDataPoint={handleselectedTimestamp}
                />
            </Suspense>
        </BaseContainer>
    );
};

export default KasandraContainer;
