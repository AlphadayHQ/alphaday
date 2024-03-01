import { FC } from "react";
import { ReactComponent as CloseSVG } from "src/assets/svg/close3.svg";
import { twMerge } from "tailwind-merge";
import { VariantProps, tv } from "tailwind-variants";
import styles from "./Button.module.scss";

const buttonVariants = tv({
    base: twMerge(
        styles.tabsButtonBase,
        "inline-flex items-center justify-center text-center align-middle cursor-pointer leading-normal select-none border-0 w-max h-[34px] border border-borderLine text-primary bg-backgroundVariant200 pt-1.5 pb-[7px] px-4 rounded-lg border-solid hover:bg-backgroundVariant300 active:bg-backgroundVariant100"
    ),
    variants: {
        variant: {
            primary: "",
            transparent: twMerge(
                "bg-transparent h-[21px] cursor-pointer pt-0 pb-[5px] px-0 border-0 hover:bg-transparent active:bg-transparent",
                styles.tabsButtonTransparent
            ),
            small: "small h-[29px] bg-backgroundVariant100 h-[21px] cursor-pointer pt-3 pb-[13px] px-2 border-0 hover:bg-backgroundVariant200 active:bg-backgroundVariant100",
            removable: twMerge(
                "h-[26px] bg-backgroundVariant100 hover:bg-backgroundVariant200 cursor-pointer py-1 px-2 pb-[5px] border-0 hover:bg-transparent active:bg-transparent",
                styles.tabsButtonRemovable
            ),
            extraSmall:
                "extraSmall h-[26px] text-primaryVariant100 bg-backgroundVariant100 border-primaryVariant100 px-2 pb-[5px] rounded-lg border-0 hover:bg-backgroundVariant200 active:bg-backgroundVariant300",
        },
        uppercase: {
            true: "uppercase",
        },
        disabled: {
            true: styles.tabsButtonDisabled,
        },
        open: {
            true: twMerge(
                "text-primary bg-backgroundBlue active:bg-backgroundBlue hover:bg-backgroundBlue",
                styles.tabsButtonOpen
            ),
        },
    },
    defaultVariants: {
        variant: "primary",
        uppercase: false,
        disabled: false,
    },
});

type TButtonVariants = VariantProps<typeof buttonVariants>;

export interface ButtonProps extends TButtonVariants {
    label?: string;
    title?: string;
    onClick?: () => MaybeAsync<void>;
    onClose?: () => MaybeAsync<void>;
    children?: React.ReactNode;
    className?: string;
}

export const TabButton: FC<ButtonProps> = ({
    children,
    variant,
    open,
    disabled,
    uppercase,
    label,
    onClose,
    title,
    className,
    ...restProps
}) => {
    const isDisabled = open ? false : disabled;
    return (
        <button
            type="button"
            disabled={isDisabled}
            className={twMerge(
                buttonVariants({
                    variant,
                    disabled: isDisabled,
                    uppercase,
                    open,
                }),
                className
            )}
            aria-label={label}
            name={title}
            {...restProps}
        >
            {children}
            {(variant === "removable" || variant === "transparent") && (
                <CloseSVG
                    className="close w-2 h-2 ml-1 !p-0 !pt-0.5 text-primaryVariant200"
                    onClick={(e) => {
                        const handler = async () => {
                            e.stopPropagation();
                            if (onClose) await onClose();
                        };
                        handler().catch(() => ({}));
                    }}
                />
            )}
        </button>
    );
};

TabButton.defaultProps = {
    label: "button",
};
