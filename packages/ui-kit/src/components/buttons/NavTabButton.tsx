import { FC } from "react";
import CloseSVG from "../../assets/svg/close.svg?react";
import LanguageSVG from "../../assets/svg/language.svg?react";
import RecipesSVG from "../../assets/svg/recipes.svg?react";
import ViewsSVG from "../../assets/svg/views.svg?react";
import WidgetsSVG from "../../assets/svg/widgets.svg?react";
import { TabButton } from "./TabButton";

interface ButtonProps {
    variant: "views" | "modules" | "language" | "recipes";
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
            className="fontGroup-supportBold bg-transparent border-none hover:bg-backgroundVariant200 px-2 three-col:px-4"
            {...restProps}
        >
            {variant === "recipes" &&
                (open ? (
                    <CloseSVG className="fill-primary mr-1.5 h-3.5 w-3.5 self-center" />
                ) : (
                    <RecipesSVG className="widgets fill-primary mr-1.5 h-3.5 w-3.5 self-center" />
                ))}
            {variant === "language" &&
                (open ? (
                    <CloseSVG className="fill-primary mr-1.5 h-3.5 w-3.5 self-center" />
                ) : (
                    <LanguageSVG className="widgets fill-primary mr-1.5 h-3.5 w-3.5 self-center" />
                ))}
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
