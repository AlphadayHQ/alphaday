import { FC, useMemo, useCallback, Suspense } from "react";
import { useWidgetHeight } from "src/api/hooks";
import { useCustomAnalytics } from "src/api/hooks/useCustomAnalytics";
import { useGetPolymarketMarketByTopVolumeQuery } from "src/api/services";
import type { TPolymarketMarket } from "src/api/services/polymarket/types";
import { useAppSelector } from "src/api/store/hooks";
import { selectPolymarketFilter } from "src/api/store/slices/widgets";
import * as filterUtils from "src/api/utils/filterUtils";
import { ModuleLoader } from "src/components/moduleLoader/ModuleLoader";
import PolymarketTopVolumeModule from "src/components/polymarket/PolymarketTopVolumeModule";
import { EPolymarketFilter } from "src/components/polymarket/types";
import CONFIG from "src/config";
import { EWidgetSettingsRegistry } from "src/constants";
import type { IModuleContainer } from "src/types";

const PolymarketTopVolumeContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const WIDGET_HEIGHT = useWidgetHeight(moduleData);
    const selectedFilter = useAppSelector(
        selectPolymarketFilter(moduleData.hash)
    );
    const { logButtonClicked } = useCustomAnalytics();

    const tagsSettings = moduleData.settings.filter(
        (s) =>
            s.widget_setting.setting.slug ===
            EWidgetSettingsRegistry.IncludedTags
    );
    const tags =
        tagsSettings[0] !== undefined ? tagsSettings[0].tags : undefined;

    const tagsString = useMemo(
        () => (tags ? filterUtils.filteringListToStr(tags) : undefined),
        [tags]
    );

    const pollingInterval =
        (moduleData.widget.refresh_interval ||
            CONFIG.WIDGETS.POLYMARKET.POLLING_INTERVAL) * 1000;

    const { data: marketGroupData, isLoading: isLoadingTopVolume } =
        useGetPolymarketMarketByTopVolumeQuery(
            {
                page: 1,
                limit: 1,
                active: true,
                search: tagsString,
            },
            {
                pollingInterval,
            }
        );

    console.log("marketGroupData", marketGroupData);

    const handleSelectMarket = useCallback(
        (market: TPolymarketMarket) => {
            logButtonClicked({
                buttonName: "polymarket-top-volume",
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

    return (
        <Suspense fallback={<ModuleLoader $height={contentHeight} />}>
            <PolymarketTopVolumeModule
                isLoading={isLoadingTopVolume}
                marketGroupData={marketGroupData}
                onSelectMarket={handleSelectMarket}
                contentHeight={contentHeight}
                selectedFilter={selectedFilter || EPolymarketFilter.Active}
            />
        </Suspense>
    );
};

export default PolymarketTopVolumeContainer;
