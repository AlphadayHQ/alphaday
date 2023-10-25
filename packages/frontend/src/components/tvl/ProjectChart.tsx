import { useMemo, FC } from "react";
import { ApexAreaChart, themeColors } from "@alphaday/ui-kit";
import moment from "moment";
import { TTvlHistory } from "src/api/types";
import { minVal } from "src/api/utils/helpers";

// some data comes in non ISO format and moment throws a warning in those cases
const nonIsoDateRegExp =
    /^\D{3}\s\D{3}\s\d{2}\s\d{4}\s\d{2}:\d{2}:\d{2}\sGMT-\d{4}$/;

interface IProps {
    projectHistory: TTvlHistory | void;
}
const TVLChart: FC<IProps> = ({ projectHistory }) => {
    const defaultChartOptions = useMemo(
        () => ({
            chart: {
                sparkline: {
                    enabled: true,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: [themeColors.success],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "smooth",
                width: [1.7, 1],
            },
            fill: {
                type: "gradient",
                gradient: {
                    shade: "light",
                    type: "vertical",
                    shadeIntensity: 1,
                    gradientToColors: [themeColors.success],
                    inverseColors: false,
                    opacityFrom: 0.4,
                    opacityTo: 0.2,
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
                        colors: themeColors.primaryVariant100,
                        fontSize: "10px",
                        fontFamily: "Arial, sans-serif",
                        fontWeight: 400,
                        cssClass: "apexcharts-xaxis-label",
                    },
                },
            },
            yaxis: {
                show: false,
                tickAmount: 3,
                min: (min: number): number => {
                    return min * 0.96;
                },
                max: (max: number): number => {
                    return max * 1.001;
                },
                decimalsInFloat: false,
                labels: {
                    style: {
                        colors: [themeColors.primaryVariant100],
                        fontSize: "10px",
                        fontFamily: "Arial, sans-serif",
                        fontWeight: 400,
                        cssClass: "apexcharts-yaxis-label",
                    },
                    formatter: (value: number) => {
                        return `$${new Intl.NumberFormat("en-US", {
                            maximumFractionDigits: 2,
                        }).format(value)}`;
                    },
                },
            },
            grid: {
                borderColor: themeColors.btnRingVariant500,
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
                yaxis: {
                    lines: {
                        show: false,
                    },
                },
            },
            tooltip: {
                enabled: false,
            },
        }),
        []
    );

    const projectTvlHistory = useMemo(() => {
        if (projectHistory === undefined) {
            return [{ name: "TVL", data: [[0]] }];
        }
        const data = projectHistory.map((e) => {
            let date;
            if (nonIsoDateRegExp.test(e.date)) {
                date = moment(new Date(e.date)).unix();
            } else {
                date = moment(e.date).unix();
            }
            return [Number(date), Number(e.tvlUsd)];
        });

        const sortedData = data.sort((a, b) => a[0] - b[0]);
        return [
            {
                name: "TVL",
                data: sortedData,
            },
        ];
    }, [projectHistory]);

    const chartOptions = useMemo(() => {
        const { data } = projectTvlHistory[0];
        if (data[0][0] === 0) return defaultChartOptions;
        const newChartOptions = defaultChartOptions;
        const minValue: number = minVal(data || [[0], [0]])[0];

        const indicatorColor =
            data[0][1] > data.slice(-1)[0][1]
                ? [themeColors.secondaryOrangeSoda]
                : [themeColors.success];

        newChartOptions.colors = indicatorColor;
        newChartOptions.fill.gradient.gradientToColors = indicatorColor;

        // The min value returned by the library is sometimes incorrect but is required to pass type check
        newChartOptions.yaxis.min = (_min: number) => minValue * 0.96;
        return newChartOptions;
    }, [defaultChartOptions, projectTvlHistory]);

    return (
        <ApexAreaChart
            options={chartOptions}
            series={projectTvlHistory}
            width="64"
            height="23"
        />
    );
};

export default TVLChart;
