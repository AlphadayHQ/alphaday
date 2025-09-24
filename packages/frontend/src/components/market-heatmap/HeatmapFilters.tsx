import type { FC } from "react";
import { Select } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
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

export const HeatmapFilters: FC<IHeatmapFilters> = ({
    sizeMetric,
    colorMetric,
    maxItems,
    onSizeMetricChange,
    onColorMetricChange,
    onMaxItemsChange,
}) => {
    const { t } = useTranslation();

    const sizeMetricOptions = [
        {
            id: EHeatmapSizeMetric.MarketCap,
            name: t("market.heatmap.sizeMetrics.marketCap"),
            icon: null,
        },
        {
            id: EHeatmapSizeMetric.Volume,
            name: t("market.heatmap.sizeMetrics.volume"),
            icon: null,
        },
    ];

    const colorMetricOptions = [
        {
            id: EHeatmapColorMetric.PriceChange24h,
            name: t("market.heatmap.colorMetrics.change24h"),
            icon: null,
        },
        {
            id: EHeatmapColorMetric.PriceChange7d,
            name: t("market.heatmap.colorMetrics.change7d"),
            icon: null,
        },
        {
            id: EHeatmapColorMetric.PriceChange14d,
            name: t("market.heatmap.colorMetrics.change14d"),
            icon: null,
        },
        {
            id: EHeatmapColorMetric.PriceChange30d,
            name: t("market.heatmap.colorMetrics.change30d"),
            icon: null,
        },
        {
            id: EHeatmapColorMetric.PriceChange60d,
            name: t("market.heatmap.colorMetrics.change60d"),
            icon: null,
        },
    ];

    const maxItemsOptions = Object.keys(EHeatmapMaxItems)
        .filter((key) => !isNaN(Number(key)))
        .map((option) => ({
            id: option.toString(),
            name: `${t("market.heatmap.maxItems.top")} ${option} ${t("market.heatmap.maxItems.coins")}`,
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
        <div className="flex items-center gap-6 pl-1 pb-1 [&_.option-label-text]:-ml-0.5">
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
    );
};
