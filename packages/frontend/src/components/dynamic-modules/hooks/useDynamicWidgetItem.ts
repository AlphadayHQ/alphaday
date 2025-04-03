import { useCallback, useEffect, useRef, useState } from "react";

interface IDynamicWidgetHeight {
    descHeight: number | undefined;
    descHeightRef: React.RefObject<HTMLDivElement>;
    openAccordion: boolean;
    toggleAccordion: () => void;
}

/**
 * This hook is used in the DynamicWidget components (Agenda, FAQ, Roadmap)
 * to update the scroll-height of the widget when one or more widget item's height changes
 * i.e the accordion is open or closed (the description is shown or hidden).
 *
 * We need this because the height of the widget is adjustable, hence the height is set to
 * a fixed value. This value must be updated when the height of the widget items changes.
 *
 * @param setItemsHeight - function to set the height of the widget
 *
 * @returns {IDynamicWidgetHeight} - object with: the height of the description, the reference to the description element,
 * the state of the accordion and the function to toggle the accordion
 */

export const useDynamicWidgetItem: (arg: {
    setItemsHeight?: React.Dispatch<React.SetStateAction<number>>;
}) => IDynamicWidgetHeight = ({ setItemsHeight }) => {
    const descHeightRef = useRef<HTMLDivElement>(null);
    const [openAccordion, setOpenAccordion] = useState(false);
    const [descHeight, setDescHeight] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (openAccordion && descHeightRef.current) {
            setDescHeight(descHeightRef.current.scrollHeight);
        }
    }, [openAccordion]);

    const toggleAccordion = useCallback(() => {
        setOpenAccordion((prev) => {
            setItemsHeight?.((prevHeight) => {
                if (!descHeightRef.current) return prevHeight;
                const newHeight = prev
                    ? prevHeight - descHeightRef.current.scrollHeight
                    : prevHeight + descHeightRef.current.scrollHeight;
                return newHeight;
            });
            return !prev;
        });
    }, [setItemsHeight]);

    return {
        descHeight,
        descHeightRef,
        openAccordion,
        toggleAccordion,
    };
};
