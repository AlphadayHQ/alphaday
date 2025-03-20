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
    const prevScrollRef = useRef<HTMLElement | undefined>();
    const prevItemRef = useRef<HTMLElement | undefined>();

    const handleListScroll = ({ currentTarget }: FormEvent<HTMLElement>) => {
        if (shouldFetchMoreItems(currentTarget)) {
            handlePaginate("next");
        }
    };

    useEffect(() => {
        if (
            scrollRef !== prevScrollRef.current &&
            itemRef !== prevItemRef.current &&
            itemRef &&
            scrollRef
        ) {
            if (scrollRef) {
                console.log("itemRef", itemRef, "scrollRef", scrollRef);
                console.log("itemRef", itemRef.offsetTop, scrollRef.scrollTop);

                scrollRef.scrollBy({
                    top: itemRef.offsetTop - scrollRef.scrollTop,
                    left: 0,
                });
            }
            prevScrollRef.current = scrollRef;
            prevItemRef.current = itemRef;
        }
    }, [scrollRef, prevScrollRef, itemRef, selectedDataPoint]);

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
                        // <ListItem
                        //     key={item.id}
                        //     variant="kasandra"
                        //     title={item.title}
                        //     path={item.url}
                        //     duration={computeDuration(item.publishedAt)}
                        //     tag={item.sourceName}
                        //     tagImg={item.sourceIcon}
                        //     source={item.author}
                        //     direction={Math.random() > 0.5 ? "up" : "down"}
                        //     bookmarked={item.bookmarked}
                        //     onClick={async () => {
                        //         if (onClick !== undefined) {
                        //             await onClick(item.id);
                        //         }
                        //     }}
                        //     onBookmark={async () => {
                        //         if (onBookmark !== undefined) {
                        //             await onBookmark(item);
                        //         }
                        //     }}
                        //     isAuthenticated={isAuthenticated}
                        // />
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
                                className="flex relative flex-row items-start py-3 px-1 ml-2 mr-[3px] bg-background hover:bg-backgroundVariant100 active:bg-backgroundVariant200"
                                // rel="noreferrer"
                            >
                                <div className="fontGroup-mini min-w-[50px] text-primaryVariant100 mr-[5px] pt-[1.5px]">
                                    <div
                                        className={twMerge(
                                            " p-3 h-10 w-10 mx-auto rounded-full",
                                            item.direction === "up"
                                                ? "bg-green-300/10"
                                                : "bg-red-300/10"
                                        )}
                                    >
                                        <Arrow
                                            direction={item.direction}
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
