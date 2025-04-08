import { FC, useMemo } from "react";
import { twMerge } from "@alphaday/ui-kit";
import { TKasandraItem } from "src/api/types/kasandra";
import { computeDuration } from "src/api/utils/dateUtils";
import { Logger } from "src/api/utils/logging";
import { Arrow } from "src/components/arrow/Arrow";
import ItemBookmark from "src/components/listItem/ItemBookmark";
import { HRElement } from "src/components/listItem/ListItem";
import { imgOnError } from "src/utils/errorHandling";
import { useDynamicWidgetItem } from "../dynamic-modules/hooks/useDynamicWidgetItem";

const KasandraItem: FC<{
    item: TKasandraItem;
    isSelected: boolean;
    setItemRef: (ref: HTMLDivElement | null) => void;
    onSelectDataPoint: (dataPoint: [number, number]) => MaybeAsync<void>;
    onBookmark?: (id: TKasandraItem) => MaybeAsync<void>;
    isAuthenticated?: boolean;
    // setItemsHeight: React.Dispatch<React.SetStateAction<number>>;
}> = ({
    item,
    isSelected,
    setItemRef,
    onSelectDataPoint,
    onBookmark,
    isAuthenticated,
    // setItemsHeight,
}) => {
    const { descHeight, descHeightRef, openAccordion, toggleAccordion } =
        useDynamicWidgetItem({ setItemsHeight: undefined });

    const paddedDescHeight = useMemo(
        () => descHeight && descHeight + 5,
        [descHeight]
    ); // 5px comes from padding top in style

    return (
        <span
            key={item.id}
            tabIndex={0}
            role="button"
            onClick={() => {
                toggleAccordion();
                if (isSelected) return;
                onSelectDataPoint(item.dataPoint)?.catch((err) =>
                    Logger.error("KasandraItem::onClick", err)
                );
            }}
        >
            <div
                className={twMerge(
                    "flex flex-col bg-background hover:bg-backgroundVariant100 active:bg-backgroundVariant200",
                    isSelected && "bg-backgroundVariant200"
                )}
            >
                <div
                    ref={(ref) => (isSelected ? setItemRef(ref) : undefined)}
                    className={twMerge(
                        "flex relative flex-row items-start py-3 px-1 ml-2 mr-[3px]"
                    )}
                >
                    <div className="fontGroup-mini min-w-[50px] text-primaryVariant100 mr-[5px] pt-[1.5px]">
                        <div
                            className={twMerge(
                                " p-3 h-10 w-10 mx-auto rounded-full",
                                item.expectedPercentChange > 0
                                    ? "bg-green-300/10"
                                    : "bg-red-300/10"
                            )}
                        >
                            <Arrow
                                direction={
                                    item.expectedPercentChange > 0
                                        ? "up"
                                        : "down"
                                }
                                className="stroke-success w-4 h-4 ml-[1px]"
                            />
                        </div>
                    </div>
                    <div className="grow-[1]">
                        <div className="fontGroup-highlight text-primary self-stretch grow-0 flex items-center mb-0">
                            {item.title}
                        </div>
                        <p className="lastLine fontGroup-mini flex text-primaryVariant100 mt-2">
                            <span>{computeDuration(item.publishedAt)}</span>
                            <span className="mx-[7px] my-0 self-center">•</span>
                            <img
                                src={item.sourceIcon}
                                alt=""
                                className="w-4 h-4 mr-[5px] rounded-[100px]"
                                onError={imgOnError}
                            />
                            <span>{item.sourceName}</span>{" "}
                            <ItemBookmark
                                isAuthenticated={isAuthenticated}
                                onBookmark={
                                    onBookmark
                                        ? () => onBookmark(item)
                                        : undefined
                                }
                                bookmarked={item.bookmarked}
                            />
                        </p>
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
                                {item.description}
                            </div>
                            <br />
                        </div>
                    )}
                </div>
            </div>
            <HRElement />
        </span>
    );
};

export default KasandraItem;
