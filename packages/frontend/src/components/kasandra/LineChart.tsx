import { FC, memo, useState } from "react";
import { ApexAreaChart, Spinner, themeColors } from "@alphaday/ui-kit";
import { TChartRange } from "src/api/types";
import { minVal } from "src/api/utils/helpers";
import { ReactComponent as ZoomResetSVG } from "src/assets/icons/zoom-reset.svg";

type IProps = {
    data: number[][];
    selectedChartRange: TChartRange;
    isLoading?: boolean;
};

// type TApexChartWindow = {
//     globals: {
//         seriesNames: string[];
//     };
// };

// see https://apexcharts.com/docs/options/tooltip/
// type TCustomTooltip = {
//     series: number[][];
//     seriesIndex: number;
//     dataPointIndex: number;
//     w: TApexChartWindow;
// };

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

    const options = {
        chart: {
            type: "area",
            stacked: false,
            events: {},
            zoom: {
                enabled: true,
                type: "x",
                autoScaleYaxis: false,
                zoomedArea: {
                    fill: {
                        color: "var(--alpha-light-blue-100)",
                        opacity: 0.4,
                    },
                    stroke: {
                        color: "var(--alpha-dark-blue)",
                        opacity: 0.4,
                        width: 1,
                    },
                },
            },
            toolbar: {
                show: false,
            },
            animations: {
                enabled: false,
            },
            redrawOnParentResize: true,
        },
        // color selection should match the case
        colors: [
            "var(--alpha-green)",
            "var(--alpha-bullish)",
            "var(--alpha-base)",
            "var(--alpha-bearish)",
        ],
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
            width: [1.5, 1, 1, 1],
            dashArray: [0, 3, 3, 3],
        },
        fill: {
            type: "gradient",
            gradient: {
                type: "vertical",
                gradientToColors: [
                    "var(--alpha-dark-base)",
                    "var(--alpha-dark-base)",
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
        annotations: {
            xaxis: [
                {
                    x: 1741206976945, // TODO use Now date
                    borderColor: "#775DD0",
                    borderWidth: 1.5,
                    strokeDashArray: 4,
                    label: {
                        style: {
                            background: "var(--alpha-base-400)",
                            color: "var(--alpha-primary)",
                            fontSize: "11px",
                            fontFamily: "'Open sans', sans-serif",
                            fontWeight: 500,
                            letterSpacing: "1px !important",
                        },
                        text: "Predictions",
                        offsetX: 17.5,
                        offsetY: -10,
                    },
                },
                {
                    x: 1741189586118,
                    x2: 1741195875967,
                    fillColor: "#B3F7CA",
                    label: {
                        text: "Trump Election",
                        orientation: "horizontal",
                        offsetX: 45,
                        offsetY: 10,
                        style: {
                            background: "var(--alpha-base-400)",
                            color: "var(--alpha-primary)",
                        },
                    },
                },
            ],
            points: [
                {
                    x: 1741178438708, // TODO use Now date
                    y: 90642.95015625951,
                    mouseEnter: () => {
                        console.log("onMouseEnter");
                    },
                    marker: {
                        size: 4,
                        css: {
                            filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.25))",
                        },
                        offsetY: 3,
                    },
                    label: {
                        borderColor: "#775DD0",
                        text: "SEC clears Uniswap",
                        style: {
                            background: "var(--alpha-base-400)",
                            color: "var(--alpha-primary)",
                        },
                    },
                },
            ],
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
                    colors: "var(--alpha-border)",
                    fontSize: "10px",
                    fontFamily: "Arial, sans-serif",
                    fontWeight: 700,
                    cssClass: "apexcharts-xaxis-label",
                },
            },
            convertedCatToNumeric: false,
        },
        yaxis: {
            show: false,
            tickAmount: 3,
            min: 83328.69486633895,
            max:
                97577.94333367079 +
                (97577.94333367079 - 83328.69486633895) * 0.15, // TODO (max) + size of the future annotation in percentage ~= 15%
            decimalsInFloat: false,
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
            column: {
                colors: "var(--alpha-border)",
                opacity: 1,
            },
        },
        tooltip: {
            shared: true,
            fillSeriesColor: "#121212",
            y: {
                formatter: undefined,
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

    if (isLoading) {
        return (
            <div className="flex w-full h-[200px] items-center justify-center">
                <Spinner size="sm" />
            </div>
        );
    }

    return (
        <div className="w-full h-[200px] [&>div]:-mx-[10px] two-col:h-[284px] line-chart">
            <ApexAreaChart
                key={zoomKey}
                options={options}
                series={chartSeries}
                width="100%"
                height="100%"
            />
            {showResetZoom && (
                <ZoomResetSVG onClick={resetZoom} className="zoom-reset" />
            )}
        </div>
    );
});

export default LineChart;
