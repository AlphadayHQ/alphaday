import { FormEvent, FC, useEffect, useRef, useState } from "react";
import { HRElement, CenteredBlock, ScrollBar } from "@alphaday/ui-kit";
import { TKasandraItem, TPredictionItem } from "src/api/types";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import globalMessages from "src/globalMessages";
import KasandraItem from "./KasandraItem";

const SCROLL_OFFSET = 100;

interface IKasandraItemList {
    items: TKasandraItem[] | undefined;
    timelineItems: TPredictionItem[] | undefined;
    handlePaginate: (type: "next" | "previous") => void;
    onClick?: (id: number) => MaybeAsync<void>;
    onBookmark?: (id: TKasandraItem) => MaybeAsync<void>;
    isAuthenticated?: boolean;
    selectedDataPoint: [number, number] | undefined;
    onSelectDataPoint: (dataPoint: [number, number]) => void;
}

const KasandraItemList: FC<IKasandraItemList> = ({
    items,
    timelineItems,
    handlePaginate,
    onClick,
    onBookmark,
    isAuthenticated,
    selectedDataPoint,
    onSelectDataPoint,
}) => {
    const [scrollRef, setScrollRef] = useState<HTMLElement | undefined>();
    const [itemRef, setItemRef] = useState<HTMLDivElement | null>();
    // const [itemsHeight, setItemsHeight] = useState<number>(0);
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

    const handleOnSelectDataPoint = async (dataPoint: [number, number]) => {
        onSelectDataPoint(dataPoint);
        await onClick?.(dataPoint[0]);
    };

    if (timelineItems) {
        if (timelineItems.length === 0) {
            return (
                <CenteredBlock>
                    <p>{globalMessages.queries.noMatchFound("Kasandra")}</p>
                </CenteredBlock>
            );
        }
        return (
            <ScrollBar containerRef={setScrollRef} onScroll={handleListScroll}>
                {timelineItems.map((item) => {
                    // const isSelected =
                    //     selectedDataPoint?.[0] === item.dataPoint[0];
                    const isSelected = false;
                    return (
                        <KasandraItem
                            item={item}
                            key={item.id}
                            isSelected={isSelected}
                            setItemRef={setItemRef}
                            onSelectDataPoint={handleOnSelectDataPoint}
                            onBookmark={onBookmark}
                            isAuthenticated={isAuthenticated}
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
