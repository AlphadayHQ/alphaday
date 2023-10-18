import { useCallback, useEffect, useRef, useState } from "react";

interface IDynamicWidgetHeight {
    descHeight: number | undefined;
    descHeightRef: React.RefObject<HTMLDivElement>;
    openAccordion: boolean;
    toggleAccordion: () => void;
}

export const useDynamicWidgetItem: (arg: {
    setItemsHeight: React.Dispatch<React.SetStateAction<number>>;
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
            setItemsHeight((prevHeight) => {
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
