import { IonDatetime, setupIonicReact } from "@ionic/react";
import moment from "moment";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { ApexBarChart } from "./components/charts/apexchart";
import { themeColors } from "./globalStyles/themes";

setupIonicReact();

type TApexChartWindow = {
    globals: {
        seriesNames: string[];
    };
};

const renderToString = (node: JSX.Element): string => {
    const wrapper = document.createElement("div");
    const root = createRoot(wrapper);
    flushSync(() => root.render(node));
    return wrapper.innerHTML;
};

const data = [
    [(1703739600 + 1 * 86400) * 1000, 2],
    [(1703739600 + 2 * 86400) * 1000, 16],
    [(1703739600 + 3 * 86400) * 1000, 5],
    [(1703739600 + 4 * 86400) * 1000, 18],
    [(1703739600 + 5 * 86400) * 1000, 14],
    [(1703739600 + 6 * 86400) * 1000, 14],
    [(1703739600 + 7 * 86400) * 1000, 20],
    [(1703739600 + 8 * 86400) * 1000, 16],
    [(1703739600 + 9 * 86400) * 1000, 9],
    [(1703739600 + 10 * 86400) * 1000, 11],
    [(1703739600 + 11 * 86400) * 1000, 19],
    [(1703739600 + 12 * 86400) * 1000, 14],
    [(1703739600 + 13 * 86400) * 1000, 8],
    [(1703739600 + 14 * 86400) * 1000, 12],
    [(1703739600 + 15 * 86400) * 1000, 20],
    [(1703739600 + 16 * 86400) * 1000, 14],
    [(1703739600 + 17 * 86400) * 1000, 7],
    [(1703739600 + 18 * 86400) * 1000, 6],
    [(1703739600 + 19 * 86400) * 1000, 21],
    [(1703739600 + 20 * 86400) * 1000, 5],
];

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
        tickAmount: 7,
        labels: {
            datetimeUTC: false,
            formatter(_val: string, timestamp: number) {
                return moment(timestamp).format("DD/MM/YY");
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
        min: 0,
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
            // .price-tooltip {
            //     padding: 0.6em 0.8em;
            //     display: flex;
            //     flex-direction: column;
            //     word-wrap: break-word;
            //     @apply bg-primaryVariant200 fontGroup-support text-primary;

            //     .price {
            //         @apply fontGroup-supportBold;

            //         span {
            //             @apply fontGroup-support;
            //         }
            //     }
            //     .date {
            //         padding-top: 1px;
            //     }
            // }
            return renderToString(
                <div className="px-3 py-2 flex flex-col break-word bg-primaryVariant200 fontGroup-support text-primary">
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

function App() {
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center">
            <h1 className="text-primary text-lg font-semibold">
                Vite + React + Ionic + Tailwind
            </h1>
            {/* <IonDatetime className="mt-10" /> */}
            <div className="custom-charts-widget">
                <div className="barchart-styles bg-background w-[600px] h-[500px] flex flex-col gap-3 py-10 border-primary border">
                    <ApexBarChart
                        options={options}
                        series={chartSeries}
                        width="100%"
                        height="100%"
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
