import { useRef } from "react";

/**
 * Custom hook to track whether a prop changes in subsequent renders.
 * A typical use-case for this is tracking whether a query param has changed in order
 * to trigger a UI change. For instance, if some query takes as input some tags, we probably want
 * to reset the results shwon in the UI if the tags parameter changed.
 * Thus, this hook is just to determine whether a value changed, and the consumer
 * component (container) should handle the corresponding logic.
 * @param value The value to watch
 * @param initialise Whether to initialise to the first passed value or default to undefined
 * @returns True if the value to watch changed in the last render.
 */
export const useValueWatcher = <T>(value: T, initialise?: boolean): boolean => {
    const prevValueRef = useRef<T | undefined>(initialise ? value : undefined);

    if (value !== prevValueRef.current) {
        prevValueRef.current = value;
        return true;
    }
    return false;
};
