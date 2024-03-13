import { useEffect, useState } from "react";

/**
 * useSharedState allows a state to be shared between multiple components
 * It makes use of custom events to update the state in real time
 *
 * @param key - the key to use for the shared state
 * @param initialValue - the initial value of the shared state
 */
const useSharedState = <T>(key: string, initialValue: T) => {
    const [state, setState] = useState<T>(initialValue);
    const setSharedState = (newState: T) => {
        const event = new CustomEvent(`shared-state-${key}`, {
            detail: newState,
        });
        window.dispatchEvent(event);
    };

    useEffect(() => {
        const handler = (event: CustomEvent) => {
            setState(event.detail);
        };
        // @ts-ignore
        window.addEventListener(`shared-state-${key}`, handler);
        // @ts-ignore
        return () => window.removeEventListener(`shared-state-${key}`, handler);
    }, [key]);

    return [state, setSharedState] as const;
};

export default useSharedState;
