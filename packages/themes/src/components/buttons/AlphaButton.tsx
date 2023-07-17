import { FC } from "react";
import { twMerge } from "tailwind-merge";
import { tv, VariantProps } from "tailwind-variants";
import styles from "./AlphaButton.module.scss";
import { fontVariants } from "../../globalStyles/fontGroups";

const buttonVariants = tv({
    base: `${styles.alphaButton} inline-flex h-[34px] w-max cursor-pointer select-none items-center justify-center rounded-[10px] border border-solid px-[15px] pb-[7px] pt-1 text-center align-middle leading-normal tracking-[0.2px]`,
    variants: {
        variant: {
            primaryXL: `box-border h-[54px] border-2 border-solid border-btnRingVariant200 px-[25px] py-4 hover:border-btnRingVariant100 active:bg-btnBackgroundVariant700`,
            secondaryXL: `box-border h-[54px] border-btnRingVariant300 px-[25px] py-4 active:bg-btnBackgroundVariant700`,
            primary: "",
            secondary: "border-btnRingVariant300",
            small: `${fontVariants({
                variant: "normal",
            })} h-[29px] border-btnRingVariant300 bg-btnBackgroundVariant200 px-5 pb-[3px] pt-0.5 hover:bg-btnBackgroundVariant500 active:bg-btnBackgroundVariant800`,
            extraSmall: `${fontVariants({
                variant: "normal",
            })} h-[26px] border-btnRingVariant300 bg-btnBackgroundVariant200 px-3 pb-[5px] pt-1 hover:bg-btnBackgroundVariant500 active:bg-btnBackgroundVariant800`,
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
    extraClassStyles?: string;
    onClick?: () => MaybeAsync<void>;
    children?: React.ReactNode;
    testId?: string;
}

export const AlphaButton: FC<ButtonProps> = ({
    children,
    variant,
    disabled,
    uppercase,
    error,
    label,
    extraClassStyles,
    testId,
    ...restProps
}) => {
    return (
        <button
            disabled={disabled}
            aria-label={label}
            className={twMerge(
                buttonVariants({ variant, disabled, uppercase, error }),
                extraClassStyles
            )}
            data-testid={testId}
            {...restProps}
        >
            {children}
        </button>
    );
};
