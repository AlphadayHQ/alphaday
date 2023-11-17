import { FC } from "react";
import { Arrow } from "@alphaday/ui-kit";
import { TProjectData, TProjectTvlHistory, TProjectType } from "src/api/types";
import { imgOnError } from "src/api/utils/errorHandling";
import { formatNumber, ENumberStyle } from "src/api/utils/format";
import logoDay from "src/assets/png/logo-white.png";
import { PROJECTS_LOGO_MAPPING, PROJECTS_LOGO_KEYS } from "./common";
import TVLChart from "./ProjectChart";

const COLUMN_WIDTHS = {
    INDEX: 0.4,
    NAME: 4,
    TVL_DATUM: 2,
    CHART: 2,
};

const computePercentageChange: (a: number, b: number) => number = (a, b) =>
    ((b - a) * 100) / a;

const handleOnClick = (projectData: TProjectData) => () => {
    if (projectData.project.url) {
        window.open(projectData.project.url, "_blank");
    }
};

export const TvlItemsHeader: FC<{ projectType: TProjectType }> = ({
    projectType,
}) => {
    return (
        <div className="flex flex-row flex-[1_auto] py-[10px] px-[15px] pb-[3px]">
            <div
                className="flex flex-row flex-1 items-center"
                style={{
                    flex: COLUMN_WIDTHS.INDEX,
                }}
            />
            <div
                className="flex flex-row flex-1 items-center"
                style={{
                    flex: COLUMN_WIDTHS.NAME,
                }}
            >
                <div className="whitespace-nowrap fontGroup-support text-primaryVariant100 mb-0 justify-start">
                    Name
                </div>
            </div>
            <div
                className="flex flex-row flex-1 items-center justify-end"
                style={{
                    flex: COLUMN_WIDTHS.TVL_DATUM,
                }}
            >
                <div className="whitespace-nowrap fontGroup-support text-primaryVariant100 mb-0">
                    TVL
                </div>
            </div>
            {projectType === "protocol" && (
                <>
                    <div
                        className="flex flex-row flex-1 items-center justify-end"
                        style={{
                            flex: COLUMN_WIDTHS.TVL_DATUM,
                        }}
                    >
                        <div
                            className="whitespace-nowrap fontGroup-support text-primaryVariant100 mb-0"
                            style={{
                                justifyContent: "right",
                            }}
                        >
                            1D Change
                        </div>
                    </div>
                    <div
                        className="flex flex-row flex-1 items-center justify-end"
                        style={{
                            flex: COLUMN_WIDTHS.TVL_DATUM,
                        }}
                    >
                        <div
                            className="whitespace-nowrap fontGroup-support text-primaryVariant100 mb-0"
                            style={{
                                justifyContent: "right",
                            }}
                        >
                            7D Change
                        </div>
                    </div>
                    <div
                        className="flex flex-row flex-1 items-center"
                        style={{
                            flex: COLUMN_WIDTHS.CHART,
                        }}
                    />
                </>
            )}
        </div>
    );
};

interface IProtocolTvlProps {
    projectData: TProjectData;
    projectHistory: TProjectTvlHistory | undefined;
    index: number;
    twoRowCellLayout: boolean;
}

export const ProtocolTvlItem: FC<IProtocolTvlProps> = ({
    projectData,
    projectHistory,
    index,
    twoRowCellLayout,
}) => {
    const history7d = projectHistory?.history;

    const { tvl } = projectData;

    /**
     * To compute 1d/7d changes we privilege data from history,
     * this is because project data and history may be inconsistent,
     * so we may end up with a red chart but a positive percentChange7d
     */

    const percentChange1d =
        history7d && history7d[history7d.length - 2].tvlUsd
            ? computePercentageChange(
                  history7d[history7d.length - 2].tvlUsd,
                  history7d[history7d.length - 1].tvlUsd
              )
            : projectData.percentChange1d;

    const percentChange7d =
        history7d && history7d[0].tvlUsd
            ? computePercentageChange(
                  history7d[0].tvlUsd,
                  history7d[history7d.length - 1].tvlUsd
              )
            : projectData.percentChange7d;

    /**
     * 2-row per cell layout
     * Improves UI when little space available
     */
    if (twoRowCellLayout) {
        return (
            <div
                className="flex flex-col flex-[1_auto] py-[10px] px-0"
                onClick={handleOnClick(projectData)}
                role="button"
                tabIndex={0}
            >
                <div className="flex flex-row flex-[1_auto] py-[10px] px-[15px]">
                    <div className="flex flex-row flex-1 items-center">
                        <div className="flex flex-row mr-1 flex-[0_1_auto] h-[21px] w-[21px] relative overflow-hidden items-center justify-start">
                            <div className="absolute inset-0 bg-backgroundVariant200" />
                            <img
                                src={
                                    projectData.project.icon ??
                                    PROJECTS_LOGO_MAPPING[
                                        PROJECTS_LOGO_KEYS.find(
                                            (e) =>
                                                e === projectData.project.name
                                        ) || "Unknown"
                                    ]
                                }
                                onError={imgOnError}
                                alt=""
                                className="absolute inset-0 bg-backgroundVariant400 rounded-full"
                                style={{
                                    backgroundImage: `url(${logoDay})`,
                                }}
                            />
                        </div>
                        <div className="text-primary fontGroup-highlight">
                            {projectData.project.name}
                        </div>
                    </div>
                    <div className="flex flex-row flex-1 items-center justify-center">
                        <div className="flex flex-row flex-1 items-center justify-end">
                            <TVLChart
                                projectHistory={
                                    projectHistory
                                        ? projectHistory?.history
                                        : undefined
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-row flex-[1_auto] p-0">
                    <div className="flex flex-row flex-1 items-center justify-center px-[15px]">
                        <div className="flex flex-row flex-1 items-center justify-start">
                            <div className="flex flex-col items-start">
                                <span className="fontGroup-supportBold text-primaryVariant100 uppercase">
                                    tvl
                                </span>
                                <span>
                                    {
                                        formatNumber({
                                            value: tvl,
                                            style: ENumberStyle.Currency,
                                            currency: "USD",
                                        }).value
                                    }
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-row flex-1 items-center justify-center">
                            <div className="flex flex-col items-start">
                                <span className="fontGroup-supportBold text-primaryVariant100">
                                    1d change
                                </span>
                                <span>
                                    {(percentChange1d / 100).toLocaleString(
                                        undefined,
                                        {
                                            style: "percent",
                                            notation: "compact",
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                    {percentChange1d > 0 ? (
                                        <Arrow direction="up" />
                                    ) : (
                                        <Arrow direction="down" />
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-row flex-1 items-center justify-end">
                            <div className="flex flex-col items-start">
                                <span className="fontGroup-supportBold text-primaryVariant100">
                                    7d change
                                </span>
                                <span>
                                    {(percentChange7d / 100).toLocaleString(
                                        undefined,
                                        {
                                            style: "percent",
                                            notation: "compact",
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                    {percentChange7d > 0 ? (
                                        <Arrow direction="up" />
                                    ) : (
                                        <Arrow direction="down" />
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Standard table view
     */
    return (
        <div
            className="flex flex-row flex-[1_auto] py-[10px] px-[15px]"
            onClick={handleOnClick(projectData)}
            role="button"
            tabIndex={0}
        >
            <div
                className="flex flex-row flex-1 items-center"
                style={{
                    flex: COLUMN_WIDTHS.INDEX,
                }}
            >
                <div className="flex flex-row justify-start flex-1 items-center fontGroup-supportBold">
                    {index + 1}
                </div>
            </div>
            <div
                className="flex flex-row flex-1 items-center"
                style={{
                    flex: COLUMN_WIDTHS.NAME,
                }}
            >
                <div className="flex flex-row flex-[0_1_auto] h-[21px] w-[21px] relative overflow-hidden items-center justify-center">
                    <div className="absolute inset-0 bg-backgroundVariant200" />
                    <img
                        src={
                            projectData.project.icon ??
                            PROJECTS_LOGO_MAPPING[
                                PROJECTS_LOGO_KEYS.find(
                                    (e) => e === projectData.project.name
                                ) || "Unknown"
                            ]
                        }
                        onError={imgOnError}
                        alt=""
                        className="absolute inset-0 bg-backgroundVariant400 rounded-full"
                        style={{
                            backgroundImage: `url(${logoDay})`,
                        }}
                    />
                </div>
                <div className="text-primary fontGroup-highlight ml-1.5">
                    {projectData.project.name}
                </div>
            </div>
            <div
                className="flex flex-row flex-1 items-center"
                style={{
                    flex: COLUMN_WIDTHS.TVL_DATUM,
                }}
            >
                <div className="flex flex-row flex-1 items-center justify-end">
                    {
                        formatNumber({
                            value: tvl,
                            style: ENumberStyle.Currency,
                            currency: "USD",
                        }).value
                    }
                </div>
            </div>
            <div
                className="flex flex-row flex-1 items-center"
                style={{
                    flex: COLUMN_WIDTHS.TVL_DATUM,
                }}
            >
                <div className="flex flex-row flex-1 items-center justify-end">
                    {(percentChange1d / 100).toLocaleString(undefined, {
                        style: "percent",
                        notation: "compact",
                        maximumFractionDigits: 2,
                    })}
                    {percentChange1d > 0 ? (
                        <Arrow direction="up" />
                    ) : (
                        <Arrow direction="down" />
                    )}
                </div>
            </div>
            <div
                className="flex flex-row flex-1 items-center"
                style={{
                    flex: COLUMN_WIDTHS.TVL_DATUM,
                }}
            >
                <div className="flex flex-row flex-1 items-center justify-end">
                    {(percentChange7d / 100).toLocaleString(undefined, {
                        style: "percent",
                        notation: "compact",
                        maximumFractionDigits: 2,
                    })}
                    {percentChange7d > 0 ? (
                        <Arrow direction="up" />
                    ) : (
                        <Arrow direction="down" />
                    )}
                </div>
            </div>
            <div
                className="flex flex-row flex-1 items-center"
                style={{
                    flex: COLUMN_WIDTHS.CHART,
                }}
            >
                <div className="flex flex-row flex-1 items-center justify-end ml-2">
                    <TVLChart
                        projectHistory={
                            projectHistory ? projectHistory?.history : undefined
                        }
                    />
                </div>
            </div>
        </div>
    );
};

interface IChainlTvlProps {
    projectData: TProjectData;
    index: number;
}

/**
 * Chains, as oppose to protocols, do not include 1d/7d percentage change,
 * nor history data.
 */
export const ChainTvlItem: FC<IChainlTvlProps> = ({ index, projectData }) => {
    return (
        <div
            className="flex flex-row flex-[1_auto] py-[10px] px-[15px]"
            onClick={handleOnClick(projectData)}
            role="button"
            tabIndex={0}
        >
            <div
                className="flex flex-row flex-1 items-center"
                style={{
                    flex: COLUMN_WIDTHS.INDEX,
                }}
            >
                <div className="flex flex-row justify-start flex-1 items-center fontGroup-supportBold">
                    {index + 1}
                </div>
            </div>
            <div
                className="flex flex-row flex-1 items-center"
                style={{
                    flex: COLUMN_WIDTHS.NAME,
                }}
            >
                <div className="flex flex-row flex-[0_1_auto] h-[21px] w-[21px] relative overflow-hidden items-center justify-start">
                    <div className="absolute inset-0 bg-backgroundVariant200" />
                    <img
                        src={
                            projectData.project.icon ??
                            PROJECTS_LOGO_MAPPING[
                                PROJECTS_LOGO_KEYS.find(
                                    (e) => e === projectData.project.name
                                ) || "Unknown"
                            ]
                        }
                        onError={imgOnError}
                        alt=""
                        className="absolute inset-0 bg-backgroundVariant400 rounded-full"
                        style={{
                            backgroundImage: `url(${logoDay})`,
                        }}
                    />
                </div>
                <div className="text-primary fontGroup-highlight ml-1.5">
                    <a
                        href={projectData.project.url}
                        target="_blank"
                        title={`Open ${projectData.project.name}`}
                        rel="noreferrer"
                    >
                        {projectData.project.name}
                    </a>
                </div>
            </div>
            <div
                className="flex flex-row flex-1 items-center"
                style={{
                    flex: COLUMN_WIDTHS.TVL_DATUM,
                }}
            >
                <div className="flex flex-row flex-1 items-center justify-end">
                    {
                        formatNumber({
                            value: projectData.tvl,
                            style: ENumberStyle.Currency,
                            currency: "USD",
                        }).value
                    }
                </div>
            </div>
        </div>
    );
};
