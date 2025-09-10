import { useState, useEffect } from "react";
import { ApexLineChart } from "@alphaday/ui-kit";
import { ENumberStyle, formatNumber } from "src/api/utils/format";

type TDataPoint = {
    x: number;
    y: number;
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

const OverlappingPredictionsChart = () => {
    const [chartData, setChartData] = useState({
        series: [] as TSeries[],
        options: {},
    });

    // Generate sample price data for one month
    const generateBaseData = () => {
        const baseData = [] as TDataPoint[];
        const startDate = new Date(2024, 0, 1); // January 1, 2024
        const startPrice = 100;

        for (let i = 0; i < 31; i += 1) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);

            // Generate realistic price movement
            const randomChange = (Math.random() - 0.5) * 4; // ±2% daily change
            const price: number =
                i === 0 ? startPrice : baseData[i - 1].y + randomChange;

            baseData.push({
                x: date.getTime(),
                y: Math.max(price, 50), // Prevent negative prices
            });
        }

        return baseData;
    };

    // Generate prediction series starting from each day
    const generatePredictionSeries = (baseData: TDataPoint[]) => {
        const series: TSeries[] = [];
        const predictionDays = 5;

        // Add the actual price data
        series.push({
            name: "Actual Price",
            data: baseData,
            type: "line",
            color: "var(--alpha-primary)",
            strokeWidth: 3,
            zIndex: 10,
        });

        // Generate predictions starting from every 3rd day to avoid clutter
        for (
            let startDay = 0;
            startDay < baseData.length - predictionDays;
            startDay += 3
        ) {
            const predictionData = [];
            const startPoint = baseData[startDay];

            // Add the starting point
            predictionData.push(startPoint);

            // Generate 5-day prediction
            for (let i = 1; i <= predictionDays; i += 1) {
                const date = new Date(startPoint.x);
                date.setDate(date.getDate() + i);

                // Generate prediction with some variance
                const trendMultiplier = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
                const dailyChange = (Math.random() - 0.5) * 3; // ±1.5% daily change
                const lastPrice: number = predictionData[i - 1].y;
                const predictedPrice =
                    lastPrice + dailyChange * trendMultiplier;

                predictionData.push({
                    x: date.getTime(),
                    y: Math.max(predictedPrice, 50),
                });
            }

            series.push({
                name: `Prediction ${startDay + 1}`,
                data: predictionData,
                type: "line",
                color: `hsl(${(startDay * 40) % 360}, 70%, 60%)`,
                strokeWidth: 2,
                strokeDashArray: 5, // Dashed line for predictions
                zIndex: 1,
                opacity: 0.7,
            });
        }

        return series;
    };

    useEffect(() => {
        const baseData = generateBaseData();
        const series = generatePredictionSeries(baseData);

        setChartData({
            series,
            options: {
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
                stroke: {
                    curve: "straight",
                    width: [3, ...Array(10).fill(2)], // Thicker line for actual data
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
                colors: [
                    "var(--alpha-primary)", // Black for actual data
                    "#FF6B6B",
                    "#4ECDC4",
                    "#45B7D1",
                    "#96CEB4",
                    "#FECA57",
                    "#FF9FF3",
                    "#54A0FF",
                    "#5F27CD",
                    "#00D2D3",
                    "#FF9F43",
                ],
            },
        });
    }, []);

    return (
        <ApexLineChart
            options={chartData.options}
            series={chartData.series}
            width="100%"
            height="100%"
        />
    );
};

export default OverlappingPredictionsChart;
