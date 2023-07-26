import React from "react";

interface IPosition {
    x: null | number;
    y: null | number;
}

const useMousePosition = ({
    includeTouch,
    trackPosition,
}: {
    includeTouch: boolean;
    trackPosition: boolean;
}): IPosition => {
    const [mousePosition, setMousePosition] = React.useState<IPosition>({
        x: null,
        y: null,
    });

    React.useEffect(() => {
        const updateMousePosition = (ev: MouseEvent) => {
            setMousePosition({ x: ev.clientX, y: ev.clientY });
        };
        const updateTouchPosition = (ev: TouchEvent) => {
            if (ev.touches) {
                const touch = ev.touches[0];
                setMousePosition({ x: touch.clientX, y: touch.clientY });
            }
        };

        if (trackPosition) {
            window.addEventListener("mousemove", updateMousePosition);
            if (includeTouch) {
                window.addEventListener("touchmove", updateTouchPosition);
            }
        } else {
            window.removeEventListener("mousemove", updateMousePosition);
            if (includeTouch) {
                window.removeEventListener("touchmove", updateTouchPosition);
            }
        }

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
            if (includeTouch) {
                window.removeEventListener("touchmove", updateTouchPosition);
            }
        };
    }, [includeTouch, trackPosition]);
    return mousePosition;
};
export default useMousePosition;
