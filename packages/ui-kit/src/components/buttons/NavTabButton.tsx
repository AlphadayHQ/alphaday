import { FC } from "react";
import  CloseSVG from "src/assets/alphadayAssets/icons/close.svg";
import ViewsSVG from "src/assets/alphadayAssets/icons/views.svg";
import WidgetsSVG from "src/assets/alphadayAssets/icons/widgets.svg";
import { TabButton } from "./TabButton";

interface ButtonProps {
    variant: "views" | "modules";
    open: boolean;
    disabled?: boolean;
    uppercase?: boolean;
    label?: string;
    title?: string;
    onClick?: () => MaybeAsync<void>;
    children?: React.ReactNode;
}

export const AlphaNavTabButton: FC<ButtonProps> = ({
    children,
    variant,
    open,
    disabled,
    uppercase,
    label,
    ...restProps
}) => {
    return (
        <TabButton
            open={open}
            disabled={disabled}
            uppercase={uppercase}
            aria-label={label}
            {...restProps}
        >
            {variant === "modules" &&
                (open ? (
                    <CloseSVG className="tabButton" />
                ) : (
                    <WidgetsSVG className="tabButton widgets" />
                ))}
            {variant === "views" &&
                (open ? (
                    <CloseSVG className="tabButton" />
                ) : (
                    <ViewsSVG className="tabButton" />
                ))}
            {children}
        </TabButton>
    );
};

AlphaNavTabButton.defaultProps = {
    open: false,
    disabled: false,
    uppercase: true,
    label: "button",
};
