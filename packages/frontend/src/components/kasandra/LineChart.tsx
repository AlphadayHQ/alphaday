import { FC, memo, useCallback, useMemo, useState } from "react";
import { ApexAreaChart, Spinner } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import { EPredictionCase, TChartRange } from "src/api/types";
import { ENumberStyle, formatNumber } from "src/api/utils/format";
import { maxVal, minVal } from "src/api/utils/helpers";
import { truncateDataByChartRange } from "src/api/utils/kasandraUtils";
import { Logger } from "src/api/utils/logging";
import { renderToString } from "src/api/utils/textUtils";
import { ReactComponent as ZoomResetSVG } from "src/assets/icons/zoom-reset.svg";
import KasandraTooltip, { TCustomTooltip } from "./KasandraTooltip";

type TDataPoints = {
    bullish: [number, number][];
    bearish: [number, number][];
    base: [number, number][];
};

type IProps = {
    historyData: number[][];
    predictionData: TDataPoints;
    insightsData: TDataPoints | undefined;
    selectedChartRange: TChartRange;
    isLoading?: boolean;
    selectedTimestamp: number | undefined;
    onSelectDataPoint: (timestamp: number) => void;
    selectedCase: EPredictionCase | "all" | undefined;
};

const generatePoints = (
    data: [number, number][],
    seriesIndex: 0 | 1 | 2 | 3,
    selectedTimestamp: number | undefined,
    onSelectDataPoint: (dataPoint: number) => void
) => {
    const seriesIndexColorMap = {
        0: "#6dd230",
        1: "#6dd230", // bullish
        2: "#cdd230", // base
        3: "#f45532", // bearish
    };
    return data.map((item) => ({
        x: item[0],
        y: item[1],
        click: () => {
            onSelectDataPoint(item[0]);
        },
        marker: {
            size: selectedTimestamp === item[0] ? 7 : 5,
            offsetY: 1,
            fillColor: seriesIndexColorMap[seriesIndex],
        },
    }));
};

/**
 * Reduces an array to a specified maximum number of items,
 * evenly distributing the removed items across the array length.
 * @param {Array} items - The original array of items
 * @param {number} maxItems - The maximum number of items to keep
 * @return {Array} A new array with at most maxItems items
 */

function sortByDateAsc(items: number[][]) {
    return items.sort((a, b) => a[0] - b[0]);
}

const renderCustomTooltip =
    (
        data: {
            name: string;
            data: number[][];
        }[],
        selectedCase: EPredictionCase | "all" | undefined
    ) =>
    (props: TCustomTooltip) => {
        return renderToString(
            <KasandraTooltip
                {...props}
                dataset={data}
                selectedCase={selectedCase}
            />
        );
    };

const LineChart: FC<IProps> = memo(function LineChart({
    historyData,
    predictionData,
    insightsData,
    selectedChartRange,
    isLoading,
    selectedTimestamp,
    onSelectDataPoint,
    selectedCase,
}) {
    const { t } = useTranslation();
    const [zoomKey, setZoomKey] = useState(0);
    const [showResetZoom, setShowResetZoom] = useState(false);

    Logger.debug("PREDICTION DATA => [timestamp, value]", predictionData);

    const truncatedBullishData = truncateDataByChartRange(
        predictionData.bullish,
        selectedChartRange
    );
    const truncatedBaseData = truncateDataByChartRange(
        predictionData.base,
        selectedChartRange
    );
    const truncatedBearishData = truncateDataByChartRange(
        predictionData.bearish,
        selectedChartRange
    );
    const lastHistoryDataPoint = historyData[historyData.length - 1];

    const chartSeries = useMemo(() => {
        const createSeries = (name: string, data: number[][]) => ({
            name,
            data: sortByDateAsc([lastHistoryDataPoint, ...data]),
        });

        const cases = {
            [EPredictionCase.OPTIMISTIC]: createSeries(
                "Bullish case",
                truncatedBullishData
            ),
            [EPredictionCase.BASELINE]: createSeries(
                "Base case",
                truncatedBaseData
            ),
            [EPredictionCase.PESSIMISTIC]: createSeries(
                "Bearish case",
                truncatedBearishData
            ),
        };

        const historySeries = { name: "History", data: historyData };

        if (selectedCase && selectedCase in cases) {
            return [historySeries, cases[selectedCase as keyof typeof cases]];
        }

        return [
            historySeries,
            createSeries("Bullish case", truncatedBullishData),
            createSeries("Base case", truncatedBaseData),
            createSeries("Bearish case", truncatedBearishData),
        ];
    }, [
        lastHistoryDataPoint,
        truncatedBullishData,
        truncatedBaseData,
        truncatedBearishData,
        selectedCase,
        historyData,
    ]);

    Logger.debug("CHART SERIES DATA => [timestamp, value]", chartSeries);

    const minValue = useMemo(() => {
        const data = chartSeries.flatMap((series) => series.data);
        return minVal(data)[0];
    }, [chartSeries]);
    Logger.debug("minValue =>", minValue);

    const maxValue = useMemo(() => {
        const data = chartSeries.flatMap((series) => series.data);
        return maxVal(data)[0];
    }, [chartSeries]);
    Logger.debug("maxValue =>", maxValue);

    const genPoints = useCallback(
        (data: [number, number][], seriesIndex: 0 | 1 | 2 | 3) => {
            return generatePoints(
                data,
                seriesIndex,
                selectedTimestamp,
                onSelectDataPoint
            );
        },
        [selectedTimestamp, onSelectDataPoint]
    );

    const points = useMemo(() => {
        if (selectedCase === EPredictionCase.OPTIMISTIC) {
            return [...genPoints(insightsData?.bullish ?? [], 1)];
        }

        if (selectedCase === EPredictionCase.BASELINE) {
            return [...genPoints(insightsData?.base ?? [], 2)];
        }

        if (selectedCase === EPredictionCase.PESSIMISTIC) {
            return [...genPoints(insightsData?.bearish ?? [], 3)];
        }
        return [
            // ...generatePoints(insightsData?.bullish ?? [], 0, selectedTimestamp, onSelectDataPoint),
            ...genPoints(insightsData?.bullish ?? [], 1),
            ...genPoints(insightsData?.base ?? [], 2),
            ...genPoints(insightsData?.bearish ?? [], 3),
        ];
    }, [genPoints, insightsData, selectedCase]);

    Logger.debug("POINTS =>", points);

    const seriesColors = useMemo(() => {
        const colors = [
            "var(--alpha-green)",
            "var(--alpha-bullish)",
            "var(--alpha-base)",
            "var(--alpha-bearish)",
        ];

        if (selectedCase === EPredictionCase.PESSIMISTIC) {
            colors[1] = "var(--alpha-bearish)";
        }

        if (selectedCase === EPredictionCase.BASELINE) {
            colors[1] = "var(--alpha-base)";
        }

        return colors;
    }, [selectedCase]);

    const options = {
        chart: {
            type: "area",
            stacked: false,
            events: {},
            zoom: {
                enabled: false,
                type: "x",
                autoScaleYaxis: false,
                zoomedArea: {
                    fill: {
                        color: "var(--alpha-light-blue-100)",
                        opacity: 0.4,
                    },
                    stroke: {
                        color: "var(--alpha-dark-blue)",
                        opacity: 0.4,
                        width: 1,
                    },
                },
            },
            toolbar: {
                show: false,
            },
            animations: {
                enabled: false,
            },
            redrawOnParentResize: true,
        },
        // color selection should match the case
        colors: seriesColors,
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "straight",
            width: [1.5, 2.5, 2.5, 2.5],
            dashArray: [0, 0.5, 0.5, 0.5],
        },
        fill: {
            type: "gradient",
            gradient: {
                type: "vertical",
                gradientToColors: [
                    "var(--alpha-dark-base)",
                    "var(--alpha-dark-base)",
                ],
                shadeIntensity: 0.01,
                opacityFrom: 0.5,
                opacityTo: 0.1,
                stops: [0, 90, 100],
            },
        },
        legend: {
            show: false,
        },
        annotations: {
            xaxis: [
                {
                    x: lastHistoryDataPoint[0], // TODO use Now date
                    borderColor: "var(--alpha-primary)", // for the dashed line
                    borderWidth: 1,
                    strokeDashArray: 4,
                    label: {
                        style: {
                            background: "var(--alpha-base-400)",
                            color: "var(--alpha-primary)",
                            fontSize: "11px",
                            fontFamily: "'Open sans', sans-serif",
                            fontWeight: 500,
                            letterSpacing: "1px !important",
                        },
                        text: t("kasandra.now"),
                        offsetX: 0,
                        offsetY: 15,
                        orientation: "horizontal",
                        position: "bottom",
                    },
                },
            ],
            points,
        },
        xaxis: {
            type: "datetime",
            tooltip: {
                enabled: false,
            },
            axisTicks: {
                show: false,
            },
            tickPlacement: "between",
            tickAmount: 8,
            labels: {
                datetimeUTC: false,
                style: {
                    colors: "var(--alpha-primary-200)",
                    fontSize: "10px",
                    fontFamily: "Arial, sans-serif",
                    fontWeight: 500,
                    cssClass: "apexcharts-xaxis-label",
                },
            },
            convertedCatToNumeric: false,
        },
        yaxis: {
            show: true,
            tickAmount: 3,
            // Manual adjustments to the y-axis to avoid clipping the line chart
            min: minValue,
            max: maxValue,
            decimalsInFloat: false,
            labels: {
                datetimeUTC: false,
                style: {
                    colors: "var(--alpha-primary-200)",
                    fontSize: "10px",
                    fontWeight: 500,
                    fontFamily: "Arial, sans-serif",
                    cssClass: "apexcharts-xaxis-label",
                },
                formatter: (value: number) => {
                    return formatNumber({
                        value,
                        style: ENumberStyle.Currency,
                        currency: "USD",
                    }).value;
                },
            },
            axisBorder: {
                show: true,
                color: "var(--alpha-border)",
                offsetX: 0,
                offsetY: 0,
            },
            axisTicks: {
                show: true,
                borderType: "solid",
                color: "var(--alpha-border)",
                width: 6,
                offsetX: 0,
                offsetY: 0,
            },
        },
        grid: {
            borderColor: "var(--alpha-border)",
            strokeDashArray: 5,
            xaxis: {
                lines: {
                    show: true,
                },
            },
            yaxis: {
                lines: {
                    show: false,
                },
            },
            column: {
                colors: "var(--alpha-border)",
                opacity: 1,
            },
        },
        tooltip: {
            title: {
                formatter: (seriesName: string) => `$${seriesName}`,
            },
            y: {
                formatter: undefined,
                title: {
                    formatter: (val: string) => {
                        return renderToString(
                            <span className="text-white">${val}:</span>
                        );
                    },
                },
            },
            custom: renderCustomTooltip(chartSeries, selectedCase),
        },
        responsive: [
            {
                breakpoint: 575,
                options: {
                    chart: {
                        height: 250,
                    },
                    xaxis: {
                        show: false,
                    },
                },
            },
        ],
    };

    const resetZoom = () => {
        setZoomKey((prev) => prev + 1);
        setShowResetZoom(false);
    };

    if (isLoading) {
        return (
            <div className="flex w-full h-[200px] items-center justify-center">
                <Spinner size="sm" />
            </div>
        );
    }

    return (
        <div className="w-full h-[200px] [&>div]:-mx-[10px] two-col:h-[354px] line-chart">
            <ApexAreaChart
                key={zoomKey}
                options={options}
                series={chartSeries}
                width="100%"
                height="100%"
            />
            {showResetZoom && (
                <ZoomResetSVG onClick={resetZoom} className="zoom-reset" />
            )}
        </div>
    );
});

export default LineChart;
