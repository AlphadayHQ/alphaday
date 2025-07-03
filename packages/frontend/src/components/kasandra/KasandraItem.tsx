/* eslint-disable no-nested-ternary */
import { FC, useMemo } from "react";
import { twMerge } from "@alphaday/ui-kit";
import moment from "moment";
import { TCoin } from "src/api/types";
import { TInsightItem } from "src/api/types/kasandra";
import { ENumberStyle, formatNumber } from "src/api/utils/format";
import { Logger } from "src/api/utils/logging";
import { ReactComponent as ArrowDownSVG } from "src/assets/svg/arrow-down.svg";
import { ReactComponent as ArrowUpSVG } from "src/assets/svg/arrow-up.svg";
import { ReactComponent as TrendDownThinSVG } from "src/assets/svg/trend-down-thin.svg";
import { ReactComponent as TrendUpThinSVG } from "src/assets/svg/trend-up-thin.svg";
import { HRElement } from "src/components/listItem/ListItem";
import { imgOnError } from "src/utils/errorHandling";
import { useDynamicWidgetItem } from "../dynamic-modules/hooks/useDynamicWidgetItem";

const DateDisplay: FC<{ date: number }> = ({ date }) => {
    return (
        <div className="flex flex-col justify-between max-h-14 uppercase text-primaryVariant100 cursor-default text-center font-normal tracking-0.2 fontGroup-mini min-w-[50px] mr-[5px] pt-[1.5px]">
            <span className="text-[10px] uppercase">
                {moment(date).format("MMM")}
            </span>
            <span className="text-primary text-center font-semibold text-2xl leading-5 my-0.5">
                {moment(date).format("DD")}
            </span>
            <span className="text-[10px]">{moment(date).format("HH:mm")}</span>
        </div>
    );
};

const KasandraItem: FC<{
    item: TInsightItem;
    selectedMarket: TCoin | undefined;
    isSelected: boolean;
    setItemRef: (ref: HTMLDivElement | null) => void;
    onSelectDataPoint: (timestamp: number) => MaybeAsync<void>;
    // onBookmark?: (id: TKasandraItem) => MaybeAsync<void>;
    // isAuthenticated?: boolean;
    // setItemsHeight: React.Dispatch<React.SetStateAction<number>>;
}> = ({
    item,
    isSelected,
    setItemRef,
    onSelectDataPoint,
    selectedMarket,
    // onBookmark,
    // isAuthenticated,
    // setItemsHeight,
}) => {
    const { descHeight, descHeightRef, openAccordion, toggleAccordion } =
        useDynamicWidgetItem({ setItemsHeight: undefined });

    const paddedDescHeight = useMemo(
        () => descHeight && descHeight + 5,
        [descHeight]
    ); // 5px comes from padding top in style

    // object to display color & text based on case
    const caseDisplay = useMemo(() => {
        return {
            color:
                item.case === "optimistic"
                    ? "text-success"
                    : item.case === "pessimistic"
                      ? "text-secondaryOrangeSoda"
                      : "text-primaryVariant100",
            text:
                item.case === "optimistic"
                    ? "Bull Case"
                    : item.case === "pessimistic"
                      ? "Bear Case"
                      : "Base Case",
            background:
                item.case === "optimistic"
                    ? "gradient-background-bullish"
                    : item.case === "pessimistic"
                      ? "gradient-background-bearish"
                      : "",
        };
    }, [item.case]);

    const itemSources = item.sources;

    return (
        <span
            key={item.id}
            tabIndex={0}
            role="button"
            onClick={() => {
                toggleAccordion();
                if (isSelected) return;
                onSelectDataPoint(item.timestamp)?.catch((err) =>
                    Logger.error("KasandraItem::onClick", err)
                );
            }}
        >
            <div
                className={twMerge(
                    "flex flex-col hover:bg-backgroundVariant100 active:bg-backgroundVariant200",
                    isSelected && "bg-backgroundVariant200"
                )}
            >
                <div
                    ref={(ref) => (isSelected ? setItemRef(ref) : undefined)}
                    className={twMerge(
                        "flex relative flex-row items-stretch py-3 px-1 ml-2 mr-[3px]",
                        caseDisplay.background
                    )}
                >
                    <DateDisplay date={item.timestamp} />
                    <div className="flex-1 flex flex-col justify-between">
                        <div className="fontGroup-highlight text-primary self-stretch grow-0 flex items-center mb-0">
                            {item.title}
                        </div>
                        <div className="lastLine fontGroup-mini flex text-primaryVariant100 mt-2">
                            <span className={caseDisplay.color}>
                                {item.pricePercentChange > 0 ? (
                                    <ArrowUpSVG className="w-2 h-2 mb-1 inline mr-[5px] fill-success" />
                                ) : item.pricePercentChange < 0 ? (
                                    <ArrowDownSVG className="w-2 h-2 inline mr-[5px] fill-secondaryOrangeSoda" />
                                ) : null}
                                <span
                                    className={twMerge(
                                        "text-primaryVariant100",
                                        item.pricePercentChange > 0
                                            ? "text-success"
                                            : item.pricePercentChange < 0
                                              ? "text-secondaryOrangeSoda"
                                              : ""
                                    )}
                                >
                                    {
                                        formatNumber({
                                            value:
                                                item.pricePercentChange / 100,
                                            style: ENumberStyle.Percent,
                                        }).value
                                    }
                                </span>
                                <span className="mx-[7px] my-0 self-center">
                                    •
                                </span>
                                {caseDisplay.text}{" "}
                                {item.case === "optimistic" ? (
                                    <TrendUpThinSVG className="w-4 h-4 inline fill-success" />
                                ) : item.case === "pessimistic" ? (
                                    <TrendDownThinSVG className="w-4 h-4 inline fill-secondaryOrangeSoda" />
                                ) : null}
                            </span>
                            <span className="mx-[7px] my-0 self-center">•</span>
                            <img
                                src={selectedMarket?.icon}
                                alt=""
                                className="w-4 h-4 mr-[5px] rounded-[100px]"
                                onError={imgOnError}
                            />
                            <span>{selectedMarket?.name}</span>{" "}
                            {!!itemSources?.length && (
                                <>
                                    <span className="mx-[7px] my-0 self-center">
                                        •
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                        {itemSources
                                            .slice(0, 2)
                                            .map((source) => (
                                                <a
                                                    href={source.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    key={source.url}
                                                >
                                                    <span className="sr-only">
                                                        {source.name}
                                                    </span>
                                                    <img
                                                        src={source.icon}
                                                        alt=""
                                                        className="w-4 h-4 rounded-[100px]"
                                                        onError={imgOnError}
                                                    />
                                                </a>
                                            ))}
                                    </div>
                                </>
                            )}
                            {/* <ItemBookmark
                                isAuthenticated={isAuthenticated}
                                onBookmark={
                                    onBookmark
                                        ? () => onBookmark(item)
                                        : undefined
                                }
                                bookmarked={item.bookmarked}
                            /> */}
                        </div>
                    </div>
                </div>
                <div
                    ref={descHeightRef}
                    className={twMerge(
                        "desc fontGroup-normal pointer-events-none h-2.5 opacity-0 ease-[ease] transition-all duration-300",
                        openAccordion &&
                            "line-clamp-6 pointer-events-auto overflow-hidden text-ellipsis opacity-100 ease-[ease] transition-all duration-300"
                    )}
                    style={{
                        height: openAccordion
                            ? `${paddedDescHeight || 109.2}px`
                            : undefined,
                    }}
                >
                    {openAccordion && (
                        <div className="info ml-5 px-2 pr-3 pt-2 rounded-sm min-h-[45px] [align-self:normal]">
                            <div className="wrap flex flex-wrap text-primary whitespace-pre-wrap">
                                {item.rationale}
                            </div>
                            <br />
                            {itemSources && (
                                <>
                                    <div className="flex flex-wrap gap-1">
                                        {itemSources
                                            .slice(0, 3)
                                            .map((source) => (
                                                <a
                                                    href={source.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    key={source.url}
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                    className="bg-backgroundVariant300 hover:bg-backgroundVariant400 py-1 px-2 rounded-lg font-medium outline-0 focus-visible:outline-0"
                                                >
                                                    <span className="">
                                                        {source.name}
                                                    </span>
                                                </a>
                                            ))}
                                    </div>
                                    <br />
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <HRElement />
        </span>
    );
};

export default KasandraItem;
