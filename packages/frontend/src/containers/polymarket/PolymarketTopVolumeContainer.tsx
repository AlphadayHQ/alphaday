import { FC, useMemo, useCallback, Suspense } from "react";
import { useWidgetHeight } from "src/api/hooks";
import { useCustomAnalytics } from "src/api/hooks/useCustomAnalytics";
import {
    TPolymarketEvent,
    useGetPolymarketMarketByTopVolumeQuery,
} from "src/api/services";
import * as filterUtils from "src/api/utils/filterUtils";
import { ModuleLoader } from "src/components/moduleLoader/ModuleLoader";
import PolymarketTopVolumeModule from "src/components/polymarket/PolymarketTopVolumeModule";
import CONFIG from "src/config";
import { EWidgetSettingsRegistry } from "src/constants";
import type { IModuleContainer } from "src/types";

const PolymarketTopVolumeContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const WIDGET_HEIGHT = useWidgetHeight(moduleData);
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
            CONFIG.WIDGETS.POLYMARKET_TOP_VOLUME.POLLING_INTERVAL) * 1000;

    const { currentData: event, isFetching: isLoadingTopVolume } =
        useGetPolymarketMarketByTopVolumeQuery(
            {
                page: 1,
                limit: 1,
                active: true,
                tags: tagsString,
            },
            {
                pollingInterval,
            }
        );

    const handleSelectMarket = useCallback(
        (market: TPolymarketEvent["markets"][0]) => {
            logButtonClicked({
                buttonName: "polymarket-top-volume",
                data: {
                    widgetName: moduleData.name,
                    marketId: market.id,
                    question: market.question,
                },
            });
            window.open(event?.url, "_blank", "noopener,noreferrer");
        },
        [logButtonClicked, event?.url, moduleData.name]
    );

    const contentHeight = useMemo(() => {
        return `${WIDGET_HEIGHT - 55}px`;
    }, [WIDGET_HEIGHT]);

    return (
        <Suspense fallback={<ModuleLoader $height={contentHeight} />}>
            <PolymarketTopVolumeModule
                isLoading={isLoadingTopVolume}
                event={event}
                onSelectMarket={handleSelectMarket}
                contentHeight={contentHeight}
            />
        </Suspense>
    );
};

export default PolymarketTopVolumeContainer;
