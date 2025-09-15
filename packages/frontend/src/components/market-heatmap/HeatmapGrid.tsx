import { type FC, useMemo, useRef, useEffect, useState } from "react";
import { TCoin, TKeyword } from "src/api/types";
import { ENumberStyle, formatNumber } from "src/api/utils/format";
import { EHeatmapColorMetric, EHeatmapSizeMetric } from "./types";

interface IHeatmapGrid {
    data: TCoin[];
    sizeMetric: EHeatmapSizeMetric;
    colorMetric: EHeatmapColorMetric;
    onCoinClick: (coin: TCoin) => void;
    keywordSearchList: TKeyword[];
}

export const HeatmapGrid: FC<IHeatmapGrid> = ({
    data,
    sizeMetric,
    colorMetric,
    onCoinClick,
    keywordSearchList,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width, height } =
                    containerRef.current.getBoundingClientRect();
                setDimensions({ width: width || 800, height: height || 600 });
            }
        };

        updateDimensions();

        const resizeObserver = new ResizeObserver(updateDimensions);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, []);
    const heatmapItems = useMemo(() => {
        if (!data.length) return [];

        // Sort data by size (descending) for better treemap layout
        const sortedData = [...data].sort(
            (a, b) => (b[sizeMetric] || 0) - (a[sizeMetric] || 0)
        );

        // Calculate total size
        const totalSize = sortedData.reduce(
            (sum, coin) => sum + (coin[sizeMetric] || 0),
            0
        );

        if (totalSize === 0) return [];

        const containerWidth = dimensions.width;
        const containerHeight = dimensions.height;

        const layoutTreeMap = (
            items: TCoin[],
            x: number,
            y: number,
            width: number,
            height: number
        ): Array<{
            coin: TCoin;
            x: number;
            y: number;
            width: number;
            height: number;
            color: number;
        }> => {
            if (items.length === 0) return [];
            if (items.length === 1) {
                return [
                    {
                        coin: items[0],
                        x,
                        y,
                        width,
                        height,
                        color: items[0][colorMetric] || 0,
                    },
                ];
            }

            // Calculate total area for current items
            const currentTotal = items.reduce(
                (sum, item) => sum + (item[sizeMetric] || 0),
                0
            );

            // Find the best split point
            let bestRatio = Infinity;
            let bestSplit = 1;

            items.forEach((_, itemIndex) => {
                const leftSum = items
                    .slice(0, itemIndex)
                    .reduce((sum, item) => sum + (item[sizeMetric] || 0), 0);
                const rightSum = currentTotal - leftSum;

                // Calculate aspect ratios for both sides
                const leftRatio =
                    width > height
                        ? (width * leftSum) / currentTotal / height
                        : width / ((height * leftSum) / currentTotal);
                const rightRatio =
                    width > height
                        ? (width * rightSum) / currentTotal / height
                        : width / ((height * rightSum) / currentTotal);

                const maxRatio = Math.max(leftRatio, rightRatio);
                if (maxRatio < bestRatio) {
                    bestRatio = maxRatio;
                    bestSplit = itemIndex;
                }
            });

            const leftItems = items.slice(0, bestSplit);
            const rightItems = items.slice(bestSplit);

            const leftSum = leftItems.reduce(
                (sum, item) => sum + (item[sizeMetric] || 0),
                0
            );
            const leftRatio = leftSum / currentTotal;

            let leftLayout: ReturnType<typeof layoutTreeMap>;
            let rightLayout: ReturnType<typeof layoutTreeMap>;

            // Split horizontally or vertically based on aspect ratio
            if (width > height) {
                // Split vertically
                const leftWidth = width * leftRatio;
                leftLayout = layoutTreeMap(leftItems, x, y, leftWidth, height);
                rightLayout = layoutTreeMap(
                    rightItems,
                    x + leftWidth,
                    y,
                    width - leftWidth,
                    height
                );
            } else {
                // Split horizontally
                const leftHeight = height * leftRatio;
                leftLayout = layoutTreeMap(leftItems, x, y, width, leftHeight);
                rightLayout = layoutTreeMap(
                    rightItems,
                    x,
                    y + leftHeight,
                    width,
                    height - leftHeight
                );
            }

            return [...leftLayout, ...rightLayout];
        };

        return layoutTreeMap(sortedData, 0, 0, containerWidth, containerHeight);
    }, [data, sizeMetric, colorMetric, dimensions]);

    if (!data.length) {
        return (
            <div className="flex items-center justify-center h-full text-primaryVariant100">
                No data available
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden bg-backgroundVariant100"
        >
            <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            >
                <title>Crypto market heatmap</title>
                {heatmapItems.map((item) => {
                    const { coin, width, height, x, y, color } = item;
                    const colorIntensity = Math.abs(color);
                    const isPositive = color >= 0;
                    
                    // Check if coin is in keywords list
                    const isHighlighted = keywordSearchList.some(keyword => 
                        keyword.id === coin.id || 
                        coin.tags?.some(tag => tag.id === keyword.tag.id)
                    );
                    const baseOpacity = keywordSearchList.length > 0 ? (isHighlighted ? 1 : 0.3) : 1;

                    return (
                        <g key={coin.id} style={{ opacity: baseOpacity }}>
                            <rect
                                x={x}
                                y={y}
                                width={width}
                                height={height}
                                fill={
                                    isPositive
                                        ? `hsl(130, ${Math.min(colorIntensity * 80, 160)}%, ${50 + colorIntensity}%)`
                                        : `hsl(0, ${Math.min(colorIntensity * 20, 120)}%, ${50 + colorIntensity}%)`
                                }
                                stroke="#2a2a2a"
                                strokeWidth={isHighlighted ? "1" : "0.5"}
                                className="hover:opacity-80 transition-opacity cursor-pointer"
                                onClick={() => onCoinClick(coin)}
                            />
                            {width > 60 && height > 40 && (
                                <>
                                    {coin.icon && width > 120 && height > 100 && (
                                        <image
                                            x={x + width / 2 - 10}
                                            y={y + height / 2 - 40}
                                            width="20"
                                            height="20"
                                            href={coin.icon}
                                            className="pointer-events-none"
                                        />
                                    )}
                                    <text
                                        x={x + width / 2}
                                        y={coin.icon && width > 120 && height > 100 ? y + height / 2 - 8 : y + height / 2 - 4}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="fill-white text-lg font-bold pointer-events-none"
                                        style={{
                                            fontSize: Math.min(width / 5, 16),
                                        }}
                                    >
                                        {coin.ticker.toUpperCase()}
                                    </text>
                                    <text
                                        x={x + width / 2}
                                        y={coin.icon && width > 120 && height > 100 ? y + height / 2 + 12 : y + height / 2 + 12}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="fill-white text-base font-semibold pointer-events-none"
                                        style={{
                                            fontSize: Math.min(width / 7, 14),
                                        }}
                                    >
                                        {color > 0 ? "+" : ""}
                                        {
                                            formatNumber({
                                                value: color,
                                                style: ENumberStyle.Percent,
                                                normalise: true,
                                            }).value
                                        }
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
