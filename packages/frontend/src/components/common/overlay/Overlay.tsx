import { FC } from "react";
import { twMerge, OverlayWrapper } from "@alphaday/ui-kit";
import UI_CONFIG from "src/config/ui";

const { Z_INDEX_REGISTRY } = UI_CONFIG;

interface IProps {
    position: "left" | "right" | "top" | "bottom";
    isVisible: boolean;
    className?: string;
    children?: React.ReactNode;
}

/**
 * This component may be used to display sticky overlay containers in either the
 * top, bottom, left or right sides of the screen.
 * However, it has only been tested in the CookieDisclaimer component (bottom
 * layout) so some tweaks maybe needed for other layouts.
 */
const Overlay: FC<IProps> = ({ position, isVisible, children, className }) => {
    if (position === "left" || position === "right") {
        return (
            <OverlayWrapper
                isVisible={isVisible}
                className={twMerge(
                    "w-auto h-full top-0 max-w-[250px]",
                    className
                )}
                style={{
                    zIndex: Z_INDEX_REGISTRY.OVERLAY,
                }}
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
                style={{
                    zIndex: Z_INDEX_REGISTRY.OVERLAY,
                }}
            >
                {children}
            </OverlayWrapper>
        );
    }

    return (
        <OverlayWrapper
            isVisible={isVisible}
            className={twMerge("w-full h-auto top-0", className)}
            style={{
                zIndex: Z_INDEX_REGISTRY.OVERLAY,
            }}
        >
            {children}
        </OverlayWrapper>
    );
};

export default Overlay;
