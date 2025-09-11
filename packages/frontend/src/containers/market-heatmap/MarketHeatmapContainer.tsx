import { type FC, useCallback, useState } from "react";
import { useWidgetHeight, useHistory } from "src/api/hooks";
import { useGetMarketDataQuery } from "src/api/services";
import type { TRemoteCoinData } from "src/api/services/market/types";
import BOARDS from "src/config/boards";
import { EWidgetSettingsRegistry } from "src/constants";
import type { IModuleContainer } from "src/types";
import { MarketHeatmapModule } from "./MarketHeatmapModule";

const MarketHeatmapContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const widgetHeight = useWidgetHeight(moduleData);
    const history = useHistory();
    const [maxItems] = useState(50);

    // Process settings to extract tags
    const tagsSettings = moduleData.settings.filter(
        (s) =>
            s.widget_setting.setting.slug ===
            EWidgetSettingsRegistry.IncludedTags
    );
    const tags = tagsSettings[0]?.tags;
    const tagsStr = tags?.map((tag) => tag.slug).join(",");

    // Fetch market data
    const {
        currentData: data,
        isLoading,
        isError,
    } = useGetMarketDataQuery({
        tags: tagsStr,
        limit: maxItems,
    });

    // Handle coin click navigation
    const handleCoinClick = useCallback(
        (coinData: TRemoteCoinData) => {
            const ticker = coinData.coin.ticker.toLowerCase();

            // Find board slug for this coin
            const boardSlugMap = BOARDS.BOARD_SLUG_MAP as Record<
                string,
                string[]
            >;
            const boardSlug = Object.entries(boardSlugMap).find(
                ([, boardSlugs]) => boardSlugs.includes(ticker)
            )?.[0];

            if (boardSlug) {
                history.push(`/b/${boardSlug}`);
            }
        },
        [history]
    );

    return (
        <MarketHeatmapModule
            data={data}
            isLoading={isLoading}
            isError={isError}
            widgetHeight={widgetHeight}
            onCoinClick={handleCoinClick}
        />
    );
};

export default MarketHeatmapContainer;
