import type { FC } from "react";
import { Button } from "@alphaday/ui-kit";

interface IHeatmapFilters {
    sizeMetric: "market_cap" | "volume";
    colorMetric: "price_percent_change_24h" | "price_percent_change_7d";
    maxItems: number;
    onSizeMetricChange: (metric: "market_cap" | "volume") => void;
    onColorMetricChange: (
        metric: "price_percent_change_24h" | "price_percent_change_7d"
    ) => void;
    onMaxItemsChange: (value: number) => void;
}

export const HeatmapFilters: FC<IHeatmapFilters> = ({
    sizeMetric,
    colorMetric,
    maxItems,
    onSizeMetricChange,
    onColorMetricChange,
    onMaxItemsChange,
}) => {
    return (
        <div className="p-3 border-b border-borderLine bg-backgroundVariant100">
            <div className="flex flex-wrap gap-4 items-center text-sm">
                <div className="flex items-center gap-2">
                    <span className="text-primaryVariant100">Size:</span>
                    <div className="flex gap-1">
                        <Button
                            variant={
                                sizeMetric === "market_cap"
                                    ? "primary"
                                    : "secondary"
                            }
                            className="px-2 py-1 text-xs"
                            onClick={() => onSizeMetricChange("market_cap")}
                        >
                            Market Cap
                        </Button>
                        <Button
                            variant={
                                sizeMetric === "volume"
                                    ? "primary"
                                    : "secondary"
                            }
                            className="px-2 py-1 text-xs"
                            onClick={() => onSizeMetricChange("volume")}
                        >
                            Volume
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-primaryVariant100">Color:</span>
                    <div className="flex gap-1">
                        <Button
                            variant={
                                colorMetric === "price_percent_change_24h"
                                    ? "primary"
                                    : "secondary"
                            }
                            className="px-2 py-1 text-xs"
                            onClick={() =>
                                onColorMetricChange("price_percent_change_24h")
                            }
                        >
                            24h %
                        </Button>
                        <Button
                            variant={
                                colorMetric === "price_percent_change_7d"
                                    ? "primary"
                                    : "secondary"
                            }
                            className="px-2 py-1 text-xs"
                            onClick={() =>
                                onColorMetricChange("price_percent_change_7d")
                            }
                        >
                            7d %
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-primaryVariant100">Items:</span>
                    <select
                        value={maxItems}
                        onChange={(e) =>
                            onMaxItemsChange(Number(e.target.value))
                        }
                        className="bg-backgroundVariant200 border border-borderLine rounded px-2 py-1 text-primary"
                    >
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={200}>200</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
