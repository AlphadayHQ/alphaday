import { FC, useEffect, useRef, useState } from "react";
import { HRElement, CenteredBlock, ScrollBar } from "@alphaday/ui-kit";
import moment from "moment";
import type {
    TChartRange,
    TCoin,
    THistoryInsightItem,
    TInsightItem,
} from "src/api/types";
import globalMessages from "src/globalMessages";
import KasandraItem from "./KasandraItem";

const SCROLL_OFFSET = 100;

interface IKasandraItemList {
    timelineItems: (TInsightItem | THistoryInsightItem)[] | undefined;
    selectedMarket: TCoin | undefined;
    onClick?: (id: number) => MaybeAsync<void>;
    selectedTimestamp: number | undefined;
    onSelectDataPoint: (timestamp: number) => void;
    selectedChartRange: TChartRange;
}

const groupItemsByDate = (items: (TInsightItem | THistoryInsightItem)[]) => {
    return items.reduce(
        (acc, item) => {
            const date = moment(item.timestamp).format("YYYY-MM-DD");
            return {
                ...acc,
                [date]: [...(acc[date] ?? []), item],
            };
        },
        {} as Record<string, (TInsightItem | THistoryInsightItem)[]>
    );
};

const DateDisplay: FC<{ date: number; selectedChartRange: TChartRange }> = ({
    date,
    selectedChartRange,
}) => {
    const isYearDisplay =
        selectedChartRange !== "1D" &&
        selectedChartRange !== "1W" &&
        selectedChartRange !== "1M";
    return (
        <div className="flex flex-col justify-center max-h-14 uppercase text-primaryVariant100 cursor-default text-center font-normal tracking-0.2 fontGroup-mini min-w-[50px] mr-[5px] pt-[1.5px]">
            <span className="text-[10px] uppercase">
                {moment(date).format("MMM")}
            </span>
            <span className="text-primary text-center font-semibold text-2xl leading-5 my-0.5">
                {moment(date).format("DD")}
            </span>
            {isYearDisplay && (
                <span className="text-[10px] uppercase">
                    {moment(date).format("YYYY")}
                </span>
            )}
        </div>
    );
};

const GroupedKasandraItems: FC<{
    items: (TInsightItem | THistoryInsightItem)[];
    selectedTimestamp: number | undefined;
    selectedMarket: TCoin | undefined;
    setItemRef: (ref: HTMLDivElement | null) => void;
    onSelectDataPoint: (timestamp: number) => MaybeAsync<void>;
    selectedChartRange: TChartRange;
}> = ({
    items,
    selectedTimestamp,
    selectedMarket,
    setItemRef,
    onSelectDataPoint,
    selectedChartRange,
}) => {
    if (items) {
        return (
            <div className="flex w-full">
                <div className="mt-3">
                    <DateDisplay
                        date={items[0].timestamp}
                        selectedChartRange={selectedChartRange}
                    />
                </div>
                <div className="flex flex-col w-full">
                    {items.map((item) => {
                        const isSelected = selectedTimestamp === item.timestamp;
                        return (
                            <KasandraItem
                                item={item}
                                selectedMarket={selectedMarket}
                                key={item.id}
                                isSelected={isSelected}
                                setItemRef={setItemRef}
                                onSelectDataPoint={onSelectDataPoint}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }
    return null;
};

const KasandraItemList: FC<IKasandraItemList> = ({
    timelineItems,
    onClick,
    selectedTimestamp,
    onSelectDataPoint,
    selectedMarket,
    selectedChartRange,
}) => {
    const [scrollRef, setScrollRef] = useState<HTMLElement | undefined>();
    const [itemRef, setItemRef] = useState<HTMLDivElement | null>();
    const prevItemRef = useRef<HTMLElement | undefined>();

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
        const groupedItems = groupItemsByDate(timelineItems);
        return (
            <ScrollBar containerRef={setScrollRef}>
                {Object.values(groupedItems).map((items) => {
                    return (
                        <GroupedKasandraItems
                            items={items}
                            selectedTimestamp={selectedTimestamp}
                            selectedMarket={selectedMarket}
                            setItemRef={setItemRef}
                            onSelectDataPoint={handleOnSelectDataPoint}
                            selectedChartRange={selectedChartRange}
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
