import { FC } from "react";
import PerfectScrollbar, { ScrollBarProps } from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { twMerge } from "tailwind-merge";

export const ScrollBar: FC<ScrollBarProps> = ({
    children,
    onScroll,
    containerRef,
    onYReachEnd,
    className,
    ...rest
}) => {
    return (
        <PerfectScrollbar
            className={twMerge(`unique-widget-scrollbar`, className)}
            containerRef={containerRef}
            onYReachEnd={onYReachEnd}
            onScroll={onScroll}
            {...rest}
        >
            {children}
        </PerfectScrollbar>
    );
};
