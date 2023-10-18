import { HTMLProps, FC } from "react";
import { twMerge } from "tailwind-merge";

interface IOverlayWrapperProps extends HTMLProps<HTMLDivElement> {
    isVisible: boolean;
}

export const OverlayWrapper: FC<IOverlayWrapperProps> = ({
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
