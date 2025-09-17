import type { FC } from "react";
import { Select } from "@alphaday/ui-kit";
import { SingleValue } from "react-select";
import {
    EHeatmapSizeMetric,
    EHeatmapColorMetric,
    EHeatmapMaxItems,
} from "./types";

interface IHeatmapFilters {
    sizeMetric: EHeatmapSizeMetric;
    colorMetric: EHeatmapColorMetric;
    maxItems: EHeatmapMaxItems;
    onSizeMetricChange: (metric: EHeatmapSizeMetric) => void;
    onColorMetricChange: (metric: EHeatmapColorMetric) => void;
    onMaxItemsChange: (value: EHeatmapMaxItems) => void;
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
        name: "Change 24h %",
        icon: null,
    },
    {
        id: EHeatmapColorMetric.PriceChange7d,
        name: "Change 7d %",
        icon: null,
    },
    {
        id: EHeatmapColorMetric.PriceChange14d,
        name: "Change 14d %",
        icon: null,
    },
    {
        id: EHeatmapColorMetric.PriceChange30d,
        name: "Change 30d %",
        icon: null,
    },
    {
        id: EHeatmapColorMetric.PriceChange60d,
        name: "Change 60d %",
        icon: null,
    },
];

const maxItemsOptions = Object.keys(EHeatmapMaxItems)
    .filter((key) => !isNaN(Number(key)))
    .map((option) => ({
        id: option.toString(),
        name: `Top ${option} coins`,
        icon: null,
    }));

export const HeatmapFilters: FC<IHeatmapFilters> = ({
    sizeMetric,
    colorMetric,
    maxItems,
    onSizeMetricChange,
    onColorMetricChange,
    onMaxItemsChange,
}) => {
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
            onMaxItemsChange(Number(option.id) as EHeatmapMaxItems);
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
        <div>
            <div className="p-4">
                <div className="flex items-center gap-6">
                    <Select
                        options={sizeMetricOptions}
                        selectedOption={selectedSizeMetricOption}
                        onChange={handleSizeMetricChange}
                    />

                    <Select
                        options={colorMetricOptions}
                        selectedOption={selectedColorMetricOption}
                        onChange={handleColorMetricChange}
                    />

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
