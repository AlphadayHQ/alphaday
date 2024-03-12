import { useRef } from "react";

/**
 * Custom hook to track changes in values that are used as query parameters.
 * For instance, if some query takes as input some tags, we probably want
 * to reset the results shwon in the UI if the tags parameter changed.
 * OTOH, we may also want to track the current page. If user scrolls down the page number
 * changes and new results should be appended in the UI.
 * Thus, this hook is just to determine whether params changed, and the consumer
 * component (container) should handle the logic.
 *
 * @param {T} value The value to watch
 * @returns {boolean} True if the value to watch changed in the last render.
 */

export const useQueryParamWatcher = <T>(
    value: T,
    initialise?: boolean
): boolean => {
    const prevValueRef = useRef<T | undefined>(initialise ? value : undefined);

    if (value !== prevValueRef.current) {
        prevValueRef.current = value;
        return true;
    }
    return false;
};
