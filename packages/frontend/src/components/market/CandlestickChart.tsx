import { FC, memo } from "react";
import { ApexCandleChart, Spinner, themeColors } from "@alphaday/ui-kit";
import moment from "moment";
import { ENumberStyle, formatNumber } from "src/api/utils/format";
import { minVal } from "src/api/utils/helpers";
import { renderToString } from "src/api/utils/textUtils";

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
                    colors: themeColors.borderLine,
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
            borderColor: themeColors.borderLine,
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
                colors: themeColors.borderLine,
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
                        return renderToString(
                            <span className="text-white">${val}:</span>
                        );
                    },
                },
            },
            custom: ({ dataPointIndex }: TCustomTooltip) => {
                return renderToString(
                    <div className="price-tooltip">
                        <span className="date">
                            {moment(data[dataPointIndex][0]).format(
                                "YYYY-MM-DD  hh:mm"
                            )}
                        </span>
                        <span className="price">
                            <span className="tag">O</span>: {}
                            {
                                formatNumber({
                                    value: data[dataPointIndex][1],
                                    style: ENumberStyle.Currency,
                                    currency: "USD",
                                }).value
                            }
                        </span>
                        <span className="price">
                            <span className="tag">H</span>: {}
                            {
                                formatNumber({
                                    value: data[dataPointIndex][2],
                                    style: ENumberStyle.Currency,
                                    currency: "USD",
                                }).value
                            }
                        </span>
                        <span className="price">
                            <span className="tag">L</span>: {}
                            {
                                formatNumber({
                                    value: data[dataPointIndex][3],
                                    style: ENumberStyle.Currency,
                                    currency: "USD",
                                }).value
                            }
                        </span>
                        <span className="price">
                            <span className="tag">C</span>: {}
                            {
                                formatNumber({
                                    value: data[dataPointIndex][4],
                                    style: ENumberStyle.Currency,
                                    currency: "USD",
                                }).value
                            }
                        </span>
                    </div>
                );
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

    if (isLoading) {
        return (
            <div className="flex w-full h-[200px] items-center justify-center">
                <Spinner size="sm" />
            </div>
        );
    }

    return (
        <div className="w-full h-[200px] [&>div]:-mx-[10px] two-col:h-[284px] candlestick-chart">
            <ApexCandleChart
                options={options}
                series={chartSeries}
                width="99%"
                height="100%"
            />
        </div>
    );
});

export default CandlestickChart;
