import { createContext, FC, useEffect, useMemo, useRef, useState } from "react";
import { IWindowsSize, useWindowSize } from "src/api/hooks";
import { Logger } from "src/api/utils/logging";
import CONFIG from "src/config";

const { WIDGET_SIZE_TRACKING_ID, IMAGE_WIDGET_SIZE_TRACKING_ID } = CONFIG.UI;

interface IWidgetsSize {
    width: number;
    height: number;
}

interface IDimensionsContext {
    widgetsSize: IWidgetsSize | undefined;
    imageWidgetSize: IWidgetsSize | undefined;
    windowSize: IWindowsSize;
}

export const DimensionsContext = createContext<IDimensionsContext>({
    widgetsSize: undefined,
    imageWidgetSize: undefined,
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
    const [imageWidgetSize, setImageWidgetSize] = useState<IWidgetsSize>();
    const timeOutRef = useRef<ReturnType<typeof setTimeout>>();
    const imageTimeOutRef = useRef<ReturnType<typeof setTimeout>>();

    const previousElement = useRef<HTMLElement | null>(null);
    const previousImageElement = useRef<HTMLElement | null>(null);
    const currElement = document.getElementById(WIDGET_SIZE_TRACKING_ID);
    const currImageElement = document.getElementById(
        IMAGE_WIDGET_SIZE_TRACKING_ID
    );

    const shouldReRegister =
        previousElement.current !== null &&
        previousElement.current !== currElement;

    const shouldReRegisterImage =
        previousImageElement.current !== null &&
        previousImageElement.current !== currImageElement;

    useEffect(() => {
        Logger.debug(
            "dimensions-context: registering single-col widget observer"
        );
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
                setWidgetSize({
                    width: elem.clientWidth,
                    height: elem.clientHeight,
                });
                resizeObserver.observe(elem);
                mutationObserver.disconnect();
            }
        });

        mutationObserver.observe(document, { childList: true, subtree: true });

        return () => {
            Logger.debug(
                "dimensions-context: unmounting single-col widget observer"
            );
            const elem = document.getElementById(WIDGET_SIZE_TRACKING_ID);
            if (elem) resizeObserver?.unobserve(elem);
            if (timeOutRef.current) clearTimeout(timeOutRef.current);
            mutationObserver.disconnect();
        };
    }, [shouldReRegister]);

    useEffect(() => {
        Logger.debug("dimensions-context: registering image widget observer");
        function handleImageResize() {
            const elem = document.getElementById(IMAGE_WIDGET_SIZE_TRACKING_ID);

            // debounce for 150ms for performance
            if (imageTimeOutRef.current) clearTimeout(imageTimeOutRef.current);
            imageTimeOutRef.current = setTimeout(
                () =>
                    elem?.clientWidth &&
                    setImageWidgetSize({
                        width: elem.clientWidth,
                        height: elem.clientHeight,
                    }),
                150
            );
        }
        previousImageElement.current = null;

        const imageResizeObserver = new ResizeObserver(handleImageResize);

        const imageMutationObserver = new MutationObserver(function Observe() {
            const elem = document.getElementById(IMAGE_WIDGET_SIZE_TRACKING_ID);
            if (elem) {
                previousImageElement.current = elem;
                setWidgetSize({
                    width: elem.clientWidth,
                    height: elem.clientHeight,
                });
                imageResizeObserver.observe(elem);
                imageMutationObserver.disconnect();
            }
        });

        imageMutationObserver.observe(document, {
            childList: true,
            subtree: true,
        });

        return () => {
            Logger.debug(
                "dimensions-context: unmounting image widget observer"
            );
            const elem = document.getElementById(IMAGE_WIDGET_SIZE_TRACKING_ID);
            if (elem) imageResizeObserver?.unobserve(elem);
            if (imageTimeOutRef.current) clearTimeout(imageTimeOutRef.current);
            imageMutationObserver.disconnect();
        };
    }, [shouldReRegisterImage]);

    const providerValue = useMemo(
        () => ({ widgetsSize, imageWidgetSize, windowSize }),
        [widgetsSize, imageWidgetSize, windowSize]
    );
    return (
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        <DimensionsContext.Provider value={providerValue}>
            {children}
        </DimensionsContext.Provider>
    );
};
