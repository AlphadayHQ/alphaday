import { FC, memo } from "react";
import { twMerge } from "@alphaday/ui-kit";
import moment from "moment";
import { ApexAreaChart } from "src/components/charts/apexchart";
import { Spinner } from "src/components/spinner/Spinner";
import { darkColors } from "src/globalStyles/colors";
import { renderToString } from "src/utils/textUtils";

type IProps = {
    data: number[][];
    isLoading?: boolean;
    className?: string;
    isPreview?: boolean;
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

function minVal(items: number[][]): number[] {
    return items.reduce(
        (acc, val) => {
            // eslint-disable-next-line no-param-reassign
            acc[0] = val[1] < acc[0] ? val[1] : acc[0];
            return acc;
        },
        [1e10]
    );
}

const LineChart: FC<IProps> = memo(function LineChart({
    data,
    isLoading,
    className,
    isPreview,
}) {
    const minValue = minVal(data || [[0], [0]])[0];
    const startPrice = data[0][1];
    const lastPrice = data[data.length - 1][1];

    const chartColor =
        lastPrice > startPrice || lastPrice === startPrice
            ? darkColors.success
            : darkColors.secondaryOrangeSoda;

    const options = {
        chart: {
            type: "area",
            stacked: true,
            zoom: {
                enabled: true,
                type: "x",
                autoScaleYaxis: false,
                zoomedArea: {
                    fill: {
                        color: darkColors.accentVariant200,
                        opacity: 0.4,
                    },
                    stroke: {
                        color: darkColors.backgroundBlue,
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
                gradientToColors: [
                    darkColors.background,
                    darkColors.background,
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
                    return isPreview ? "" : moment(timestamp).format("DD MMM");
                },
                style: {
                    colors: darkColors.borderLine,
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
            borderColor: darkColors.borderLine,
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
                colors: darkColors.borderLine,
                opacity: 1,
            },
        },
        tooltip: {
            enabled: !isPreview,
            fillSeriesColor: darkColors.white,
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
            custom: ({
                series,
                seriesIndex,
                dataPointIndex,
                w,
            }: TCustomTooltip) => {
                return renderToString(
                    <div className="px-3 py-2 flex flex-col break-word rounded-[5px] bg-backgroundVariant300 border border-borderLine fontGroup-support text-primary">
                        <span className="fontGroup-supportBold [&_span]:fontGroup-support">
                            {w.globals.seriesNames[0]}: {}
                            {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 2,
                            }).format(series[seriesIndex][dataPointIndex])}
                        </span>
                        <span className="pt-[1px]">
                            {moment(data[dataPointIndex][0]).format(
                                "YYYY-MM-DD  HH:mm"
                            )}
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
                        height: isPreview ? 110 : 200,
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
        <div
            className={twMerge(
                "w-full h-[200px] [&>div]:-mx-[10px] line-chart [&_.apexcharts-xaxis-texts-g]:[transform:translate(12px,_-4px)] [&_.apexcharts-grid-borders_line]:stroke-borderLine",
                isPreview && "[&>div]:mx-[4px]",
                className
            )}
        >
            <ApexAreaChart
                options={options}
                series={chartSeries}
                width={isPreview ? "150px" : "100%"}
                height={isPreview ? "90px" : "100%"}
            />
        </div>
    );
});

export default LineChart;
