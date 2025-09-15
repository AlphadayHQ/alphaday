import { type FC, useMemo, useState } from "react";
import { ModuleLoader } from "@alphaday/ui-kit";
import { TCoin, TKeyword } from "src/api/types";
import { HeatmapFilters } from "./HeatmapFilters";
import { HeatmapGrid } from "./HeatmapGrid";
import { EHeatmapColorMetric, EHeatmapSizeMetric } from "./types";

interface IMarketHeatmap {
    data: TCoin[];
    isLoading: boolean;
    onCoinClick: (coin: TCoin) => void;
    keywordSearchList: TKeyword[];
}

export const MarketHeatmap: FC<IMarketHeatmap> = ({
    data,
    isLoading,
    onCoinClick,
    keywordSearchList,
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

        return (
            data
                // .sort((a, b) => b.market_cap - a.market_cap)
                .slice(0, maxItems)
        );
    }, [data, maxItems]);

    if (isLoading) {
        return <ModuleLoader $height="400px" />;
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
                    keywordSearchList={keywordSearchList}
                />
            </div>
        </div>
    );
};
