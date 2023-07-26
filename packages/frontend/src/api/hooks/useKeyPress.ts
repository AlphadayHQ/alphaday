import { useCallback, useEffect } from "react";

interface IKeyPress {
    targetKey: string;
    callback: () => void;
    skip?: boolean;
}

export const useKeyPress: (args: IKeyPress) => void = ({
    targetKey,
    callback,
    skip,
}) => {
    const downHandler = useCallback(
        ({ key }: KeyboardEvent) => {
            if (key === targetKey && !skip) {
                callback();
            }
        },
        [callback, skip, targetKey]
    );

    useEffect(() => {
        window.addEventListener("keydown", downHandler);

        return () => {
            window.removeEventListener("keydown", downHandler);
        };
    }, [downHandler]);
};
