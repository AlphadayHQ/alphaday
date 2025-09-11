import { type FC, useMemo } from "react";
import type { TRemoteCoinData } from "src/api/services/market/types";
import { ENumberStyle, formatNumber } from "src/api/utils/format";

interface IHeatmapGrid {
    data: TRemoteCoinData[];
    sizeMetric: "market_cap" | "volume";
    colorMetric: "price_percent_change_24h" | "price_percent_change_7d";
    onCoinClick: (coin: TRemoteCoinData) => void;
}

export const HeatmapGrid: FC<IHeatmapGrid> = ({
    data,
    sizeMetric,
    colorMetric,
    onCoinClick,
}) => {
    const heatmapItems = useMemo(() => {
        if (!data.length) return [];

        // Calculate sizes and colors
        const items = data.map((coinData) => ({
            coin: coinData,
            size: coinData[sizeMetric] || 0,
            color: coinData[colorMetric] || 0,
            width: 0,
            height: 0,
            x: 0,
            y: 0,
        }));

        // Simple treemap layout algorithm
        const totalSize = items.reduce((sum, item) => sum + item.size, 0);
        const containerWidth = 800;
        const containerHeight = 600;
        const totalArea = containerWidth * containerHeight;

        let currentX = 0;
        let currentY = 0;
        let rowHeight = 0;
        let remainingWidth = containerWidth;

        const layoutItems = items.map((item) => {
            const area = (item.size / totalSize) * totalArea;
            const aspectRatio = Math.sqrt(area) / Math.sqrt(area);

            let width = Math.sqrt(area * aspectRatio);
            let height = area / width;

            // Adjust for remaining space
            if (width > remainingWidth) {
                width = remainingWidth;
                height = area / width;
            }

            // Check if we need a new row
            if (currentX + width > containerWidth) {
                currentX = 0;
                currentY += rowHeight;
                rowHeight = 0;
                remainingWidth = containerWidth;
            }

            const layoutItem = {
                ...item,
                width: Math.max(width, 50), // Minimum width
                height: Math.max(height, 30), // Minimum height
                x: currentX,
                y: currentY,
            };

            currentX += layoutItem.width;
            remainingWidth -= layoutItem.width;
            rowHeight = Math.max(rowHeight, layoutItem.height);

            return layoutItem;
        });

        return layoutItems;
    }, [data, sizeMetric, colorMetric]);

    if (!data.length) {
        return (
            <div className="flex items-center justify-center h-full text-primaryVariant100">
                No data available
            </div>
        );
    }

    return (
        <div className="relative w-full h-full overflow-hidden bg-backgroundVariant100">
            <svg width="100%" height="100%" viewBox="0 0 800 600">
                <title>Crypto market heatmap</title>
                {heatmapItems.map((item) => {
                    const { coin, width, height, x, y, color } = item;
                    const colorIntensity = Math.abs(color);
                    const isPositive = color >= 0;

                    return (
                        <g key={coin.id}>
                            <rect
                                x={x}
                                y={y}
                                width={width}
                                height={height}
                                fill={
                                    isPositive
                                        ? `hsl(120, ${Math.min(colorIntensity * 10, 80)}%, ${50 + colorIntensity}%)`
                                        : `hsl(0, ${Math.min(colorIntensity * 10, 80)}%, ${50 + colorIntensity}%)`
                                }
                                stroke="#2a2a2a"
                                strokeWidth="1"
                                className="hover:opacity-80 transition-opacity cursor-pointer"
                                onClick={() => onCoinClick(coin)}
                            />
                            {width > 60 && height > 40 && (
                                <>
                                    <text
                                        x={x + width / 2}
                                        y={y + height / 2 - 8}
                                        textAnchor="middle"
                                        className="fill-white text-xs font-semibold pointer-events-none"
                                        style={{
                                            fontSize: Math.min(width / 8, 12),
                                        }}
                                    >
                                        {coin.coin.ticker.toUpperCase()}
                                    </text>
                                    <text
                                        x={x + width / 2}
                                        y={y + height / 2 + 8}
                                        textAnchor="middle"
                                        className="fill-white text-xs pointer-events-none"
                                        style={{
                                            fontSize: Math.min(width / 10, 10),
                                        }}
                                    >
                                        {color > 0 ? "+" : ""}
                                        {
                                            formatNumber({
                                                value: color,
                                                style: ENumberStyle.Percent,
                                            }).value
                                        }
                                        %
                                    </text>
                                </>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};
