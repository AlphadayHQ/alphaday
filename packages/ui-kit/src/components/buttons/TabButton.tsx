import { FC } from "react";
import { ReactComponent as CloseSVG } from "src/assets/svg/close3.svg";
import { twMerge } from "tailwind-merge";
import { VariantProps, tv } from "tailwind-variants";
import styles from "./Button.module.scss";

// TODO (xavier-charles):: Replace [portfolio-addWallet] in AddressTabSelect with => border border-primaryVariant100)] bg-btnBackgroundVariant1200)] border-solid hover:bg-btnBackgroundVariant1100

const buttonVariants = tv({
    base: twMerge(
        styles.tabsButtonBase,
        "inline-flex items-center justify-center text-center align-middle cursor-pointer leading-normal select-none border-0 w-max h-[34px] border border-btnRingVariant300 text-primary bg-btnBackgroundVariant100 pt-1.5 pb-[7px] px-[15px] rounded-lg border-solid hover:bg-btnBackgroundVariant1000 active:bg-btnBackgroundVariant300"
    ),
    variants: {
        variant: {
            primary: "",
            transparent: twMerge(
                "bg-transparent h-[21px] cursor-pointer pt-0 pb-[5px] px-0 border-0 hover:bg-transparent active:bg-transparent",
                styles.tabsButtonTransparent
            ),
            small: "small h-[29px] bg-btnBackgroundVariant1100 h-[21px] cursor-pointer pt-3 pb-3 px-2 border-0 hover:bg-btnBackgroundVariant1200 active:bg-btnBackgroundVariant1300",
            removable: twMerge(
                "h-[26px] bg-btnBackgroundVariant1100 cursor-pointer py-1 px-2 pb-[5px] border-0 hover:bg-transparent active:bg-transparent",
                styles.tabsButtonRemovable
            ),
            extraSmall:
                "extraSmall h-[26px] text-primaryVariant100 bg-btnBackgroundVariant1100 border-primaryVariant200 px-2 pb-[5px] rounded-lg border-0 hover:bg-btnBackgroundVariant1200 active:bg-btnBackgroundVariant1300",
        },
        uppercase: {
            true: "uppercase",
        },
        disabled: {
            true: styles.tabsButtonDisabled,
        },
        open: {
            true: twMerge(
                "text-primary bg-btnBackgroundVariant1400 active:bg-btnBackgroundVariant1400 hover:bg-btnBackgroundVariant1400",
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
                    className="close w-2 h-2 ml-1"
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
