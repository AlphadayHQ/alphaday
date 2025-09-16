import { FC } from "react";
import { TCoin } from "src/api/types";
import { ENumberStyle, formatNumber } from "src/api/utils/format";
import { EHeatmapColorMetric, EHeatmapSizeMetric } from "./types";

interface IHeatmapTooltip {
    coin: TCoin;
    sizeMetric: EHeatmapSizeMetric;
    colorMetric: EHeatmapColorMetric;
    position: { x: number; y: number };
    visible: boolean;
    containerDimensions: { width: number; height: number };
}

export const HeatmapTooltip: FC<IHeatmapTooltip> = ({
    coin,
    sizeMetric,
    colorMetric,
    position,
    visible,
    containerDimensions,
}) => {
    if (!visible) return null;

    const sizeValue = coin[sizeMetric];
    const colorValue = coin[colorMetric];

    // Tooltip dimensions (approximate)
    const tooltipWidth = 200;
    const tooltipHeight = 120;
    const offset = 10;

    // Calculate position to keep tooltip within container bounds
    let left = position.x + offset;
    let top = position.y - offset;

    // Adjust horizontal position if tooltip would overflow
    if (left + tooltipWidth > containerDimensions.width) {
        left = position.x - tooltipWidth - offset;
    }

    // Adjust vertical position if tooltip would overflow
    if (top < 0) {
        top = position.y + offset;
    } else if (top + tooltipHeight > containerDimensions.height) {
        top = position.y - tooltipHeight - offset;
    }

    const getSizeLabel = () => {
        switch (sizeMetric) {
            case EHeatmapSizeMetric.MarketCap:
                return "Market Cap";
            case EHeatmapSizeMetric.Volume:
                return "Volume";
            default:
                return "Size";
        }
    };

    const getColorLabel = () => {
        switch (colorMetric) {
            case EHeatmapColorMetric.PriceChange24h:
                return "24h Change";
            case EHeatmapColorMetric.PriceChange7d:
                return "7d Change";
            default:
                return "Change";
        }
    };

    return (
        <div
            className="absolute z-50 pointer-events-none"
            style={{
                left,
                top,
            }}
        >
            <div className="bg-backgroundVariant100 border border-borderLine rounded-md p-3 shadow-lg min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                    {coin.icon && (
                        <img
                            src={coin.icon}
                            alt={coin.name}
                            className="w-6 h-6 rounded-full"
                        />
                    )}
                    <div>
                        <div className="text-white font-semibold text-sm">
                            {coin.name}
                        </div>
                        <div className="text-primaryVariant100 text-xs">
                            {coin.ticker.toUpperCase()}
                        </div>
                    </div>
                </div>

                <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span className="text-primaryVariant100">Price:</span>
                        <span className="text-white">
                            {
                                formatNumber({
                                    value: coin.price,
                                    style: ENumberStyle.Currency,
                                    currency: "USD",
                                }).value
                            }
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-primaryVariant100">
                            {getColorLabel()}:
                        </span>
                        <span
                            className={
                                colorValue >= 0 ? "text-success" : "text-error"
                            }
                        >
                            {colorValue > 0 ? "+" : ""}
                            {
                                formatNumber({
                                    value: colorValue,
                                    style: ENumberStyle.Percent,
                                    normalise: true,
                                }).value
                            }
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-primaryVariant100">
                            {getSizeLabel()}:
                        </span>
                        <span className="text-white">
                            {
                                formatNumber({
                                    value: sizeValue || 0,
                                    style: ENumberStyle.Currency,
                                    currency: "USD",
                                }).value
                            }
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
