import moment from "moment-with-locales-es6";
import { themeColors } from "src/globalStyles/themes";
import { renderToString } from "src/utils/textUtils";

type TApexChartWindow = {
    globals: {
        seriesNames: string[];
    };
};

const BarChartData = [
    ["01-Feb-2024 GMT+1", 14],
    ["02-Feb-2024 GMT+1", 14],
    ["03-Feb-2024 GMT+1", 20],
    ["04-Feb-2024 GMT+1", 16],
    ["05-Feb-2024 GMT+1", 11],
    ["06-Feb-2024 GMT+1", 19],
    ["07-Feb-2024 GMT+1", 14],
    ["08-Feb-2024 GMT+1", 8],
    ["09-Feb-2024 GMT+1", 12],
    ["10-Feb-2024 GMT+1", 20],
    ["11-Feb-2024 GMT+1", 14],
    ["12-Feb-2024 GMT+1", 7],
    ["13-Feb-2024 GMT+1", 6],
    ["14-Feb-2024 GMT+1", 21],
];

const BarChartOptions = {
    chart: {
        type: "area",
        stacked: true,
        zoom: {
            enabled: true,
            type: "x",
            autoScaleYaxis: false,
            zoomedArea: {
                fill: {
                    color: themeColors.accentVariant200,
                    opacity: 0.4,
                },
                stroke: {
                    color: themeColors.backgroundBlue,
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
    colors: ["rgba(109, 210, 48, 0.5)", "rgba(109, 210, 48, 0.5)"],
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
            gradientToColors: [themeColors.success, themeColors.success],
            shadeIntensity: 1,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [0, 100],
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
        tickAmount: Math.min(BarChartData.length, 8) - 1,
        labels: {
            datetimeUTC: false,
            formatter(_val: string, timestamp: number) {
                return moment(timestamp).format("DD-MM-YYYY");
            },
            style: {
                colors: themeColors.borderLine,
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
        min: 0,
        max: (max: number) => {
            return max * 1.001;
        },
        decimalsInFloat: false,
    },
    grid: {
        borderColor: themeColors.borderLine,
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
        custom: ({
            series,
            seriesIndex,
            dataPointIndex,
            w,
        }: {
            series: number[][];
            seriesIndex: number;
            dataPointIndex: number;
            w: TApexChartWindow;
        }) => {
            return renderToString(
                <div className="px-3 py-2 flex flex-col break-word bg-backgroundVariant300 fontGroup-support text-primary">
                    <span className="fontGroup-supportBold [&_span]:fontGroup-support">
                        {w.globals.seriesNames[0]}: {}
                        {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 2,
                        }).format(series[seriesIndex][dataPointIndex])}
                    </span>
                    <span className="pt-[1px]">
                        {moment(BarChartData[dataPointIndex][0]).format(
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
                    height: 200,
                },
                xaxis: {
                    show: false,
                },
            },
        },
    ],
};

export const BarChartSampleSeries = [
    {
        name: "Price",
        data: BarChartData,
    },
];

export const BarChartSampleOptions = BarChartOptions;
