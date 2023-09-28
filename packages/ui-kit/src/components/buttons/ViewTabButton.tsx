import { FC, useState } from "react";
import { twMerge } from "tailwind-merge";
import { KebabMenu, TKebabMenuOption } from "../kebab-menu/KebabMenu";

export interface ButtonProps {
    selected: boolean;
    disabled?: boolean;
    label?: string;
    title?: string;
    className?: string;
    onClick?: () => MaybeAsync<void>;
    modified?: boolean;
    children?: React.ReactNode;
    options?: TKebabMenuOption[];
}

export const ViewTabButton: FC<ButtonProps> = ({
    children,
    selected,
    disabled,
    label,
    modified,
    className,
    options,
    ...restProps
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isKebabMenuOpened, setIsKebabMenuOpened] = useState<boolean>(false);

    const toggleKebabMenu = (val?: boolean) => {
        if (val !== undefined) {
            setIsKebabMenuOpened(val);
            return;
        }
        setIsKebabMenuOpened((prev) => !prev);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    return (
        <button
            type="button"
            disabled={selected ? false : disabled}
            aria-label={label}
            className={twMerge(
                "outline-none inline-flex items-center justify-center text-center align-middle cursor-pointer select-none hover:outline-none active:outline-none focus:outline-none hover:bg-btnBackgroundVariant1000 active:bg-btnBackgroundVariant800 fontGroup-supportBold text-primaryVariant100 uppercase w-max h-full py-[13px] px-5 bg-transparent border-l border-background ease-out duration-100 [&>svg]:cursor-pointer",
                disabled && "text-primaryVariant300 pointer-events-none",
                selected &&
                    "bg-background text-primary cursor-default hover:bg-background active:bg-background",
                className
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...restProps}
        >
            {children}
            {modified && (
                <div className="bg-btnRingVariant100 h-1 w-1 rounded items-center justify-center ml-[5px]" />
            )}
            {(isHovered || isKebabMenuOpened) && options && (
                <KebabMenu
                    options={options}
                    showMenu={isKebabMenuOpened}
                    onToggleMenu={toggleKebabMenu}
                />
            )}
        </button>
    );
};
