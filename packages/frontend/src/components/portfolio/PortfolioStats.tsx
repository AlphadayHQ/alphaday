import { FC, useMemo, useEffect, useRef } from "react";
import {
    ApexDonutChart,
    ScrollBar,
    Skeleton,
    themeColors,
    twMerge,
} from "@alphaday/ui-kit";
import { useWidgetSize } from "src/api/hooks";
import { formatNumber, ENumberStyle } from "src/api/utils/format";
import { makeRepeated } from "src/api/utils/itemUtils";
import { getAssetPrefix } from "src/api/utils/portfolioUtils";
import { ReactComponent as ShowSVG } from "src/assets/icons/shown.svg";
import CONFIG from "src/config/config";
import globalMessages from "src/globalMessages";
import { ITEM_COLORS } from "../item-colors";
import { TPortfolioDataForAddress } from "./types";

const { TOKEN_METADATA_URL } = CONFIG.EXPLORERS;
const { DONUT_TOKENS_COUNT, SMALL_PRICE_CUTOFF_LG, SMALL_PRICE_CUTOFF_SM } =
    CONFIG.WIDGETS.PORTFOLIO;

interface IPortfolioStats {
    showAllAssets: boolean;
    showBalance: boolean;
    balancesQueryFailed: boolean;
    portfolioData: TPortfolioDataForAddress | undefined;
    toggleBalance: () => void;
    ethPrice?: number | undefined;
    moduleId: string;
    selectedAddress: string | null;
    widgetHeight: number;
}

const handleBalanceFigures = (val: string, show: boolean): string => {
    if (show) return val;
    return val
        .split("")
        .map(() => "*")
        .join("");
};

const DEFAULT_ASSET_LIST_HEIGHT = 200;
const PADDING_OFFSET = 20;

const PortfolioStats: FC<IPortfolioStats> = ({
    showAllAssets,
    showBalance,
    portfolioData,
    ethPrice,
    balancesQueryFailed,
    toggleBalance,
    moduleId,
    selectedAddress,
    widgetHeight,
}) => {
    const LegendWrapRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<HTMLDivElement>(null);

    const widgetSize = useWidgetSize([450, 330]);

    const assets = useMemo<TPortfolioDataForAddress["assets"]>(
        () =>
            portfolioData !== undefined
                ? [...portfolioData.assets].sort(
                      (a, b) => b.token.balanceUSD - a.token.balanceUSD
                  )
                : [],
        [portfolioData]
    );

    const totalValue = portfolioData?.totalValue || 0;

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

    useEffect(() => {
        const legend = document
            .querySelector(`#${moduleId}`)
            ?.parentElement?.querySelector(".apexcharts-legend");

        if (
            legend?.isConnected && // legend exists
            LegendWrapRef.current !== null &&
            widgetSize === "sm"
        ) {
            LegendWrapRef.current.replaceChildren(legend);
        }
    }, [widgetSize, selectedAddress, moduleId]);

    const assetListHeight =
        (chartRef.current
            ? widgetHeight - chartRef.current.offsetHeight + PADDING_OFFSET
            : DEFAULT_ASSET_LIST_HEIGHT) -
        2 * 53;

    return (
        <div className="px-4 portfolio-widget">
            {balancesQueryFailed ? (
                <div className="flex justify-center items-center top-[220px] z-[2] !h-[200px] text-primaryVariant100">
                    {globalMessages.error.requestFailed("your balances")}
                </div>
            ) : (
                <>
                    <div ref={chartRef}>
                        <div className="flex flex-wrap justify-between pb-1 pr-3">
                            <div className="pt-6 mr-[45px] self-start max-w-[130px]">
                                <p className="mb-0.5 capitalize tracking-[0.5px] fontGroup-mini text-primaryVariant100 flex items-center">
                                    Total Balance{" "}
                                    <ShowSVG
                                        onClick={toggleBalance}
                                        className="cursor-pointer ml-0.5 p-[1px]"
                                    />
                                </p>
                                {portfolioData === undefined ? (
                                    <div className="flex justify-center">
                                        <Skeleton className="w-20" />
                                    </div>
                                ) : (
                                    <h3 className="mb-0.5 fontGroup-major text-primary">
                                        {handleBalanceFigures(
                                            formatNumber({
                                                value: totalValue,
                                                style: ENumberStyle.Currency,
                                                currency: "USD",
                                            }).value,
                                            showBalance
                                        )}
                                    </h3>
                                )}
                                {portfolioData && ethPrice && (
                                    <div className="mb-[15px] flex flex-wrap">
                                        <p className="fontGroup-normal mb-0 text-success">
                                            {handleBalanceFigures(
                                                formatNumber({
                                                    value:
                                                        totalValue / ethPrice,
                                                    style: ENumberStyle.Decimal,
                                                }).value,
                                                showBalance
                                            )}{" "}
                                            {showBalance &&
                                                totalValue &&
                                                ethPrice && (
                                                    <span className="fontGroup-normal mr-[5px] text-primary">
                                                        ETH
                                                    </span>
                                                )}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div
                                className={twMerge(
                                    "flex justify-between donut-chart",
                                    widgetSize === "sm" && "sm-donut-chart"
                                )}
                            >
                                {donutData.series && (
                                    <ApexDonutChart
                                        options={donutData?.options}
                                        series={donutData?.series}
                                        width="260px"
                                        height="400px"
                                    />
                                )}
                            </div>
                            <div
                                className={
                                    widgetSize === "sm"
                                        ? "sm-legend-wrap"
                                        : "hidden"
                                }
                                ref={LegendWrapRef}
                            />
                        </div>

                        {donutData.series?.length ? (
                            <div className="items-center justify-between flex flex-1">
                                <div className="flex flex-[2_1_0%] justify-start">
                                    <p className="capitalize text-end tracking-[0.5px] fontGroup-mini text-primaryVariant100 mb-0">
                                        Asset
                                    </p>
                                </div>
                                <div className="flex flex-1 flex-end">
                                    <p className="capitalize text-end tracking-[0.5px] fontGroup-mini text-primaryVariant100 mb-0">
                                        Balance
                                    </p>
                                </div>
                                <div className="flex flex-1 flex-end">
                                    <p className="capitalize text-end tracking-[0.5px] fontGroup-mini text-primaryVariant100 mb-0">
                                        Price
                                    </p>
                                </div>
                                <div className="flex flex-1 flex-end">
                                    <p className="capitalize text-end tracking-[0.5px] fontGroup-mini text-primaryVariant100 mb-0">
                                        Value
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                    {assets.length > 0 && (
                        <div
                            className="-mx-4"
                            style={{
                                height: assetListHeight,
                            }}
                        >
                            <ScrollBar>
                                {assets.map((asset) => {
                                    const assetKey = `${
                                        showAllAssets ? "all" : "single"
                                    }${asset.address}-${asset.network}-${
                                        asset.updatedAt
                                    }-${asset.token.id}`;

                                    return (
                                        <div
                                            className="flex mx-2 py-3 px-2 justify-between fontGroup-normal border-t border-borderLine first-of-type:border-t-0 rounded-sm"
                                            key={assetKey}
                                        >
                                            <div className="flex flex-[2_1_0%] justify-start">
                                                <a
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    href={TOKEN_METADATA_URL(
                                                        asset
                                                    )}
                                                    className="uppercase fontGroup-highlightSemi no-underline text-primary"
                                                >
                                                    <span className="flex flex-wrap">
                                                        {asset.token
                                                            .tokenImage && (
                                                            <img
                                                                alt=""
                                                                src={
                                                                    asset.token
                                                                        .tokenImage
                                                                }
                                                                className="w-5 h-5 rounded-full mr-[10px]"
                                                            />
                                                        )}
                                                        {asset.token.symbol}
                                                        <span className="secondCol">
                                                            {getAssetPrefix(
                                                                asset
                                                            )}
                                                        </span>
                                                    </span>
                                                </a>
                                            </div>
                                            <div className="flex flex-1 flex-end">
                                                <span>
                                                    {handleBalanceFigures(
                                                        formatNumber({
                                                            value: asset.token
                                                                .balance,
                                                        }).value,
                                                        showBalance
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex flex-1 flex-end">
                                                <span>
                                                    {handleBalanceFigures(
                                                        formatNumber({
                                                            value:
                                                                asset.token
                                                                    .price || 0,
                                                            style: ENumberStyle.Currency,
                                                            currency: "USD",
                                                            useEllipsis: true,
                                                            ellipsisCutoff:
                                                                widgetSize ===
                                                                "lg"
                                                                    ? SMALL_PRICE_CUTOFF_LG
                                                                    : SMALL_PRICE_CUTOFF_SM,
                                                        }).value,
                                                        showBalance
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex flex-1 flex-end">
                                                <span>
                                                    {handleBalanceFigures(
                                                        formatNumber({
                                                            value:
                                                                asset.token
                                                                    .balanceUSD ||
                                                                0,
                                                            style: ENumberStyle.Currency,
                                                            currency: "USD",
                                                        }).value,
                                                        showBalance
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </ScrollBar>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PortfolioStats;
