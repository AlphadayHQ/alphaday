import { FC, useMemo } from "react";
import { BaseModuleWrapper, ModuleLoader } from "@alphaday/ui-kit";
import type { TGetCoinsResponse } from "src/api/services";
import { TCoin } from "src/api/types";
import { MarketHeatmap } from "src/components/market-heatmap/MarketHeatmap";

interface IMarketHeatmapModule {
    data: TGetCoinsResponse | undefined;
    isLoading: boolean;
    isError: boolean;
    widgetHeight: number;
    onCoinClick: (coinData: TCoin) => void;
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
        return data.results;
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
