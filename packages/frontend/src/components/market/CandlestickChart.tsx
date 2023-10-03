import { FC, memo } from "react";
import { ApexCandleChart, Spinner, themeColors } from "@alphaday/ui-kit";
import moment from "moment";
import { ENumberStyle, formatNumber } from "src/api/utils/format";
import { minVal } from "src/api/utils/helpers";
import styles from "./Market.module.scss";

type IProps = {
    data: number[][];
    isLoading?: boolean;
};

type TApexChartWindow = {
    globals: {
        seriesNames: string[];
    };
};

// see https://apexcharts.com/docs/options/tooltip/
type TCustomTooltip = {
    series: number[][];
    seriesIndex: number;
    dataPointIndex: number;
    w: TApexChartWindow;
};

const CandlestickChart: FC<IProps> = memo(function CandlestickChart({
    data,
    isLoading,
}) {
    const minValue = minVal(data || [[0], [0]])[0];

    const options = {
        chart: {
            type: "area",
            stacked: false,
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
            redrawOnParentResize: true,
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
            width: 1.5,
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: themeColors.secondaryYellowGreen,
                    downward: themeColors.secondaryOrangeSoda,
                },
            },
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
            tickPlacement: "on",
            labels: {
                style: {
                    colors: themeColors.btnRingVariant500,
                    fontSize: "10px",
                    fontFamily: "Open sans, sans-serif",
                    fontWeight: 700,
                },
            },
        },
        yaxis: {
            show: true,
            opposite: true,
            tickAmount: 3,
            min: minValue * 0.99,
            max: (max: number) => {
                return max * 1.001;
            },
            decimalsInFloat: false,
            labels: {
                align: "left",
                style: {
                    colors: themeColors.primaryVariant100,
                    fontSize: "10px",
                    fontFamily: "Open sans, sans-serif",
                    fontWeight: 700,
                    cssClass: "apexcharts-xaxis-label",
                },
                formatter: (val: number) => {
                    return new Intl.NumberFormat("en-US", {
                        maximumSignificantDigits: 6,
                    }).format(val);
                },
            },
        },
        grid: {
            borderColor: themeColors.btnRingVariant500,
            strokeDashArray: 0,
            xaxis: {
                lines: {
                    show: true,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
            column: {
                colors: themeColors.btnRingVariant500,
                opacity: 1,
            },
        },
        tooltip: {
            fillSeriesColor: themeColors.white,
            title: {
                formatter: (seriesName: string) => `$${seriesName}`,
            },
            y: {
                formatter: undefined,
                title: {
                    formatter: (val: string) => {
                        return `
                        <span
                            style="color:${String(themeColors.white)};"
                        >
                            ${val}:
                        </span>`;
                    },
                },
            },
            custom: ({ dataPointIndex }: TCustomTooltip) => {
                return `
                <div
                    class="price-tooltip"
                >
                <span class="date">
                    ${moment(data[dataPointIndex][0]).format(
                        "YYYY-MM-DD  hh:mm"
                    )}
                </span>
                <span class="price">
                    <span classname="tag">O</span>: $${String(
                        formatNumber({
                            value: data[dataPointIndex][1],
                            style: ENumberStyle.Currency,
                            currency: "USD",
                        }).value
                    )}
                </span>
                <span class="price">
                    <span classname="tag">H</span>: $${String(
                        formatNumber({
                            value: data[dataPointIndex][2],
                            style: ENumberStyle.Currency,
                            currency: "USD",
                        }).value
                    )}
                </span>
                <span class="price">
                    <span classname="tag">L</span>: $${String(
                        formatNumber({
                            value: data[dataPointIndex][3],
                            style: ENumberStyle.Currency,
                            currency: "USD",
                        }).value
                    )}
                </span>
                <span class="price">
                    <span classname="tag">C</span>: $${String(
                        formatNumber({
                            value: data[dataPointIndex][4],
                            style: ENumberStyle.Currency,
                            currency: "USD",
                        }).value
                    )}
                </span>
                </div>
                `;
            },
        },
        responsive: [
            {
                breakpoint: 575,
                options: {
                    chart: {
                        height: 200,
                    },
                    xaxis: {
                        show: false,
                    },
                },
            },
        ],
    };

    const chartSeries = [
        {
            name: "Price",
            data,
        },
    ];

    return (
        <div className="p-0 flex flex-1 basis-auto min-h-[1px]">
            {isLoading ? (
                <div className="flex w-full h-[200px] items-center justify-center">
                    <Spinner size="sm" />
                </div>
            ) : (
                <div className={`${styles.chart} candlestick`}>
                    <ApexCandleChart
                        options={options}
                        series={chartSeries}
                        width="99%"
                        height="100%"
                    />
                </div>
            )}
        </div>
    );
});

export default CandlestickChart;
