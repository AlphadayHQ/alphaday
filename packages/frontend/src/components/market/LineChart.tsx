import { FC, memo, useState } from "react";
import { ApexAreaChart, Spinner, themeColors } from "@alphaday/ui-kit";
import moment from "moment";
import { TChartRange } from "src/api/types";
import { ENumberStyle, formatNumber } from "src/api/utils/format";
import { minVal } from "src/api/utils/helpers";
import { ReactComponent as ZoomResetSVG } from "src/assets/icons/zoom-reset.svg";
import styles from "./Market.module.scss";

type IProps = {
    data: number[][];
    selectedChartRange: TChartRange;
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

const LineChart: FC<IProps> = memo(function LineChart({
    data,
    selectedChartRange,
    isLoading,
}) {
    const [zoomKey, setZoomKey] = useState(0);
    const [showResetZoom, setShowResetZoom] = useState(false);

    const minValue = minVal(data || [[0], [0]])[0];
    const startPrice = data[0][1];
    const lastPrice = data[data.length - 1][1];

    const chartColor =
        lastPrice > startPrice || lastPrice === startPrice
            ? themeColors.success
            : themeColors.secondaryOrangeSoda;
    const chartGradColor =
        lastPrice > startPrice || lastPrice === startPrice
            ? themeColors.successFiltered
            : themeColors.secondaryOrangeSodaFiltered;

    const options = {
        chart: {
            type: "area",
            stacked: true,
            events: {
                zoomed: () => {
                    setShowResetZoom(true);
                },
            },
            zoom: {
                enabled: true,
                type: "x",
                autoScaleYaxis: false,
                zoomedArea: {
                    fill: {
                        color: themeColors.btnRingVariant400,
                        opacity: 0.4,
                    },
                    stroke: {
                        color: themeColors.btnRingVariant200,
                        opacity: 0.4,
                        width: 1,
                    },
                },
            },
            toolbar: {
                show: false,
            },
            redrawOnParentResize: true,
        },
        colors: [chartColor, chartColor],
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
            width: 1.5,
        },
        fill: {
            type: "gradient",
            gradient: {
                type: "vertical",
                gradientToColors: [chartGradColor, chartGradColor],
                shadeIntensity: 0.01,
                opacityFrom: 0.7,
                opacityTo: 0.1,
                stops: [0, 90, 100],
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
            tickPlacement: "between",
            tickAmount: 8,
            labels: {
                datetimeUTC: false,
                formatter(_val: string, timestamp: number) {
                    return moment(timestamp).format(
                        selectedChartRange === "1D" ? "HH:mm" : "DD MMM"
                    );
                },
                style: {
                    colors: themeColors.btnRingVariant500,
                    fontSize: "10px",
                    fontFamily: "Arial, sans-serif",
                    fontWeight: 700,
                    cssClass: "apexcharts-xaxis-label",
                },
            },
        },
        yaxis: {
            show: false,
            tickAmount: 3,
            min: minValue * 0.98,
            max: (max: number) => {
                return max * 1.001;
            },
            decimalsInFloat: false,
        },
        grid: {
            borderColor: themeColors.btnRingVariant500,
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
            custom: ({
                series,
                seriesIndex,
                dataPointIndex,
                w,
            }: TCustomTooltip) => {
                return `
                <div
                    class="price-tooltip"
                >
                <span class="price">
                    ${String(w.globals.seriesNames[0])}: ${String(
                        formatNumber({
                            value: series[seriesIndex][dataPointIndex],
                            style: ENumberStyle.Currency,
                            currency: "USD",
                        }).value
                    )}
                </span>
                <span class="date">
                    ${moment(data[dataPointIndex][0]).format(
                        "YYYY-MM-DD  HH:mm"
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

    const resetZoom = () => {
        setZoomKey((prev) => prev + 1);
        setShowResetZoom(false);
    };

    return (
        <div className="p-0 flex flex-1 basis-auto min-h-[1px]">
            {isLoading ? (
                <div className="flex w-full h-[200px] items-center justify-center">
                    <Spinner size="sm" />
                </div>
            ) : (
                <div className={`${styles.chart} candlestick`}>
                    <ApexAreaChart
                        key={zoomKey}
                        options={options}
                        series={chartSeries}
                        width="100%"
                        height="100%"
                    />
                    {showResetZoom && (
                        <ZoomResetSVG
                            onClick={resetZoom}
                            className="zoom-reset"
                        />
                    )}
                </div>
            )}
        </div>
    );
});

export default LineChart;
