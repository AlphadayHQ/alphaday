import { createContext, FC, useEffect, useRef, useState } from "react";
import { IWindowsSize, useWindowSize } from "src/api/hooks";
import CONFIG from "src/config";

const { WIDGET_SIZE_TRACKING_ID } = CONFIG.UI;

interface IWidgetsSize {
    width: number;
    height: number;
}

interface IDimensionsContext {
    widgetsSize: IWidgetsSize | undefined;
    windowSize: IWindowsSize;
}

export const DimensionsContext = createContext<IDimensionsContext>({
    widgetsSize: undefined,
    windowSize: {
        width: window.innerWidth,
        height: window.innerHeight,
    },
});

export const DimensionsProvider: FC<{ children?: React.ReactNode }> = ({
    children,
}) => {
    const windowSize = useWindowSize();
    const [widgetsSize, setWidgetSize] = useState<IWidgetsSize>();
    const timeOutRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        function handleResize() {
            const elem = document.getElementById(WIDGET_SIZE_TRACKING_ID);

            // debounce for 150ms for performance
            if (timeOutRef.current) clearTimeout(timeOutRef.current);
            timeOutRef.current = setTimeout(
                () =>
                    elem?.clientWidth &&
                    setWidgetSize({
                        width: elem.clientWidth,
                        height: elem.clientHeight,
                    }),
                150
            );
        }

        const resizeObserver = new ResizeObserver(handleResize);

        const mutationObserver = new MutationObserver(function () {
            const elem = document.getElementById(WIDGET_SIZE_TRACKING_ID);
            if (elem) {
                resizeObserver.observe(elem);
                mutationObserver.disconnect();
            }
        });

        mutationObserver.observe(document, { childList: true, subtree: true });

        return () => {
            const elem = document.getElementById(WIDGET_SIZE_TRACKING_ID);
            if (elem) resizeObserver?.unobserve(elem);
            if (timeOutRef.current) clearTimeout(timeOutRef.current);
            mutationObserver.disconnect();
        };
    }, []);
    return (
        <DimensionsContext.Provider
            value={{
                widgetsSize,
                windowSize,
            }}
        >
            {children}
        </DimensionsContext.Provider>
    );
};
