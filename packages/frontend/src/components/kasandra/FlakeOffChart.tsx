import { useMemo } from "react";
import { ApexLineChart, themeColors, twMerge } from "@alphaday/ui-kit";
import moment from "moment";
import {
    TCoinMarketHistory,
    TFlakeOffData,
    EPredictionCase,
} from "src/api/types";
import { ENumberStyle, formatNumber } from "src/api/utils/format";
import { renderToString } from "src/api/utils/textUtils";

const caseColors = {
    [EPredictionCase.OPTIMISTIC]: "#48c26b", // Teal
    [EPredictionCase.BASELINE]: "#FECA57", // amber
    [EPredictionCase.PESSIMISTIC]: "#FF6B6B", // Red
};
type TDataPoint = {
    x: number;
    y: number;
};
type TChartPoint = TDataPoint & {
    isAnchor?: boolean;
};
type TSeries = {
    name: string;
    data: TDataPoint[];
    type: string;
    color: string;
    strokeWidth: number;
    zIndex: number;
    strokeDashArray?: number;
    opacity?: number;
};

type TCustomTooltip = {
    series: number[][];
    seriesIndex: number;
    dataPointIndex: number;
    w: {
        config: {
            series: TSeries[];
        };
    };
    flakeOffData: TFlakeOffData | undefined;
    marketHistory: TCoinMarketHistory | undefined;
};

const renderCustomTooltip =
    (selectedCase: EPredictionCase | "all" | undefined) =>
    (props: TCustomTooltip) => {
        const { seriesIndex, dataPointIndex, w } = props;
        const currentSeries = w.config.series[seriesIndex];
        const dataPoint = currentSeries.data[dataPointIndex];

        if (!dataPoint) return "";

        const timestamp = dataPoint.x;
        const TIME_GAP = Math.abs(
            w.config.series[1].data[1].x - w.config.series[1].data[2].x
        );

        const TIMESTAMP_TOLERANCE = TIME_GAP || 5 * 60 * 1000; // 1 minute in milliseconds

        // Find all series with data points near this timestamp
        const matchingData: Array<{
            seriesName: string;
            price: number;
            color: string;
            isActual: boolean;
            case?: EPredictionCase;
            startDate?: number;
            calculatedAccuracy?: number;
        }> = [];

        // First, find the actual historical price at this timestamp
        let actualPrice: number | undefined;
        const actualSeries = w.config.series.find((series) =>
            series.name.includes("Actual")
        );
        if (actualSeries) {
            const actualPoint = actualSeries.data.find(
                (point) => Math.abs(point.x - timestamp) <= TIMESTAMP_TOLERANCE
            );
            if (actualPoint) {
                actualPrice = actualPoint.y;
            }
        }

        // Helper function to calculate accuracy percentage
        const calculateAccuracy = (
            predictedPrice: number,
            _actualPrice: number
        ): number => {
            if (actualPrice === 0) return 0;
            const percentageError =
                Math.abs((predictedPrice - _actualPrice) / _actualPrice) * 100;
            return Math.max(0, Math.min(100, 100 - percentageError));
        };

        // Check all series for matching timestamps
        w.config.series.forEach((series) => {
            const matchingPoint = series.data.find(
                (point) => Math.abs(point.x - timestamp) <= TIMESTAMP_TOLERANCE
            );

            if (matchingPoint) {
                const isActual = series.name.includes("Actual");
                let caseType: EPredictionCase | undefined;
                let startDate: number | undefined;
                let calculatedAccuracy: number | undefined;

                if (!isActual) {
                    // Extract metadata from series name: "Prediction on {createdAt} ({accuracyScore}% accuracy)"
                    const nameMatch = series.name.match(
                        /Prediction on (\d+) \((\d+)% accuracy\)/
                    );
                    if (nameMatch) {
                        startDate = parseInt(nameMatch[1], 10);
                    }

                    // Find case type by matching color
                    caseType = Object.keys(caseColors).find(
                        (key) =>
                            caseColors[key as EPredictionCase] === series.color
                    ) as EPredictionCase;

                    // Calculate real-time accuracy if we have actual price data
                    if (actualPrice !== undefined) {
                        calculatedAccuracy = calculateAccuracy(
                            matchingPoint.y,
                            actualPrice
                        );
                    }

                    // Filter by selected case - only show if case matches the current filter
                    const shouldShowInTooltip =
                        !selectedCase ||
                        selectedCase === "all" ||
                        selectedCase === caseType;

                    if (!shouldShowInTooltip) {
                        return; // Skip this prediction in tooltip
                    }
                }

                matchingData.push({
                    seriesName: series.name,
                    price: matchingPoint.y,
                    color: series.color,
                    isActual,
                    case: caseType,
                    startDate,
                    calculatedAccuracy,
                });
            }
        });

        // Sort: actual data first, then by case order
        const caseOrder = [
            EPredictionCase.OPTIMISTIC,
            EPredictionCase.BASELINE,
            EPredictionCase.PESSIMISTIC,
        ];
        matchingData.sort((a, b) => {
            if (a.isActual && !b.isActual) return -1;
            if (!a.isActual && b.isActual) return 1;
            if (!a.isActual && !b.isActual && a.case && b.case) {
                return caseOrder.indexOf(a.case) - caseOrder.indexOf(b.case);
            }
            return 0;
        });

        const getCaseName = (caseType: EPredictionCase) => {
            switch (caseType) {
                case EPredictionCase.OPTIMISTIC:
                    return "Optimistic";
                case EPredictionCase.BASELINE:
                    return "Baseline";
                case EPredictionCase.PESSIMISTIC:
                    return "Pessimistic";
                default:
                    return "Prediction";
            }
        };

        return renderToString(
            <div className="px-2.5 py-2 flex flex-col break-word rounded-[5px] bg-backgroundVariant100 border-[0.5px] border-borderLine fontGroup-support text-primary">
                <div className="mb-2 text-white fontGroup-support !font-semibold">
                    {moment(timestamp).format("MMM DD, YYYY")}{" "}
                    {moment(timestamp).format("HH:mm")}
                </div>

                {matchingData.map((data) => (
                    <div
                        key={data.seriesName}
                        className="mb-1 flex justify-between w-full"
                    >
                        <div className="text-white fontGroup-support inline">
                            <div
                                className="inline-flex mr-1.5 mb-0.5 self-start w-1 h-1 rounded-full"
                                style={{ backgroundColor: data.color }}
                            />
                            {data.isActual ? (
                                "Historical Price:"
                            ) : (
                                <span>
                                    {getCaseName(data.case as EPredictionCase)}
                                    {data.startDate && (
                                        <span className="text-xs text-gray-400 ml-1">
                                            (Started:{" "}
                                            {moment(data.startDate).format(
                                                "MMM DD"
                                            )}
                                            )
                                        </span>
                                    )}
                                </span>
                            )}
                        </div>
                        <div className="inline ml-1 text-white">
                            {
                                formatNumber({
                                    value: data.price,
                                    style: ENumberStyle.Currency,
                                    currency: "USD",
                                }).value
                            }
                            {data.calculatedAccuracy !== undefined && (
                                <span className="text-xs text-gray-400 ml-1">
                                    ({data.calculatedAccuracy.toFixed(1)}%)
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

const FlakeOffChart = ({
    flakeOffData,
    marketHistory,
    selectedCase,
}: {
    flakeOffData: TFlakeOffData | undefined;
    marketHistory: TCoinMarketHistory | undefined;
    selectedCase: EPredictionCase | "all" | undefined;
}) => {
    // Transform base historical data to ApexCharts format
    const transformedHistoryData = useMemo((): TSeries => {
        const coinName = marketHistory?.coin.name;
        const coinTicker = marketHistory?.coin.ticker;
        const chartPoints = marketHistory?.history?.prices?.map(
            ([timestamp, price]) => ({
                x: timestamp, // Already in milliseconds
                y: price,
            })
        );
        const lastPrice = chartPoints?.[chartPoints.length - 1]?.y;
        const startPrice = chartPoints?.[0]?.y;

        const color =
            (lastPrice &&
                startPrice &&
                (lastPrice > startPrice || lastPrice === startPrice
                    ? themeColors.success
                    : themeColors.secondaryOrangeSoda)) ||
            "var(--alpha-primary)";

        return {
            name: `${coinName} (${coinTicker}) - Actual`,
            data: chartPoints ?? [],
            type: "line",
            color,
            strokeWidth: 3,
            zIndex: 20, // Highest priority for actual data
            opacity: 1,
        };
    }, [marketHistory]);

    const transformedPredictionData = useMemo(() => {
        const series = [] as TSeries[];

        // Process each prediction
        flakeOffData?.data?.forEach((prediction) => {
            // Filter by selected case - show all if selectedCase is undefined, "all", or matches the prediction case
            const shouldShowCase =
                !selectedCase ||
                selectedCase === "all" ||
                selectedCase === prediction.case;

            if (!shouldShowCase) {
                return; // Skip this prediction
            }

            // Convert chart_data to ApexCharts format
            const chartPoints = prediction.chartData
                .slice(0, 8)
                .map((point) => ({
                    x: point.timestamp, // Already in milliseconds
                    y: point.price,
                }));

            // insert the closest point from the base data to the prediction data
            const closestPoint = marketHistory?.history?.prices?.reduce(
                (closest, current) => {
                    if (!prediction.chartData?.[0]) return closest;

                    const targetTimestamp = prediction.chartData[0].timestamp;
                    const currentDiff = Math.abs(current[0] - targetTimestamp);
                    const closestDiff = closest
                        ? Math.abs(closest[0] - targetTimestamp)
                        : Infinity;

                    return currentDiff < closestDiff ? current : closest;
                },
                null as [number, number] | null
            );
            if (closestPoint) {
                chartPoints.unshift({
                    x: closestPoint[0],
                    y: closestPoint[1],
                });
            }

            // Add anchor point if it exists and is different from first point
            const seriesData = [...chartPoints] as TChartPoint[];

            series.push({
                name: `Prediction on ${prediction.createdAt} (${prediction.accuracyScore}% accuracy)`,
                data: seriesData,
                type: "line",
                color: caseColors[prediction.case],
                strokeWidth: 2,
                zIndex: 1,
                strokeDashArray: 0,
                opacity: 0.8,
            });
        });

        return series;
    }, [flakeOffData, marketHistory?.history?.prices, selectedCase]);

    const series = useMemo(() => {
        const dataSeries = [
            transformedHistoryData,
            ...transformedPredictionData,
        ];
        return dataSeries;
    }, [transformedHistoryData, transformedPredictionData]);

    const minValue = useMemo(() => {
        const data = series.flatMap((s) => s.data.map((point) => point.y));
        return Math.min(...data);
    }, [series]);

    const maxValue = useMemo(() => {
        const data = series.flatMap((s) => s.data.map((point) => point.y));
        return Math.max(...data);
    }, [series]);

    const options = {
        chart: {
            type: "line",
            zoom: {
                enabled: false,
                type: "x",
                autoScaleYaxis: false,
            },
            toolbar: {
                show: false,
            },
            animations: {
                enabled: true,
                easing: "easeinout",
                speed: 800,
            },
            redrawOnParentResize: true,
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "straight",
            width: [3], // Thicker line for actual data
        },
        legend: {
            show: false,
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
                datetimeFormatter: {
                    year: "yyyy",
                    month: "MMM 'yy",
                    day: "dd MMM",
                    hour: "HH:mm",
                },
                style: {
                    colors: "var(--alpha-primary-200)",
                    fontSize: "10px",
                    fontFamily: "Arial, sans-serif",
                    fontWeight: 500,
                    cssClass: "apexcharts-xaxis-label",
                },
                // formatter: (value: number) => {
                //     console.log("value date", value);
                //     return new Date(value).toLocaleDateString("en-US", {
                //         month: "short",
                //         day: "numeric",
                //         // year: "2-digit",
                //     });
                // },
            },
        },
        yaxis: {
            tickAmount: 3,
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
            custom: renderCustomTooltip(selectedCase),
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: false,
                },
            },
        },
    };

    return (
        <div
            className={twMerge(
                "w-full [&>div]:-mx-[10px] h-[368px] line-chart",
                "[&_.apexcharts-svg]:h-[404px] [&_.apexcharts-xaxis-annotations_line[id^='SvgjsLine'][stroke='var(--alpha-primary)']]:scale-y-[1.2]"
            )}
        >
            <ApexLineChart
                options={options}
                series={series}
                width="100%"
                height="100%"
            />
        </div>
    );
};

export default FlakeOffChart;
