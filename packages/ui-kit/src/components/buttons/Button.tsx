import { FC } from "react";
import { twMerge } from "tailwind-merge";
import { tv, VariantProps } from "tailwind-variants";
import styles from "./Button.module.scss";

const buttonVariants = tv({
    base: twMerge(
        styles.button,
        "inline-flex h-[34px] w-max cursor-pointer select-none items-center justify-center rounded-[10px] border border-solid px-[15px] pb-[7px] pt-1 text-center align-middle leading-normal tracking-[0.2px]"
    ),
    variants: {
        variant: {
            primaryXL: `box-border h-[54px] border-2 border-solid border-btnRingVariant200 px-[25px] py-4 hover:border-btnRingVariant100 active:bg-btnBackgroundVariant700`,
            secondaryXL: `box-border h-[54px] border-borderLine px-[25px] py-4 active:bg-btnBackgroundVariant700`,
            primary: "",
            secondary: "border-borderLine bg-btnBackgroundVariant100",
            small: "fontGroup-normal h-[29px] border-borderLine bg-btnBackgroundVariant200 px-5 pb-[3px] pt-0.5 hover:bg-btnBackgroundVariant500 active:bg-btnBackgroundVariant800",
            extraSmall:
                "fontGroup-normal h-[26px] border-borderLine bg-btnBackgroundVariant200 px-3 pb-[5px] pt-1 hover:bg-backgroundVariant100 active:bg-btnBackgroundVariant800",
        },
        error: { true: "bg-dangerFiltered" },
        uppercase: {
            true: "uppercase",
        },
        disabled: {
            true: "opacity-50 cursor-not-allowed",
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
    children?: React.ReactNode;
    testId?: string;
    id?: string;
    className?: string;
}

export const Button: FC<ButtonProps> = ({
    children,
    variant,
    className,
    disabled,
    uppercase,
    error,
    label,
    testId,
    ...restProps
}) => {
    return (
        <button
            disabled={disabled}
            aria-label={label}
            className={twMerge(
                buttonVariants({ variant, disabled, uppercase, error }),
                className
            )}
            data-testid={testId}
            type="button"
            {...restProps}
        >
            {children}
        </button>
    );
};
