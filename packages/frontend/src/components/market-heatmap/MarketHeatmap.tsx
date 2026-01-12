import { type FC, useState } from "react";
import { TCoin, TKeyword } from "src/api/types";
import { HeatmapFilters } from "./HeatmapFilters";
import { HeatmapGrid } from "./HeatmapGrid";
import {
    EHeatmapColorMetric,
    EHeatmapSizeMetric,
    EHeatmapMaxItems,
} from "./types";

interface IMarketHeatmap {
    data: TCoin[];
    onCoinClick: (coin: TCoin) => void;
    keywordSearchList: TKeyword[];
    maxItems: EHeatmapMaxItems;
    onMaxItemsChange: (maxItems: EHeatmapMaxItems) => void;
    height?: number;
}

export const MarketHeatmap: FC<IMarketHeatmap> = ({
    data,
    maxItems,
    onCoinClick,
    keywordSearchList,
    onMaxItemsChange,
    height,
}) => {
    const [sizeMetric, setSizeMetric] = useState<EHeatmapSizeMetric>(
        EHeatmapSizeMetric.MarketCap
    );
    const [colorMetric, setColorMetric] = useState<EHeatmapColorMetric>(
        EHeatmapColorMetric.PriceChange24h
    );

    return (
        <div className="relative flex flex-col h-full">
            <HeatmapFilters
                sizeMetric={sizeMetric}
                colorMetric={colorMetric}
                maxItems={maxItems}
                onSizeMetricChange={setSizeMetric}
                onColorMetricChange={setColorMetric}
                onMaxItemsChange={onMaxItemsChange}
            />
            <div className="flex-1 min-h-0">
                <HeatmapGrid
                    data={data}
                    sizeMetric={sizeMetric}
                    colorMetric={colorMetric}
                    onCoinClick={onCoinClick}
                    keywordSearchList={keywordSearchList}
                    height={height ? height - 39 : undefined} // Adjust for filter height
                />
            </div>
        </div>
    );
};
