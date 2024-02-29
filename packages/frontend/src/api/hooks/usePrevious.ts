import { useEffect, useRef } from "react";

/**
 * Custom hook for tracking the previous value of a given variable or prop in a React component.
 * Uses useRef to hold the previous value across renders without triggering re-renders,
 * and useEffect to update the stored value only when the observed variable changes.
 *
 * @template T Generic type parameter allowing the hook to handle values of any type.
 * @param {T} value The current value to track, whose previous value is to be captured.
 * @returns {T | undefined} The previous value of the tracked variable. Returns `undefined` on the initial render, as there is no previous value at that point.
 */

export const usePrevious = <T>(value: T): T | undefined => {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
};
