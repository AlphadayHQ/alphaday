import { HTMLProps, FC } from "react";
import { twMerge } from "tailwind-merge";

interface IOverlayWrapperProps extends HTMLProps<HTMLDivElement> {
    /**
     * Whether the overlay is visible or not.
     */
    isVisible: boolean;
}

const OverlayWrapper: FC<IOverlayWrapperProps> = ({
    isVisible,
    className,
    children,
    style,
    ...props
}) => {
    return (
        <div
            className={twMerge(
                "block fixed overflow-hidden bg-backgroundVariant900 rounded-[5px]",
                className
            )}
            style={{
                display: isVisible ? "block" : "none",
                ...style,
            }}
            {...props}
        >
            <div className="relative flex flex-col flex-wrap items-center justify-center overflow-hidden">
                {children}
            </div>
        </div>
    );
};

interface IOverlayProps extends IOverlayWrapperProps {
    /**
     * The position of the overlay.
     *
     * @default "top"
     */
    position?: "left" | "right" | "top" | "bottom";
}

/**
 * This component may be used to display sticky overlay containers in either the
 * top, bottom, left or right sides of the screen.
 * However, it has only been tested in the CookieDisclaimer component (bottom
 * layout) so some tweaks maybe needed for other layouts.
 *
 * The `style` or `className` props can be used to customize the overlay.
 */
export const Overlay: FC<IOverlayProps> = ({
    position = "top",
    isVisible,
    children,
    className,
    ...props
}) => {
    if (position === "left" || position === "right") {
        return (
            <OverlayWrapper
                isVisible={isVisible}
                className={twMerge(
                    "w-auto h-full top-0 max-w-[250px]",
                    className
                )}
                {...props}
            >
                {children}
            </OverlayWrapper>
        );
    }

    if (position === "bottom") {
        return (
            <OverlayWrapper
                isVisible={isVisible}
                className={twMerge("w-full h-auto bottom-0", className)}
                {...props}
            >
                {children}
            </OverlayWrapper>
        );
    }

    return (
        <OverlayWrapper
            isVisible={isVisible}
            className={twMerge("w-full h-auto top-0", className)}
            {...props}
        >
            {children}
        </OverlayWrapper>
    );
};
