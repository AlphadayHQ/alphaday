import { FormEvent, FC, useEffect, useRef, useState } from "react";
import {
    HRElement,
    CenteredBlock,
    ScrollBar,
    twMerge,
    Arrow,
} from "@alphaday/ui-kit";
import { TKasandraItem } from "src/api/types";
import { computeDuration } from "src/api/utils/dateUtils";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import ItemBookmark from "src/components/listItem/ItemBookmark";
import { imgOnError } from "src/utils/errorHandling";
import globalMessages from "src/globalMessages";

const SCROLL_OFFSET = 100;

interface IKasandraItemList {
    items: TKasandraItem[] | undefined;
    handlePaginate: (type: "next" | "previous") => void;
    onClick?: (id: number) => MaybeAsync<void>;
    onBookmark?: (id: TKasandraItem) => MaybeAsync<void>;
    isAuthenticated?: boolean;
    selectedDataPoint: [number, number] | undefined;
    onSelectDataPoint: (dataPoint: [number, number]) => void;
}

const KasandraItemList: FC<IKasandraItemList> = ({
    items,
    handlePaginate,
    onClick,
    onBookmark,
    isAuthenticated,
    selectedDataPoint,
    onSelectDataPoint,
}) => {
    const [scrollRef, setScrollRef] = useState<HTMLElement | undefined>();
    const [itemRef, setItemRef] = useState<HTMLDivElement | null>();
    // const prevScrollRef = useRef<HTMLElement | undefined>();
    const prevItemRef = useRef<HTMLElement | undefined>();

    const handleListScroll = ({ currentTarget }: FormEvent<HTMLElement>) => {
        if (shouldFetchMoreItems(currentTarget)) {
            handlePaginate("next");
        }
    };

    useEffect(() => {
        if (itemRef !== prevItemRef.current && itemRef && scrollRef) {
            if (scrollRef) {
                scrollRef.scrollBy({
                    top:
                        itemRef.offsetTop - scrollRef.scrollTop - SCROLL_OFFSET,
                    left: 0,
                    behavior: "smooth",
                });
            }
            prevItemRef.current = itemRef;
        }
    }, [scrollRef, itemRef]);

    if (items) {
        if (items.length === 0) {
            return (
                <CenteredBlock>
                    <p>{globalMessages.queries.noMatchFound("Kasandra")}</p>
                </CenteredBlock>
            );
        }
        return (
            <ScrollBar containerRef={setScrollRef} onScroll={handleListScroll}>
                {items.map((item) => {
                    const isSelected =
                        selectedDataPoint?.[0] === item.dataPoint[0];
                    return (
                        <span key={item.id}>
                            <div
                                ref={(ref) =>
                                    isSelected ? setItemRef(ref) : undefined
                                }
                                tabIndex={0}
                                role="button"
                                // href={item.url}
                                // target="_blank"
                                onClick={() => {
                                    onSelectDataPoint(item.dataPoint);
                                    // await onClick?.(item.id);
                                }}
                                className={twMerge(
                                    "flex relative flex-row items-start py-3 px-1 ml-2 mr-[3px] bg-background hover:bg-backgroundVariant100 active:bg-backgroundVariant200",
                                    isSelected && "bg-backgroundVariant200"
                                )}
                                // rel="noreferrer"
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
                                        <span>
                                            {computeDuration(item.publishedAt)}
                                        </span>
                                        <span className="mx-[7px] my-0 self-center">
                                            •
                                        </span>
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
                            <HRElement />
                        </span>
                    );
                })}
            </ScrollBar>
        );
    }
    return (
        <>
            {Array.from(Array(8), Math.random).map((item) => {
                return (
                    <span key={item}>
                        <HRElement />
                    </span>
                );
            })}
        </>
    );
};

export default KasandraItemList;
