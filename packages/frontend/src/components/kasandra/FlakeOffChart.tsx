import { useMemo } from "react";
import { ApexLineChart, twMerge } from "@alphaday/ui-kit";
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

const renderCustomTooltip = () => (props: TCustomTooltip) => {
    const { seriesIndex, dataPointIndex, w } = props;
    const currentSeries = w.config.series[seriesIndex];
    const dataPoint = currentSeries.data[dataPointIndex];

    if (!dataPoint) return "";

    const timestamp = dataPoint.x;
    const TIMESTAMP_TOLERANCE = 1 * 60 * 1000; // 1 minute in milliseconds

    // Find all series with data points near this timestamp
    const matchingData: Array<{
        seriesName: string;
        price: number;
        color: string;
        isActual: boolean;
        case?: EPredictionCase;
        startDate?: number;
        accuracy?: number;
    }> = [];

    // Check all series for matching timestamps
    w.config.series.forEach((series) => {
        const matchingPoint = series.data.find(
            (point) => Math.abs(point.x - timestamp) <= TIMESTAMP_TOLERANCE
        );

        if (matchingPoint) {
            const isActual = series.name.includes("Actual");
            let caseType: EPredictionCase | undefined;
            let startDate: number | undefined;
            let accuracy: number | undefined;

            if (!isActual) {
                // Extract metadata from series name: "Prediction on {createdAt} ({accuracyScore}% accuracy)"
                const nameMatch = series.name.match(
                    /Prediction on (\d+) \((\d+)% accuracy\)/
                );
                if (nameMatch) {
                    startDate = parseInt(nameMatch[1], 10);
                    accuracy = parseInt(nameMatch[2], 10);
                }

                // Find case type by matching color
                caseType = Object.keys(caseColors).find(
                    (key) => caseColors[key as EPredictionCase] === series.color
                ) as EPredictionCase;
            }

            matchingData.push({
                seriesName: series.name,
                price: matchingPoint.y,
                color: series.color,
                isActual,
                case: caseType,
                startDate,
                accuracy,
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

    console.log("matchingData", matchingData);

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
                        {data.accuracy && (
                            <span className="text-xs text-gray-400 ml-1">
                                ({data.accuracy}%)
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
}: {
    flakeOffData: TFlakeOffData | undefined;
    marketHistory: TCoinMarketHistory | undefined;
}) => {
    // Transform base historical data to ApexCharts format
    const transformedBaseData = useMemo((): TSeries => {
        const coinName = marketHistory?.coin.name;
        const coinTicker = marketHistory?.coin.ticker;
        const chartPoints = marketHistory?.history?.prices?.map(
            ([timestamp, price]) => ({
                x: timestamp, // Already in milliseconds
                y: price,
            })
        );

        return {
            name: `${coinName} (${coinTicker}) - Actual`,
            data: chartPoints ?? [],
            type: "line",
            color: "var(--alpha-primary)",
            strokeWidth: 3,
            zIndex: 20, // Highest priority for actual data
            opacity: 1,
        };
    }, [marketHistory]);

    const transformedPredictionData = useMemo(() => {
        const series = [] as TSeries[];

        // Process each prediction
        flakeOffData?.data?.forEach((prediction) => {
            // Convert chart_data to ApexCharts format
            const chartPoints = prediction.chartData.map((point) => ({
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
    }, [flakeOffData, marketHistory?.history?.prices]);

    const series = useMemo(() => {
        const dataSeries = [transformedBaseData, ...transformedPredictionData];
        return dataSeries;
    }, [transformedBaseData, transformedPredictionData]);

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
            // convertedCatToNumeric: false,
        },
        yaxis: {
            tickAmount: 3,
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
            custom: renderCustomTooltip(),
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
