import { useCallback, useMemo } from "react";
import { ApexLineChart, twMerge } from "@alphaday/ui-kit";
import { TCoinMarketHistory, TFlakeOffData } from "src/api/types";
import { ENumberStyle, formatNumber } from "src/api/utils/format";

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

const FlakeOffChart = ({
    flakeOffData,
    marketHistory,
}: {
    flakeOffData: TFlakeOffData | undefined;
    marketHistory: TCoinMarketHistory | undefined;
}) => {
    const transformPredictionData = useCallback(() => {
        const series = [] as TSeries[];

        // Process each prediction
        flakeOffData?.data?.forEach((prediction, index) => {
            // Convert chart_data to ApexCharts format
            const chartPoints = prediction.chartData.map((point) => ({
                x: point.timestamp, // Already in milliseconds
                y: point.price,
                // volatility: point.volatility, // Additional data for tooltip
            }));

            // Add anchor point if it exists and is different from first point
            const seriesData = [...chartPoints] as TChartPoint[];
            // if (
            //     prediction.anchor_point &&
            //     prediction.anchor_point.timestamp !== chartPoints[0]?.x
            // ) {
            //     seriesData.unshift({
            //         x: prediction.anchor_point.timestamp,
            //         y: prediction.anchor_point.price,
            //         isAnchor: true,
            //     });
            // }

            series.push({
                name: `Prediction on ${prediction.createdAt} (${prediction.accuracyScore}% accuracy)`,
                data: seriesData,
                type: "line",
                color: `hsl(${(index * 50) % 360}, 70%, 60%)`,
                // color: "#FF9F43",
                strokeWidth: 2,
                strokeDashArray: prediction.case === "baseline" ? 0 : 5, // Solid for baseline, dashed for others
                zIndex: prediction.case === "baseline" ? 10 : 1,
                opacity: prediction.case === "baseline" ? 1 : 0.8,
            });
        });

        return series;
    }, [flakeOffData]);

    // Transform base historical data to ApexCharts format
    const transformBaseData = useCallback((): TSeries => {
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

    const series = useMemo(() => {
        const dataSeries = [transformBaseData(), ...transformPredictionData()];
        return dataSeries;
    }, [transformBaseData, transformPredictionData]);

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
        colors: [
            "var(--alpha-primary)",
            // "#FF6B6B",
            // "#4ECDC4",
            // "#45B7D1",
            // "#96CEB4",
            // "#FECA57",
            // "#FF9FF3",
            // "#54A0FF",
            // "#5F27CD",
            // "#00D2D3",
            "#FF9F43",
            "#FF9F43",
            "#FF9F43",
            "#FF9F43",
            "#FF9F43",
            "#FF9F43",
            "#FF9F43",
        ],
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "straight",
            width: [3, ...Array(10).fill(2)], // Thicker line for actual data
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
                // format: "MMM dd", // Add this line for date formatting
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
            shared: true,
            intersect: false,
            x: {
                format: "MMM dd, yyyy",
            },
            y: {
                formatter(val: number) {
                    return `$${val.toFixed(2)}`;
                },
            },
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
