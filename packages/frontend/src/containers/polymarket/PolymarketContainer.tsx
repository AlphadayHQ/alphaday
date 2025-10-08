import { FC, useMemo, useCallback, Suspense, useState } from "react";
import { useWidgetHeight } from "src/api/hooks";
import { useCustomAnalytics } from "src/api/hooks/useCustomAnalytics";
import { useGetPolymarketMarketsQuery } from "src/api/services";
import type { TPolymarketMarket } from "src/api/services/polymarket/types";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import {
    selectPolymarketFilter,
    setPolymarketFilter,
} from "src/api/store/slices/widgets";
import * as filterUtils from "src/api/utils/filterUtils";
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
                active: true, // Default to showing active markets
                ordering: "-total_volume", // Order by volume descending
                tags: tags ? filterUtils.filteringListToStr(tags) : undefined,
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
            window.open(market.url, "_blank", "noopener,noreferrer");
        },
        [logButtonClicked, moduleData.name]
    );

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
