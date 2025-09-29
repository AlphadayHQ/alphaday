import { type FC, useMemo, useRef, useEffect, useState } from "react";
import { TCoin, TKeyword } from "src/api/types";
import { ENumberStyle, formatNumber } from "src/api/utils/format";
import { HeatmapTooltip } from "./HeatmapTooltip";
import { EHeatmapColorMetric, EHeatmapSizeMetric } from "./types";

interface IHeatmapGrid {
    data: TCoin[];
    sizeMetric: EHeatmapSizeMetric;
    colorMetric: EHeatmapColorMetric;
    onCoinClick: (coin: TCoin) => void;
    keywordSearchList: TKeyword[];
}

type DisplayMode = "minimal" | "compact" | "comfortable" | "spacious";

const getDisplayMode = (width: number, height: number): DisplayMode => {
    const area = width * height;
    if (area < 1600) return "minimal"; // < 40x40
    if (area < 6400) return "compact"; // < 80x80
    if (area < 14400) return "comfortable"; // < 120x120
    return "spacious";
};

const LAYOUTS = {
    minimal: { showIcon: true, showTicker: false, showPercent: false },
    compact: { showIcon: true, showTicker: false, showPercent: true },
    comfortable: { showIcon: true, showTicker: true, showPercent: true },
    spacious: { showIcon: true, showTicker: true, showPercent: true },
};

const SIZES = {
    iconRatio: {
        spacious: 0.25,
        comfortable: 0.25,
        compact: 0.4,
        minimal: 0.5,
    },
    fontSize: { spacious: 16, comfortable: 12, compact: 10, minimal: 10 },
    spacing: { spacious: 8, comfortable: 6, compact: 0, minimal: 0 },
};

const getLayout = (
    x: number,
    y: number,
    width: number,
    height: number,
    mode: DisplayMode
) => {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const iconRatio = SIZES.iconRatio[mode];
    // Max icon size is 100px
    const iconSize = Math.min(Math.min(width, height) * iconRatio, 100);
    const fontSize = SIZES.fontSize[mode];
    const spacing = SIZES.spacing[mode];

    return {
        centerX,
        centerY,
        iconSize,
        fontSize,
        spacing,
        icon: {
            x: centerX - iconSize / 2,
            y:
                mode === "minimal"
                    ? centerY - iconSize / 2 // Center icon for minimal mode
                    : centerY - iconSize - spacing * 2, // Stack above text
            size: iconSize,
        },
        ticker: {
            x: centerX,
            y: centerY,
            // +
            // (mode !== "minimal" && mode !== "compact"
            //     ? 0
            //     : iconSize / 2 + spacing),
        },
        percent: {
            x: centerX,
            y: centerY + fontSize,
            // centerY +
            // iconSize / 2 +
            // spacing +
            // (mode === "comfortable" || mode === "spacious"
            //     ? fontSize + spacing
            //     : 0),
        },
    };
};

export const HeatmapGrid: FC<IHeatmapGrid> = ({
    data,
    sizeMetric,
    colorMetric,
    onCoinClick,
    keywordSearchList,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const [hoveredCoin, setHoveredCoin] = useState<TCoin | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

            // Start from index 1 to ensure we always have at least one item on each side
            for (let itemIndex = 1; itemIndex < items.length; itemIndex += 1) {
                const leftSum = items
                    .slice(0, itemIndex)
                    .reduce((sum, item) => sum + (item[sizeMetric] || 0), 0);
                const rightSum = currentTotal - leftSum;

                // Skip if either side would be empty or have zero size
                if (leftSum <= 0 || rightSum <= 0) {
                    // eslint-disable-next-line no-continue
                    continue;
                }

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
            }

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
                {heatmapItems.map((item) => {
                    const { coin, width, height, x, y, color } = item;
                    const colorIntensity = Math.abs(color);
                    const isPositive = color >= 0;

                    const coinImage =
                        coin.ticker === "BTC"
                            ? "/crypto-logos/bitcoin.avif"
                            : coin.icon;

                    // Check if coin is in keywords list
                    const isHighlighted = keywordSearchList.some(
                        (keyword) =>
                            keyword.id === coin.id ||
                            coin.tags?.some((tag) => tag.id === keyword.tag.id)
                    );
                    let baseOpacity = 1;
                    if (keywordSearchList.length > 0) {
                        baseOpacity = isHighlighted ? 1 : 0.3;
                    }

                    return (
                        <g key={coin.id} style={{ opacity: baseOpacity }}>
                            <rect
                                x={x}
                                y={y}
                                width={width}
                                height={height}
                                fill={
                                    isPositive
                                        ? `hsl(130, ${Math.min(colorIntensity * 80, 160)}%, ${30 + colorIntensity * 0.3}%)`
                                        : `hsl(0, ${Math.min(colorIntensity * 20, 120)}%, ${30 + colorIntensity * 0.3}%)`
                                }
                                stroke="#2a2a2a"
                                strokeWidth={isHighlighted ? "1" : "0.5"}
                                className="hover:opacity-80 transition-opacity cursor-pointer"
                                onClick={() => onCoinClick(coin)}
                                onMouseEnter={(e) => {
                                    setHoveredCoin(coin);
                                    const rect =
                                        containerRef.current?.getBoundingClientRect();
                                    if (rect) {
                                        setMousePosition({
                                            x: e.clientX - rect.left,
                                            y: e.clientY - rect.top,
                                        });
                                    }
                                }}
                                onMouseMove={(e) => {
                                    const rect =
                                        containerRef.current?.getBoundingClientRect();
                                    if (rect) {
                                        setMousePosition({
                                            x: e.clientX - rect.left,
                                            y: e.clientY - rect.top,
                                        });
                                    }
                                }}
                                onMouseLeave={() => {
                                    setHoveredCoin(null);
                                }}
                            />
                            {(() => {
                                const mode = getDisplayMode(width, height);
                                const layout = getLayout(
                                    x,
                                    y,
                                    width,
                                    height,
                                    mode
                                );
                                const displayRules = LAYOUTS[mode];

                                return (
                                    <>
                                        {displayRules.showIcon && coin.icon && (
                                            <image
                                                x={layout.icon.x}
                                                y={layout.icon.y}
                                                width={layout.icon.size}
                                                height={layout.icon.size}
                                                href={coinImage}
                                                className="pointer-events-none rounded-full"
                                            />
                                        )}
                                        {displayRules.showTicker && (
                                            <text
                                                x={layout.ticker.x}
                                                y={layout.ticker.y}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                className="fill-white font-bold pointer-events-none"
                                                style={{
                                                    fontSize: layout.fontSize,
                                                }}
                                            >
                                                {coin.ticker.toUpperCase()}
                                            </text>
                                        )}
                                        {displayRules.showPercent && (
                                            <text
                                                x={layout.percent.x}
                                                y={layout.percent.y}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                className="fill-white font-semibold pointer-events-none"
                                                style={{
                                                    fontSize:
                                                        layout.fontSize * 0.85,
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
                                        )}
                                    </>
                                );
                            })()}
                        </g>
                    );
                })}
            </svg>
            {hoveredCoin && mousePosition && (
                <HeatmapTooltip
                    coin={hoveredCoin}
                    position={mousePosition}
                    sizeMetric={sizeMetric}
                    colorMetric={colorMetric}
                    visible
                    containerDimensions={dimensions}
                />
            )}
        </div>
    );
};
