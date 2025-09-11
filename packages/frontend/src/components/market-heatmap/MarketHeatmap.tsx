import { type FC, useMemo, useState } from "react";
import type { TRemoteCoinData } from "src/api/services/market/types";
import { HeatmapFilters } from "./HeatmapFilters";
import { HeatmapGrid } from "./HeatmapGrid";
import { EHeatmapColorMetric, EHeatmapSizeMetric } from "./types";

interface IMarketHeatmap {
    data: TRemoteCoinData[];
    isLoading: boolean;
    onCoinClick: (coin: TRemoteCoinData) => void;
}

export const MarketHeatmap: FC<IMarketHeatmap> = ({
    data,
    isLoading,
    onCoinClick,
}) => {
    const [sizeMetric, setSizeMetric] = useState<EHeatmapSizeMetric>(
        EHeatmapSizeMetric.MarketCap
    );
    const [colorMetric, setColorMetric] = useState<EHeatmapColorMetric>(
        EHeatmapColorMetric.PriceChange24h
    );
    const [maxItems, setMaxItems] = useState<number>(50);

    const filteredData = useMemo(() => {
        if (!data) return [];

        return data
            .sort((a, b) => b.market_cap - a.market_cap)
            .slice(0, maxItems);
    }, [data, maxItems]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-primaryVariant100">Loading heatmap...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <HeatmapFilters
                sizeMetric={sizeMetric}
                colorMetric={colorMetric}
                maxItems={50}
                onSizeMetricChange={setSizeMetric}
                onColorMetricChange={setColorMetric}
                onMaxItemsChange={setMaxItems}
            />
            <div className="flex-1 min-h-0">
                <HeatmapGrid
                    data={filteredData}
                    sizeMetric={sizeMetric}
                    colorMetric={colorMetric}
                    onCoinClick={onCoinClick}
                />
            </div>
        </div>
    );
};
