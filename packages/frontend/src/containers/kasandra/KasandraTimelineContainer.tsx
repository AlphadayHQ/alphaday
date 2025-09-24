import { FC, useEffect, useCallback, useMemo } from "react";
import { useFeatureFlags, useView, useWidgetHeight } from "src/api/hooks";
import { useCustomAnalytics } from "src/api/hooks/useCustomAnalytics";
import {
    useGetKasandraCoinsQuery,
    useOpenNewsItemMutation,
} from "src/api/services";
import { useGetInsightsQuery } from "src/api/services/kasandra/kasandraEndpoints";
import { selectKasandraData, setKasandraData } from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import * as userStore from "src/api/store/slices/user";
import { EItemFeedPreference, TCoin, TKasandraCase } from "src/api/types";
import { Logger } from "src/api/utils/logging";

import KasandraTimelineModule from "src/components/kasandra/KasandraTimelineModule";
import { TMarketMeta } from "src/components/market/types";
import CONFIG from "src/config";
import { EFeaturesRegistry, ETemplateNameRegistry } from "src/constants";
import { IModuleContainer } from "src/types";

const KasandraTimelineContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(userStore.selectIsAuthenticated);
    const { logButtonClicked } = useCustomAnalytics();

    const { enabled: isKasandraHistoryAllowed } = useFeatureFlags(
        EFeaturesRegistry.KasandraHistory
    );

    const { selectedView } = useView();

    const KasandraWidgetTemplateSlug = `${ETemplateNameRegistry.Kasandra.toLowerCase()}_template`;
    const kasandraModuleDataHash = useMemo(() => {
        const widgetData = selectedView?.data.widgets.find(
            (w) => w.widget.template.slug === KasandraWidgetTemplateSlug
        );
        return widgetData?.hash;
    }, [KasandraWidgetTemplateSlug, selectedView?.data.widgets]);

    const kasandraModuleHash = useMemo(() => {
        return kasandraModuleDataHash || moduleData.hash;
    }, [kasandraModuleDataHash, moduleData.hash]);

    const prevSelectedMarketData = useAppSelector(
        (state) => state.widgets.kasandra?.[kasandraModuleHash]
    );

    const selectedTimestamp = useAppSelector(
        (state) =>
            state.widgets.kasandra?.[kasandraModuleHash]?.selectedTimestamp
    );

    const selectedCase = useMemo(
        () =>
            prevSelectedMarketData?.selectedCase ||
            CONFIG.WIDGETS.KASANDRA_TIMELINE.DEFAULT_SELECTED_CASE,
        [prevSelectedMarketData?.selectedCase]
    );

    const disclaimerAccepted = useMemo(
        () =>
            prevSelectedMarketData?.disclaimerAccepted ??
            CONFIG.WIDGETS.KASANDRA_TIMELINE.DEFAULT_DISCLAIMER_ACCEPTED,
        [prevSelectedMarketData?.disclaimerAccepted]
    );

    const widgetHeight = useWidgetHeight(moduleData);

    const feedPreference =
        useAppSelector(selectKasandraData(moduleData.hash))?.feedPreference ??
        CONFIG.WIDGETS.KASANDRA_TIMELINE.DEFAULT_FEED_PREFERENCE;

    const setFeedPreference = useCallback(
        (preference: EItemFeedPreference) => {
            dispatch(
                setKasandraData({
                    widgetHash: moduleData.hash,
                    feedPreference: preference,
                })
            );
        },
        [dispatch, moduleData.hash]
    );

    // const tagsSettings = moduleData.settings.filter(
    //     (s) =>
    //         s.widget_setting.setting.slug ===
    //         EWidgetSettingsRegistry.IncludedTags
    // );

    // const tagsRef = useRef<TBaseTag[]>();

    // const tags =
    //     tagsSettings[0] !== undefined ? tagsSettings[0].tags : undefined;

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

    const selectedChartRange = useMemo(
        () =>
            prevSelectedMarketData?.selectedChartRange ||
            CONFIG.WIDGETS.KASANDRA.DEFAULT_INTERVAL,
        [prevSelectedMarketData?.selectedChartRange]
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

    const { data: insights, isFetching: isLoadingInsights } =
        useGetInsightsQuery({
            coin: selectedMarket?.slug,
            interval: selectedChartRange,
            limit: 30,
            type: isKasandraHistoryAllowed ? undefined : "prediction",
        });

    const logData = useMemo(() => {
        return {
            selectedTimestamp: selectedTimestamp ?? 0,
            widgetName: moduleData.name,
            case: selectedCase.name,
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
            dispatch(
                setKasandraData({
                    widgetHash: kasandraModuleHash,
                    market,
                })
            );
            logButtonClicked({
                buttonName: "kasandra-coin",
                data: {
                    ...logData,
                    marketId: market.id,
                    marketTicker: market.ticker,
                },
            });
        },

        [dispatch, kasandraModuleHash, logButtonClicked, logData]
    );

    const [openItemMut] = useOpenNewsItemMutation();

    const onOpenItem = async (id: number) => {
        if (openItemMut !== undefined) {
            await openItemMut({
                id,
            });
        }
    };

    const handleSelectedTimestamp = useCallback(
        (timestamp: number) => {
            dispatch(
                setKasandraData({
                    widgetHash: kasandraModuleHash,
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
        [dispatch, kasandraModuleHash, logButtonClicked, logData]
    );

    const handleSelectedCase = useCallback(
        (kase: TKasandraCase) => {
            Logger.debug("Kasandra timeline selectedCase", kase);
            dispatch(
                setKasandraData({
                    widgetHash: kasandraModuleHash,
                    case: kase,
                })
            );
            logButtonClicked({
                buttonName: "kasandra-case",
                data: {
                    ...logData,
                    case: kase.name,
                },
            });
        },
        [dispatch, kasandraModuleHash, logButtonClicked, logData]
    );

    const handleAcceptDisclaimer = useCallback(() => {
        dispatch(
            setKasandraData({
                widgetHash: kasandraModuleHash,
                disclaimerAccepted: true,
            })
        );
        logButtonClicked({
            buttonName: "kasandra-disclaimer",
            data: {
                widgetName: moduleData.name,
            },
        });
    }, [dispatch, kasandraModuleHash, logButtonClicked, moduleData.name]);

    useEffect(() => {
        if (
            !isAuthenticated &&
            feedPreference === EItemFeedPreference.Bookmark
        ) {
            setFeedPreference(EItemFeedPreference.Last);
        }
        // we do not want to track `setFeedPreference`
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [feedPreference, isAuthenticated]);

    if (feedPreference !== undefined) {
        return (
            <KasandraTimelineModule
                isLoadingItems={isLoadingInsights && isLoadingKasandraCoins}
                items={insights}
                selectedMarket={selectedMarket}
                selectedCase={selectedCase}
                onSelectCase={handleSelectedCase}
                feedPreference={feedPreference}
                onSetFeedPreference={setFeedPreference}
                supportedCoins={kasandraCoins}
                onSelectMarket={handleSelectedMarket}
                widgetHeight={widgetHeight}
                onClick={onOpenItem}
                isAuthenticated={isAuthenticated}
                selectedTimestamp={selectedTimestamp}
                selectedChartRange={selectedChartRange}
                onSelectDataPoint={handleSelectedTimestamp}
                disclaimerAccepted={disclaimerAccepted}
                onAcceptDisclaimer={handleAcceptDisclaimer}
            />
        );
    }
    return null;
};

export default KasandraTimelineContainer;
