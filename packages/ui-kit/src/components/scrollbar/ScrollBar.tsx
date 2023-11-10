import { FC, HTMLProps } from "react";
import { twMerge } from "tailwind-merge";

export interface ScrollBarProps extends HTMLProps<HTMLDivElement> {
    /**
     * get the container ref
     */
    containerRef?: (container: HTMLElement) => void;

    /**
     * fires when the y-axis reaches the end of the scroll container.
     */
    onYReachEnd?: (container: HTMLElement) => void;
}

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
            ref={(ref) => ref && containerRef?.(ref)}
            className={twMerge(
                "overflow-hidden hover:overflow-y-auto scrollbar-track-backgroundVariant1800 scrollbar-thumb-primaryVariant800 scrollbar scrollbar-w-[5px] overscroll-contain",
                className
            )}
            onScroll={(e) => {
                if (
                    e.currentTarget.scrollTop + e.currentTarget.clientHeight ===
                    e.currentTarget.scrollHeight
                ) {
                    onYReachEnd?.(e.currentTarget);
                }
                onScroll?.(e);
            }}
            {...rest}
        >
            {children}
        </div>
    );
};
