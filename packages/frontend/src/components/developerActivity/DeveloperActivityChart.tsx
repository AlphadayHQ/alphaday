import { FC, useMemo } from "react";
import { ApexAreaChart, themeColors } from "@alphaday/ui-kit";
import { formatNumber, ENumberStyle } from "src/api/utils/format";

interface IProps {
    // [unix timestamp (seconds), value] pairs, oldest first
    series: Array<[number, number]>;
    height: number;
}

const DeveloperActivityChart: FC<IProps> = ({ series, height }) => {
    const chartSeries = useMemo(
        () => [
            {
                name: "value",
                data:
                    series.length > 0
                        ? series
                        : ([[0, 0]] as Array<[number, number]>),
            },
        ],
        [series]
    );

    const isUptrend =
        series.length > 1 && series[series.length - 1][1] >= series[0][1];
    const lineColor = isUptrend
        ? themeColors.success
        : themeColors.secondaryOrangeSoda;

    const chartOptions = useMemo(
        () => ({
            chart: {
                sparkline: { enabled: false },
                toolbar: { show: false },
                zoom: { enabled: false },
                animations: { enabled: false },
            },
            colors: [lineColor],
            dataLabels: { enabled: false },
            stroke: {
                curve: "smooth",
                width: 1.7,
            },
            fill: {
                type: "gradient",
                gradient: {
                    shade: "light",
                    type: "vertical",
                    shadeIntensity: 1,
                    gradientToColors: [lineColor],
                    inverseColors: false,
                    opacityFrom: 0.4,
                    opacityTo: 0.05,
                },
            },
            legend: { show: false },
            xaxis: {
                type: "datetime",
                axisBorder: { show: false },
                axisTicks: { show: false },
                tooltip: { enabled: false },
                labels: {
                    style: {
                        colors: themeColors.primaryVariant100,
                        fontSize: "10px",
                        fontFamily: "Arial, sans-serif",
                        fontWeight: 400,
                    },
                },
            },
            yaxis: {
                show: true,
                tickAmount: 3,
                decimalsInFloat: false,
                labels: {
                    style: {
                        colors: [themeColors.primaryVariant100],
                        fontSize: "10px",
                        fontFamily: "Arial, sans-serif",
                        fontWeight: 400,
                    },
                    formatter: (value: number) =>
                        formatNumber({
                            value,
                            style: ENumberStyle.Decimal,
                        }).value,
                },
            },
            grid: {
                borderColor: themeColors.borderLine,
                xaxis: { lines: { show: false } },
                yaxis: { lines: { show: true } },
                padding: { left: 4, right: 8, top: 0, bottom: 0 },
            },
            tooltip: {
                enabled: true,
                theme: "dark",
                x: { format: "dd MMM yyyy" },
                y: {
                    formatter: (value: number) =>
                        formatNumber({
                            value,
                            style: ENumberStyle.Decimal,
                        }).value,
                    title: { formatter: () => "" },
                },
            },
        }),
        [lineColor]
    );

    return (
        <ApexAreaChart
            options={chartOptions}
            series={chartSeries}
            width="100%"
            height={height}
        />
    );
};

export default DeveloperActivityChart;
