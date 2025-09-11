import type { FC } from "react";
import { TabButton, Select } from "@alphaday/ui-kit";
import { SingleValue } from "react-select";
import {
    EHeatmapSizeMetric,
    EHeatmapColorMetric,
    HEATMAP_MAX_ITEMS_OPTIONS,
    THeatmapMaxItems,
} from "./types";

interface IHeatmapFilters {
    sizeMetric: EHeatmapSizeMetric;
    colorMetric: EHeatmapColorMetric;
    maxItems: THeatmapMaxItems;
    onSizeMetricChange: (metric: EHeatmapSizeMetric) => void;
    onColorMetricChange: (metric: EHeatmapColorMetric) => void;
    onMaxItemsChange: (value: THeatmapMaxItems) => void;
}

export const HeatmapFilters: FC<IHeatmapFilters> = ({
    sizeMetric,
    colorMetric,
    maxItems,
    onSizeMetricChange,
    onColorMetricChange,
    onMaxItemsChange,
}) => {
    const maxItemsOptions = HEATMAP_MAX_ITEMS_OPTIONS.map((option) => ({
        id: option.value.toString(),
        name: option.label,
        icon: (
            <div className="flex items-center justify-center w-6 h-6 text-xs text-primaryVariant100">
                {option.value}
            </div>
        ),
    }));

    const handleMaxItemsChange = (
        option: SingleValue<{ id: string; name: string }>
    ) => {
        if (option) {
            onMaxItemsChange(Number(option.id) as THeatmapMaxItems);
        }
    };

    const selectedMaxItemsOption = maxItemsOptions.find(
        (option) => option.id === maxItems.toString()
    );

    return (
        <div className="p-3 border-b border-borderLine bg-backgroundVariant100">
            <div className="flex flex-wrap gap-4 items-center text-sm">
                <div className="flex items-center gap-2">
                    <span className="text-primaryVariant100">Size:</span>
                    <div className="flex gap-1">
                        <TabButton
                            open={sizeMetric === EHeatmapSizeMetric.MarketCap}
                            onClick={() =>
                                onSizeMetricChange(EHeatmapSizeMetric.MarketCap)
                            }
                            variant="extraSmall"
                            className="capitalize"
                        >
                            Market Cap
                        </TabButton>
                        <TabButton
                            open={sizeMetric === EHeatmapSizeMetric.Volume}
                            onClick={() =>
                                onSizeMetricChange(EHeatmapSizeMetric.Volume)
                            }
                            variant="extraSmall"
                            className="capitalize"
                        >
                            Volume
                        </TabButton>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-primaryVariant100">Color:</span>
                    <div className="flex gap-1">
                        <TabButton
                            open={
                                colorMetric ===
                                EHeatmapColorMetric.PriceChange24h
                            }
                            onClick={() =>
                                onColorMetricChange(
                                    EHeatmapColorMetric.PriceChange24h
                                )
                            }
                            variant="extraSmall"
                            className="capitalize"
                        >
                            24h %
                        </TabButton>
                        <TabButton
                            open={
                                colorMetric ===
                                EHeatmapColorMetric.PriceChange7d
                            }
                            onClick={() =>
                                onColorMetricChange(
                                    EHeatmapColorMetric.PriceChange7d
                                )
                            }
                            variant="extraSmall"
                            className="capitalize"
                        >
                            7d %
                        </TabButton>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-primaryVariant100">Items:</span>
                    <Select
                        options={maxItemsOptions}
                        selectedOption={selectedMaxItemsOption}
                        onChange={handleMaxItemsChange}
                    />
                </div>
            </div>
        </div>
    );
};
