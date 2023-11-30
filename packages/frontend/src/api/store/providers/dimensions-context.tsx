import { createContext, FC, useEffect, useRef, useState } from "react";
import { IWindowsSize, useWindowSize } from "src/api/hooks";
import { Logger } from "src/api/utils/logging";
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

    const previousElement = useRef<HTMLElement | null>(null);
    const currElement = document.getElementById(WIDGET_SIZE_TRACKING_ID);

    const shouldReRegister =
        previousElement.current !== null &&
        previousElement.current !== currElement;

    useEffect(() => {
        Logger.debug("dimensions-context: registering observer");
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
        previousElement.current = null;

        const resizeObserver = new ResizeObserver(handleResize);

        const mutationObserver = new MutationObserver(function Observe() {
            const elem = document.getElementById(WIDGET_SIZE_TRACKING_ID);
            if (elem) {
                previousElement.current = elem;
                resizeObserver.observe(elem);
                mutationObserver.disconnect();
            }
        });

        mutationObserver.observe(document, { childList: true, subtree: true });

        return () => {
            Logger.debug("dimensions-context: unmounting, cleaning up");
            const elem = document.getElementById(WIDGET_SIZE_TRACKING_ID);
            if (elem) resizeObserver?.unobserve(elem);
            if (timeOutRef.current) clearTimeout(timeOutRef.current);
            mutationObserver.disconnect();
        };
    }, [shouldReRegister]);
    return (
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        <DimensionsContext.Provider value={{ widgetsSize, windowSize }}>
            {children}
        </DimensionsContext.Provider>
    );
};
