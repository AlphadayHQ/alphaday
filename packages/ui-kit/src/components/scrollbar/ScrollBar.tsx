import { FC } from "react";
import PerfectScrollbar, { ScrollBarProps } from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { twMerge } from "tailwind-merge";
import styles from "./scrollbar.module.scss";

export const ScrollBar: FC<ScrollBarProps> = ({
    children,
    onScroll,
    containerRef,
    onYReachEnd,
    className,
    ...rest
}) => {
    return (
        <div
            className={twMerge(
                // The alternative to hardcoding the z-[8] is to create a module.scss file
                `[&>.ps>.ps__rail-y]:z-[8] overflow-auto`,
                styles.scrollbar,
                className
            )}
            {...rest}
        >
            <PerfectScrollbar
                containerRef={containerRef}
                onYReachEnd={onYReachEnd}
                onScroll={onScroll}
                {...rest}
            >
                {children}
            </PerfectScrollbar>
        </div>
    );
};
