import { useCallback, useState } from "react";

// See: https://usehooks-ts.com/react-hook/use-event-listener
import useEventListener from "./useEventListener";

// See: https://usehooks-ts.com/react-hook/use-isomorphic-layout-effect
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";

interface Size {
    width: number;
    height: number;
}

function useElementSize<T extends HTMLElement = HTMLDivElement>(): [
    (node: T | null) => void,
    Size
] {
    // Mutable values like 'ref.current' aren't valid dependencies
    // because mutating them doesn't re-render the component.
    // Instead, we use a state as a ref to be reactive.
    const [ref, setRef] = useState<T | null>(null);
    const [size, setSize] = useState<Size>({
        width: 0,
        height: 0,
    });

    // Prevent too many rendering using useCallback
    const handleSize = useCallback(() => {
        if (ref) {
            if (ref.offsetHeight !== size.height)
                setSize((prev) => ({ ...prev, height: ref.offsetHeight || 0 }));
            if (ref.offsetWidth !== size.width)
                setSize((prev) => ({
                    ...prev,
                    width: ref.offsetWidth || 0,
                }));
        }
    }, [ref, size.height, size.width]);

    useEventListener("resize", handleSize);

    useIsomorphicLayoutEffect(() => {
        handleSize();
    }, [ref?.offsetHeight, ref?.offsetWidth]);

    return [setRef, size];
}

export default useElementSize;
