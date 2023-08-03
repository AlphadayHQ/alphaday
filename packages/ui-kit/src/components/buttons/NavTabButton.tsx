import { FC } from "react";
import {ReactComponent as CloseSVG} from "../../assets/svg/close.svg";
import {ReactComponent as ViewsSVG} from "../../assets/svg/views.svg";
import {ReactComponent as WidgetsSVG} from "../../assets/svg/widgets.svg";
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

export const NavTabButton: FC<ButtonProps> = ({
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

NavTabButton.defaultProps = {
    open: false,
    disabled: false,
    uppercase: true,
    label: "button",
};
