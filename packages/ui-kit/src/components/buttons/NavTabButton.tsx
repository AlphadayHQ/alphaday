import { FC } from "react";
import { ReactComponent as CloseSVG } from "../../assets/svg/close.svg";
import { ReactComponent as ViewsSVG } from "../../assets/svg/views.svg";
import { ReactComponent as WidgetsSVG } from "../../assets/svg/widgets.svg";
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
            className="fontGroup-supportBold bg-transparent border-none hover:bg-backgroundVariant200 px-4"
            {...restProps}
        >
            {variant === "modules" &&
                (open ? (
                    <CloseSVG className="fill-primary mr-1.5 h-3.5 w-3.5 self-center" />
                ) : (
                    <WidgetsSVG className="widgets fill-primary mr-1.5 h-3.5 w-3.5 self-center" />
                ))}
            {variant === "views" &&
                (open ? (
                    <CloseSVG className="fill-primary mr-1.5 h-3.5 w-3.5 self-center" />
                ) : (
                    <ViewsSVG className="fill-primary mr-1.5 h-3.5 w-3.5 self-center" />
                ))}
            {children}
        </TabButton>
    );
};

NavTabButton.defaultProps = {
    disabled: false,
    uppercase: true,
    label: "button",
};
