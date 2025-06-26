import { FC, useEffect, useRef, useState } from "react";
import { HRElement, CenteredBlock, ScrollBar } from "@alphaday/ui-kit";
import { TCoin, TInsightItem } from "src/api/types";
// import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import globalMessages from "src/globalMessages";
import KasandraItem from "./KasandraItem";

const SCROLL_OFFSET = 100;

interface IKasandraItemList {
    timelineItems: TInsightItem[] | undefined;
    selectedMarket: TCoin | undefined;
    // handlePaginate: (type: "next" | "previous") => void;
    onClick?: (id: number) => MaybeAsync<void>;
    // onBookmark?: (id: TKasandraItem) => MaybeAsync<void>;
    // isAuthenticated?: boolean;
    selectedTimestamp: number | undefined;
    onSelectDataPoint: (timestamp: number) => void;
}

const KasandraItemList: FC<IKasandraItemList> = ({
    timelineItems,
    // handlePaginate,
    onClick,
    // onBookmark,
    // isAuthenticated,
    selectedTimestamp,
    onSelectDataPoint,
    selectedMarket,
}) => {
    const [scrollRef, setScrollRef] = useState<HTMLElement | undefined>();
    const [itemRef, setItemRef] = useState<HTMLDivElement | null>();
    // const [itemsHeight, setItemsHeight] = useState<number>(0);
    const prevItemRef = useRef<HTMLElement | undefined>();

    // const handleListScroll = ({ currentTarget }: FormEvent<HTMLElement>) => {
    //     if (shouldFetchMoreItems(currentTarget)) {
    //         handlePaginate("next");
    //     }
    // };

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
    }, [scrollRef, itemRef, selectedTimestamp]);

    const handleOnSelectDataPoint = async (timestamp: number) => {
        onSelectDataPoint(timestamp);
        await onClick?.(timestamp);
    };

    if (timelineItems) {
        if (timelineItems.length === 0) {
            return (
                <CenteredBlock>
                    <p>{globalMessages.queries.noMatchFound("Items")}</p>
                </CenteredBlock>
            );
        }
        return (
            <ScrollBar
                containerRef={setScrollRef}
                // onScroll={handleListScroll}
            >
                {timelineItems.map((item) => {
                    const isSelected = selectedTimestamp === item.timestamp;
                    return (
                        <KasandraItem
                            item={item}
                            selectedMarket={selectedMarket}
                            key={item.id}
                            isSelected={isSelected}
                            setItemRef={setItemRef}
                            onSelectDataPoint={handleOnSelectDataPoint}
                            // onBookmark={onBookmark}
                            // isAuthenticated={isAuthenticated}
                            // setItemsHeight={setItemsHeight}
                        />
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
