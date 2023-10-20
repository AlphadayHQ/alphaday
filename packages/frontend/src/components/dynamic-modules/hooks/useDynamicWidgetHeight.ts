import { useCallback, useEffect, useMemo, useState } from "react";

interface IDynamicWidgetHeight {
    initialItemsHeight: number;
    itemsHeight: number;
    setItemsHeight: React.Dispatch<React.SetStateAction<number>>;
    setScrollRef: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

export const useDynamicWidgetHeight: (arg: {
    defaultHeight: number;
    adjustHeightCallback: React.Dispatch<React.SetStateAction<number>>;
}) => IDynamicWidgetHeight = ({ defaultHeight, adjustHeightCallback }) => {
    const [scrollRef, setScrollRef] = useState<HTMLElement | null>(null);

    const getItemsHeight = useCallback(
        (ref: HTMLElement | null) =>
            ref
                ? Array.from(
                      ref.getElementsByClassName("list-group-item")
                  ).reduce(
                      (partialSum, child) => partialSum + child.clientHeight,
                      0
                  ) + 6 // 6px added to hide scrollbar, [second])
                : defaultHeight,
        [defaultHeight]
    );

    // Height of all Items when they are all closed
    const initialItemsHeight = useMemo(
        () => getItemsHeight(scrollRef),
        [getItemsHeight, scrollRef]
    );

    const [itemsHeight, setItemsHeight] = useState(initialItemsHeight);

    useEffect(() => {
        if (scrollRef) {
            // TODO change adjust widget Icon if Item is no longer expandable
            // for cases where its is a small table
            if (initialItemsHeight <= defaultHeight) {
                adjustHeightCallback(initialItemsHeight);
            }
        }
    }, [scrollRef, adjustHeightCallback, initialItemsHeight, defaultHeight]);

    useEffect(() => {
        setItemsHeight(getItemsHeight(scrollRef));
    }, [getItemsHeight, scrollRef]);

    return {
        initialItemsHeight,
        itemsHeight,
        setItemsHeight,
        setScrollRef,
    };
};
