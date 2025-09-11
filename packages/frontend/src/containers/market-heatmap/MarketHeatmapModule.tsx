import { FC, useCallback, useMemo, useState } from "react";
import { BaseModuleWrapper, ModuleLoader } from "@alphaday/ui-kit";
import { useWidgetHeight, useHistory } from "src/api/hooks";
import { useGetMarketDataQuery } from "src/api/services";
import type { TRemoteCoinData } from "src/api/services/market/types";
import BOARDS from "src/config/boards";
import { EWidgetSettingsRegistry } from "src/constants";
import type { IModuleContainer } from "src/types";
import { MarketHeatmap } from "./components/MarketHeatmap";

export const MarketHeatmapModule: FC<IModuleContainer> = ({ moduleData }) => {
    const widgetHeight = useWidgetHeight(moduleData);
    const history = useHistory();

    const [maxItems] = useState(50);

    const tagsSettings = moduleData.settings.filter(
        (s) =>
            s.widget_setting.setting.slug ===
            EWidgetSettingsRegistry.IncludedTags
    );

    const tags = tagsSettings[0]?.tags;
    const tagsStr = tags?.map((tag) => tag.slug).join(",");

    const {
        currentData: data,
        isLoading,
        isError,
    } = useGetMarketDataQuery({
        tags: tagsStr,
        limit: maxItems,
    });

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

    // Transform the data to match TRemoteCoinData structure
    const transformedData = useMemo(() => {
        if (!data?.results) return [];
        return data.results.map((coinMarket) => ({
            id: coinMarket.id,
            coin: {
                id: coinMarket.coin.id,
                name: coinMarket.coin.name,
                ticker: coinMarket.coin.ticker,
                slug: coinMarket.coin.slug,
                icon: coinMarket.coin.icon,
                description: coinMarket.coin.description,
                price: coinMarket.coin.price,
                max_supply: undefined,
                circulating_supply: undefined,
                total_supply: undefined,
                rank: coinMarket.coin.rank,
                gecko_id: undefined,
                cmc_id: undefined,
                is_pinned: coinMarket.coin.pinned,
                market_cap: coinMarket.coin.marketCap,
                volume: coinMarket.coin.volume || 0,
                price_percent_change_24h: coinMarket.coin.percentChange24h,
                project: undefined,
                tags: [],
            },
            currency: coinMarket.currency,
            price: coinMarket.price,
            price_percent_change_24h: coinMarket.percentChange24h,
            price_percent_change_7d: coinMarket.percentChange7d,
            volume: coinMarket.volume,
            volume_change_24h: coinMarket.volumeChange24h,
            market_cap: coinMarket.marketCap,
            date: coinMarket.date,
        }));
    }, [data]);

    return (
        <BaseModuleWrapper height={widgetHeight}>
            {isLoading && <ModuleLoader $height="600px" />}
            {isError && (
                <div className="flex items-center justify-center h-full text-primaryVariant100">
                    Failed to load market data
                </div>
            )}
            {data && (
                <MarketHeatmap
                    data={transformedData}
                    isLoading={isLoading}
                    onCoinClick={handleCoinClick}
                />
            )}
        </BaseModuleWrapper>
    );
};
