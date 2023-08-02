import { FC } from "react";
import { twMerge } from "tailwind-merge";
import { VariantProps, tv } from "tailwind-variants";
import { ReactComponent as CloseSVG } from "../../assets/svg/close3.svg";
import styles from "./Button.module.scss";

// TODO (xavier-charles):: Replace [portfolio-addWallet] in AddressTabSelect with => border border-primaryVariant100)] bg-btnBackgroundVariant1200)] border-solid hover:bg-btnBackgroundVariant1100

const buttonVariants = tv({
    base: twMerge(
        styles.tabsButtonBase,
        "fontGroup-supportBold inline-flex items-center justify-center text-center align-middle cursor-pointer leading-normal select-none border-0 w-max h-[34px] border border-btnRingVariant300 text-primary bg-btnBackgroundVariant100 pt-1.5 pb-[7px] px-[15px] rounded-lg border-solid"
    ),
    variants: {
        variant: {
            primary: "",
            transparent: twMerge(
                "bg-transparent h-[21px] cursor-pointer pt-0 pb-px px-0 border-0 hover:bg-transparent active:bg-transparent",
                styles.tabsButtonTransparent
            ),
            small: "small fontGroup-normal h-[29px] bg-transparent h-[21px] cursor-pointer pt-0 pb-px px-0 border-0 hover:bg-transparent active:bg-transparent",
            removable: twMerge(
                "fontGroup-normal h-[26px] bg-transparent h-[21px] cursor-pointer pt-0 pb-px px-0 border-0 hover:bg-transparent active:bg-transparent",
                styles.tabsButtonRemovable
            ),
            extraSmall:
                "extraSmall fontGroup-normal h-[26px] text-primaryVariant100 bg-btnBackgroundVariant1100 border-primaryVariant200 px-2 py-px rounded-lg border-0 hover:bg-btnBackgroundVariant1200 active:bg-btnBackgroundVariant1300",
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
                    className="close"
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
    variant: "primary",
    open: false,
    disabled: false,
    uppercase: true,
    label: "button",
};
