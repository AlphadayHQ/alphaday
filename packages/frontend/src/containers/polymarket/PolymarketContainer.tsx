import { FC, useEffect, useMemo, useCallback, Suspense, useState } from "react";
import { useGlobalSearch, useWidgetHeight } from "src/api/hooks";
import { useCustomAnalytics } from "src/api/hooks/useCustomAnalytics";
import { useGetPolymarketMarketsQuery } from "src/api/services";

import type { TPolymarketMarket } from "src/api/services/polymarket/types";

import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import {
    selectPolymarketFilter,
    setPolymarketFilter,
} from "src/api/store/slices/widgets";
import { ModuleLoader } from "src/components/moduleLoader/ModuleLoader";
import PolymarketModule from "src/components/polymarket/PolymarketModule";
import { EPolymarketFilter } from "src/components/polymarket/types";
import CONFIG from "src/config";
import { EWidgetSettingsRegistry } from "src/constants";
import type { IModuleContainer } from "src/types";

const PolymarketContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const WIDGET_HEIGHT = useWidgetHeight(moduleData);
    const dispatch = useAppDispatch();
    const selectedFilter = useAppSelector(
        selectPolymarketFilter(moduleData.hash)
    );
    const { logButtonClicked } = useCustomAnalytics();
    const { lastSelectedKeyword } = useGlobalSearch();

    const [, setSelectedMarket] = useState<TPolymarketMarket | undefined>();

    const tagsSettings = moduleData.settings.filter(
        (s) =>
            s.widget_setting.setting.slug ===
            EWidgetSettingsRegistry.IncludedTags
    );
    const tags =
        tagsSettings[0] !== undefined ? tagsSettings[0].tags : undefined;

    const pollingInterval =
        (moduleData.widget.refresh_interval ||
            CONFIG.WIDGETS.POLYMARKET.POLLING_INTERVAL) * 1000;

    const { data: marketsData, isLoading: isLoadingMarkets } =
        useGetPolymarketMarketsQuery(
            {
                limit: CONFIG.WIDGETS.POLYMARKET.QUERY_HARD_LIMIT,
                resolved: false, // Default to showing active markets
                ordering: "-total_volume", // Order by volume descending
            },
            {
                pollingInterval,
            }
        );

    const markets = useMemo(() => marketsData?.results || [], [marketsData]);

    const handleSelectMarket = useCallback(
        (market: TPolymarketMarket) => {
            setSelectedMarket(market);
            logButtonClicked({
                buttonName: "polymarket-market",
                data: {
                    widgetName: moduleData.name,
                    marketId: market.id,
                    question: market.question,
                },
            });
            const polymarketUrl = `https://polymarket.com/event/${market.slug}`;
            window.open(polymarketUrl, "_blank", "noopener,noreferrer");
        },
        [logButtonClicked, moduleData.name]
    );

    /**
     * if user searches for some keyword and tags are included, automatically set the selected market
     * to some market that matches this new keyword, if any.
     */
    useEffect(() => {
        if (
            lastSelectedKeyword &&
            tags?.find((t) => t.id === lastSelectedKeyword.tag.id)
        ) {
            const newMarketFromSearch = markets.find((market) => {
                return market.tags?.find(
                    (t) => t.id === lastSelectedKeyword.tag.id
                );
            });
            if (newMarketFromSearch) {
                setSelectedMarket(newMarketFromSearch);
            }
        }
    }, [lastSelectedKeyword, markets, tags]);

    const contentHeight = useMemo(() => {
        return `${WIDGET_HEIGHT - 55}px`;
    }, [WIDGET_HEIGHT]);

    const setSelectedFilter = useCallback(
        (filter: EPolymarketFilter) => {
            dispatch(
                setPolymarketFilter({ widgetHash: moduleData.hash, filter })
            );
        },
        [dispatch, moduleData.hash]
    );

    return (
        <Suspense fallback={<ModuleLoader $height={contentHeight} />}>
            <PolymarketModule
                isLoading={isLoadingMarkets}
                markets={markets}
                onSelectMarket={handleSelectMarket}
                contentHeight={contentHeight}
                selectedFilter={selectedFilter || EPolymarketFilter.Active}
                onSetSelectedFilter={setSelectedFilter}
            />
        </Suspense>
    );
};

export default PolymarketContainer;
