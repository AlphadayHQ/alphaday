import { FC, useMemo } from "react";
import { BaseModuleWrapper, ModuleLoader } from "@alphaday/ui-kit";
import type { TGetMarketDataResponse } from "src/api/services";
import type { TRemoteCoinData } from "src/api/services/market/types";
import { MarketHeatmap } from "src/components/market-heatmap/MarketHeatmap";

interface IMarketHeatmapModule {
    data: TGetMarketDataResponse | undefined;
    isLoading: boolean;
    isError: boolean;
    widgetHeight: number;
    onCoinClick: (coinData: TRemoteCoinData) => void;
}

export const MarketHeatmapModule: FC<IMarketHeatmapModule> = ({
    data,
    isLoading,
    isError,
    widgetHeight,
    onCoinClick,
}) => {
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
                    onCoinClick={onCoinClick}
                />
            )}
        </BaseModuleWrapper>
    );
};
