/* eslint-disable no-nested-ternary */
import { FC, useEffect, useMemo, useRef } from "react";
import { Skeleton, twMerge } from "@alphaday/ui-kit";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { TCoin } from "src/api/types";
import { THistoryInsightItem, TInsightItem } from "src/api/types/kasandra";
import { ENumberStyle, formatNumber } from "src/api/utils/format";
import { Logger } from "src/api/utils/logging";
import { ReactComponent as ArrowDownSVG } from "src/assets/svg/arrow-down.svg";
import { ReactComponent as ArrowUpSVG } from "src/assets/svg/arrow-up.svg";
import { ReactComponent as TrendDownThinSVG } from "src/assets/svg/trend-down-thin.svg";
import { ReactComponent as TrendUpThinSVG } from "src/assets/svg/trend-up-thin.svg";
import { imgOnError } from "src/utils/errorHandling";
import { useDynamicWidgetItem } from "../dynamic-modules/hooks/useDynamicWidgetItem";

const KasandraItem: FC<{
    item: TInsightItem | THistoryInsightItem;
    selectedMarket: TCoin | undefined;
    isSelected: boolean;
    setItemRef: (ref: HTMLDivElement | null) => void;
    onSelectDataPoint: (timestamp: number) => MaybeAsync<void>;
}> = ({ item, isSelected, setItemRef, onSelectDataPoint, selectedMarket }) => {
    const prevIsSelected = useRef<boolean | undefined>(undefined);
    const { descHeight, descHeightRef, openAccordion, toggleAccordion } =
        useDynamicWidgetItem({ setItemsHeight: undefined });

    const paddedDescHeight = useMemo(
        () => descHeight && descHeight + 5,
        [descHeight]
    ); // 5px comes from padding top in style

    // object to display color & text based on case
    const caseDisplay = useMemo(() => {
        if (item.type === "history") {
            return {
                color: "text-primaryVariant100",
                text: "History",
                background: "gradient-background-neutral",
            };
        }
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
                      : "gradient-background-base",
        };
    }, [item]);

    const pricePercentChange = useMemo(() => {
        if (item.type === "history") return 0;
        if (selectedMarket?.id !== item.coin.id) return undefined;
        if (!selectedMarket?.price) return 0;
        const change = item.price - selectedMarket.price;
        const percentChange = (change / selectedMarket.price) * 100;
        return percentChange;
    }, [selectedMarket, item]);

    const trendIcon = useMemo(() => {
        if (item.type === "history") return null;
        if (item.case === "optimistic") {
            return <TrendUpThinSVG className="w-4 h-4 inline fill-success" />;
        }
        if (item.case === "pessimistic") {
            return (
                <TrendDownThinSVG className="w-4 h-4 inline fill-secondaryOrangeSoda" />
            );
        }
        return null;
    }, [item]);

    useEffect(() => {
        if (isSelected === prevIsSelected.current) return;
        if (isSelected) {
            Logger.info("KasandraItem::useEffect", "isSelected");
            if (openAccordion) return;
            toggleAccordion();
        } else if (openAccordion) {
            Logger.info("KasandraItem::useEffect", "openAccordion");
            toggleAccordion();
        }
        prevIsSelected.current = isSelected;
    }, [isSelected, openAccordion, toggleAccordion]);

    return (
        <span
            key={item.id}
            tabIndex={0}
            role="button"
            onClick={() => {
                if (isSelected) {
                    toggleAccordion();
                } else {
                    onSelectDataPoint(item.timestamp)?.catch((err) =>
                        Logger.error("KasandraItem::onClick", err)
                    );
                }
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
                        "flex relative flex-row items-stretch py-3 px-1 pl-2 mr-[3px]",
                        caseDisplay.background
                    )}
                >
                    <div className="flex-1 flex flex-col justify-between">
                        <div className="fontGroup-highlight text-primary self-stretch grow-0 flex items-center mb-0">
                            {item.title}
                        </div>
                        <div className="lastLine fontGroup-mini flex text-primaryVariant100 mt-2">
                            {pricePercentChange !== undefined ? (
                                <>
                                    <span className={caseDisplay.color}>
                                        {pricePercentChange > 0 ? (
                                            <ArrowUpSVG className="w-2 h-2 mb-1 inline mr-[5px] fill-success" />
                                        ) : pricePercentChange < 0 ? (
                                            <ArrowDownSVG className="w-2 h-2 inline mr-[5px] fill-secondaryOrangeSoda" />
                                        ) : null}
                                        <span
                                            className={twMerge(
                                                "text-primaryVariant100",
                                                pricePercentChange > 0
                                                    ? "text-success"
                                                    : pricePercentChange < 0
                                                      ? "text-secondaryOrangeSoda"
                                                      : ""
                                            )}
                                        >
                                            {item.type === "prediction" &&
                                                formatNumber({
                                                    value:
                                                        pricePercentChange /
                                                        100,
                                                    style: ENumberStyle.Percent,
                                                }).value}
                                        </span>
                                    </span>
                                    {item.type === "prediction" && (
                                        <span className="mx-[7px] my-0 self-center">
                                            •
                                        </span>
                                    )}
                                    {caseDisplay.text} {trendIcon}
                                    <span className="mx-[7px] my-0 self-center">
                                        •
                                    </span>
                                </>
                            ) : (
                                <Skeleton className="w-28 h-3.5 mr-2" />
                            )}
                            <img
                                src={selectedMarket?.icon}
                                alt=""
                                className="w-4 h-4 mr-[5px] rounded-[100px]"
                                onError={imgOnError}
                            />
                            <span
                                className={
                                    pricePercentChange ? "" : "self-center"
                                }
                            >
                                {selectedMarket?.name}
                            </span>
                            {/* {!!itemSources?.length && (
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
                            )} */}
                        </div>
                    </div>
                </div>
                <div
                    ref={descHeightRef}
                    className={twMerge(
                        "desc fontGroup-normal pointer-events-none h-2.5 opacity-0 ease-[ease] transition-all duration-300",
                        openAccordion &&
                            "line-clamp-6 pointer-events-auto overflow-hidden text-ellipsis opacity-100 ease-[ease] transition-all duration-300 mb-2"
                    )}
                    style={{
                        height: openAccordion
                            ? `${paddedDescHeight || 109.2}px`
                            : undefined,
                    }}
                >
                    {openAccordion && (
                        <div className="info ml-5 px-2 pr-3 rounded-sm min-h-full [align-self:normal]">
                            <div
                                className={twMerge(
                                    "wrap min-h-full inline text-primary whitespace-pre-wrap [&>p]:mt-2 [&>p]:w-full [&>p]:inline-block" // mb-2 does not work for some reason
                                )}
                            >
                                <ReactMarkdown>{item.rationale}</ReactMarkdown>
                            </div>
                            {/* {itemSources && (
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
                            )} */}
                        </div>
                    )}
                </div>
            </div>
            <hr className="border-borderLine m-0 mr-[3px]" />
        </span>
    );
};

export default KasandraItem;
