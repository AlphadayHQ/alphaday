import type { FC } from "react";
import { Select } from "@alphaday/ui-kit";
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

const sizeMetricOptions = [
    {
        id: EHeatmapSizeMetric.MarketCap,
        name: "Market Cap",
        icon: null,
    },
    {
        id: EHeatmapSizeMetric.Volume,
        name: "Volume",
        icon: null,
    },
];

const colorMetricOptions = [
    {
        id: EHeatmapColorMetric.PriceChange24h,
        name: "24h %",
        icon: null,
    },
    {
        id: EHeatmapColorMetric.PriceChange7d,
        name: "7d %",
        icon: null,
    },
];

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
        icon: null,
    }));

    const handleSizeMetricChange = (
        option: SingleValue<{ id: string; name: string }>
    ) => {
        if (option) {
            onSizeMetricChange(option.id as EHeatmapSizeMetric);
        }
    };

    const handleColorMetricChange = (
        option: SingleValue<{ id: string; name: string }>
    ) => {
        if (option) {
            onColorMetricChange(option.id as EHeatmapColorMetric);
        }
    };

    const handleMaxItemsChange = (
        option: SingleValue<{ id: string; name: string }>
    ) => {
        if (option) {
            onMaxItemsChange(Number(option.id) as THeatmapMaxItems);
        }
    };

    const selectedSizeMetricOption = sizeMetricOptions.find(
        (option) => option.id === sizeMetric
    );

    const selectedColorMetricOption = colorMetricOptions.find(
        (option) => option.id === colorMetric
    );

    const selectedMaxItemsOption = maxItemsOptions.find(
        (option) => option.id === maxItems.toString()
    );

    return (
        <div className="bg-backgroundVariant100 border-b border-borderLine">
            <div className="p-4">
                <div className="grid grid-cols-3 gap-6">
                    {/* Size Metric Control */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-accent" />
                            <span className="text-sm font-medium text-primaryVariant100">
                                Size
                            </span>
                        </div>
                        <div className="w-full">
                            <Select
                                options={sizeMetricOptions}
                                selectedOption={selectedSizeMetricOption}
                                onChange={handleSizeMetricChange}
                            />
                        </div>
                    </div>

                    {/* Color Metric Control */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-primaryVariant100">
                                Color
                            </span>
                        </div>
                        <div className="w-full">
                            <Select
                                options={colorMetricOptions}
                                selectedOption={selectedColorMetricOption}
                                onChange={handleColorMetricChange}
                            />
                        </div>
                    </div>

                    {/* Items Count Control */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-primaryVariant100">
                                Limit
                            </span>
                        </div>
                        <div className="w-full">
                            <Select
                                options={maxItemsOptions}
                                selectedOption={selectedMaxItemsOption}
                                onChange={handleMaxItemsChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
