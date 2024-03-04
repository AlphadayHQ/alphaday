import { FC, useMemo } from "react";
import { ApexDonutChart, themeColors } from "@alphaday/ui-kit";
import { makeRepeated } from "src/api/utils/itemUtils";
import { getAssetPrefix } from "src/api/utils/portfolioUtils";
import { ITEM_COLORS } from "src/components/item-colors";
import { TPortfolioDataForAddress } from "src/components/portfolio/types";
import CONFIG from "src/config";
import { portfolioData } from "./mockData";

const { DONUT_TOKENS_COUNT } = CONFIG.WIDGETS.PORTFOLIO;

const PortfolioChart: FC = () => {
    const assets = useMemo<TPortfolioDataForAddress["assets"]>(
        () =>
            portfolioData !== undefined
                ? [...portfolioData.assets].sort(
                      (a, b) => b.token.balanceUSD - a.token.balanceUSD
                  )
                : [],
        []
    );

    const labels: string[] = [];
    const series = assets.map((item) => {
        labels.push(
            `${item.token.symbol}${getAssetPrefix(item).toUpperCase()}`
        );
        return Number(item.token.balanceUSD);
    });
    const othersBalance =
        series.length > DONUT_TOKENS_COUNT
            ? series.splice(DONUT_TOKENS_COUNT).reduce((n, p) => n + p)
            : 0;
    const donutData = {
        options: {
            chart: {
                id: "portfolio-donut",
                sparkline: {
                    enabled: false,
                },
                background: "transparent",
                redrawOnWindowResize: true,
                height: "500px",
            },
            labels: [
                ...labels.slice(0, DONUT_TOKENS_COUNT),
                ...(othersBalance ? ["Others"] : []),
            ],
            dataLabels: {
                enabled: false,
            },
            tooltip: {
                y: {
                    formatter(value: number) {
                        return `$${new Intl.NumberFormat("en-US", {
                            maximumFractionDigits: 2,
                        }).format(value)}`;
                    },
                },
            },
            plotOptions: {
                pie: {
                    donut: {
                        customScale: 1.5,
                        size: 170,
                        background: "transparent",
                    },
                },
            },
            stroke: {
                colors: undefined,
            },
            legend: {
                show: true,
                fontSize: "11px",
                position: "left",
                offsetX: 0,
                offsetY: 0,
                height: 500,
                labels: {
                    colors: [themeColors.primaryVariant100],
                    useSeriesColors: false,
                },
                markers: {
                    radius: 3,
                },
                onItemHover() {},
                formatter(
                    label: string,
                    opts: {
                        w: {
                            globals: {
                                series: number[];
                            };
                        };
                        seriesIndex: number;
                    }
                ) {
                    const percent =
                        (100 * opts.w.globals.series[opts.seriesIndex]) /
                        opts.w.globals.series.reduce((a, b) => a + b);
                    return `
                        <span style="display: inline-flex; justify-content: space-between; width: 70%">
                            <div>${label}</div>
                            <div>&nbsp;${percent.toFixed(0)}%</div>
                        </span>`;
                },
            },
            colors: makeRepeated(ITEM_COLORS, assets.length),
        },
        series: [
            ...series.slice(0, DONUT_TOKENS_COUNT),
            ...(othersBalance ? [othersBalance] : []),
        ],
    };

    return (
        <div className="flex justify-between donut-chart sm-donut-chart">
            {donutData.series && (
                <ApexDonutChart
                    options={donutData?.options}
                    series={donutData?.series}
                    width="260px"
                    height="400px"
                />
            )}
        </div>
    );
};
export default PortfolioChart;
