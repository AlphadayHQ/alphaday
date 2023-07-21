import { useEffect, useRef, useState } from "react";

type TOnUpdateCallback<T> = (s: T) => void;
type TSetStateUpdaterCallback<T> = (s: T) => T;
export type TSetStateDispatch<T> = (
    newState: T | TSetStateUpdaterCallback<T>,
    callback?: TOnUpdateCallback<T>
) => void;
/**
 *
 * This hook allows you pass a callback to a stateChange just like this.setState
 */
export function useCallbackState<T>(init: T): [T, TSetStateDispatch<T>];
export function useCallbackState<T = undefined>(
    init?: T
): [T | undefined, TSetStateDispatch<T | undefined>];
export function useCallbackState<T>(init: T): [T, TSetStateDispatch<T>] {
    const [state, setState] = useState<T>(init);
    const cbRef = useRef<TOnUpdateCallback<T>>();

    const setCustomState: TSetStateDispatch<T> = (
        newState,
        callback?
    ): void => {
        cbRef.current = callback;
        setState(newState);
    };

    useEffect(() => {
        if (cbRef.current) {
            cbRef.current(state);
        }
        cbRef.current = undefined;
    }, [state]);

    return [state, setCustomState];
}
