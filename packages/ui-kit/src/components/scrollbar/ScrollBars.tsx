import { FC } from "react";
import PerfectScrollbar, { ScrollBarProps } from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import styles from "./scrollbar.module.scss"
import { twMerge } from "tailwind-merge";
import { Z_INDEX_REGISTRY } from "src/config/zIndexRegistry";

const ScrollBar: FC<ScrollBarProps> = ({
    children,
    onScroll,
    containerRef,
    onYReachEnd,
    className,
    ...rest
}) => {
    return (
        <div className={twMerge(`[&>.ps>.ps__rail-y]:z-[${Z_INDEX_REGISTRY.SCROLLBAR}]`, styles.scrollbar, className)}  {...rest}>
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

export default ScrollBar;
