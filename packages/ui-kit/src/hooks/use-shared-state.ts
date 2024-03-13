import { useState } from "react";

type SetStateAction<S> = S | ((prevState: S) => S);
type SharedStateHook<S> = (
    initialValue: S
) => [S, (action: SetStateAction<S>) => void];

function createSharedState<S>(key: string): SharedStateHook<S> {
    const stateValue = new Map<string, S>();

    return (initialState: S) => {
        const [state, setState] = useState<S>(
            stateValue.get(key) || initialState
        );

        const setSharedState = (action: SetStateAction<S>) => {
            setState((prevState) => {
                const newState =
                    action instanceof Function ? action(prevState) : action;
                console.log("newState", newState, prevState);
                stateValue.set(key, newState);
                return newState;
            });
        };

        return [state, setSharedState];
    };
}

export default createSharedState;
