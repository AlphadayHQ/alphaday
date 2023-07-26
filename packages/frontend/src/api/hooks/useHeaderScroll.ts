import { useCallback, useState } from "react";
import useElementSize from "./useElementSize";

interface IHeaderScroll {
    width: number;
    squareRef: (node: HTMLDivElement | null) => void;
    channelsScroll: boolean;
    headerRef: HTMLDivElement | null;
    setHeaderRef: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
    handleClickScroll: (scrollRight?: boolean) => void;
    hideLeftPan: boolean;
    hideRightPan: boolean;
}

const useHeaderScroll: () => IHeaderScroll = () => {
    const [squareRef, { width }] = useElementSize();

    const [headerRef, setHeaderRef] = useState<HTMLDivElement | null>(null);
    const [prevHeaderRef, setPrevHeaderRef] = useState<HTMLDivElement | null>(
        null
    );
    const [channelsScroll, setChannelsScroll] = useState(false);
    const [prevHandler, setPrevHandler] = useState<(() => void) | undefined>(
        undefined
    );

    let timer: NodeJS.Timeout;

    const handleClickScroll = useCallback(
        (scrollRight = false) => {
            const scrollValue = width > 400 ? 300 : 220;
            if (headerRef) {
                headerRef.scrollBy({
                    left: scrollRight ? scrollValue : -scrollValue,
                    behavior: "smooth",
                });
            }
        },
        [headerRef, width]
    );

    if (headerRef !== prevHeaderRef) {
        if (headerRef !== null) {
            const handleChannelsScroll = () => {
                setChannelsScroll(true);
                clearTimeout(timer);
                timer = setTimeout(() => setChannelsScroll(false), 1500);
            };
            // removeEventListener if it already exists
            if (
                prevHandler !== undefined &&
                typeof prevHandler === "function"
            ) {
                headerRef.removeEventListener("scroll", prevHandler);
            }
            headerRef?.addEventListener("scroll", handleChannelsScroll);
            setPrevHandler(handleChannelsScroll);
        }
        setPrevHeaderRef(headerRef);
    }

    return {
        width,
        squareRef,
        channelsScroll,
        headerRef,
        setHeaderRef,
        handleClickScroll,
        hideLeftPan: headerRef?.scrollLeft === 0,
        /* eslint-disable no-unsafe-optional-chaining */
        hideRightPan: headerRef
            ? headerRef?.scrollLeft + headerRef?.clientWidth >
              headerRef?.scrollWidth - 5
            : true,
    };
};

export default useHeaderScroll;
