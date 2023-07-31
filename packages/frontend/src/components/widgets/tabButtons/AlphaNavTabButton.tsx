/* eslint-disable react/button-has-type */
import { FC } from "react";
import { ReactComponent as CloseSVG } from "src/assets/icons/close.svg";
import { ReactComponent as ViewsSVG } from "src/assets/icons/views.svg";
import { ReactComponent as WidgetsSVG } from "src/assets/icons/widgets.svg";
import { AlphaTabButton } from "./AlphaTabButton";

interface ButtonProps {
    variant: "views" | "modules";
    open?: boolean;
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
        <AlphaTabButton
            open={!!open}
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
        </AlphaTabButton>
    );
};

AlphaNavTabButton.defaultProps = {
    open: false,
    disabled: false,
    uppercase: true,
    label: "button",
};
