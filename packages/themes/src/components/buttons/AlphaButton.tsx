import { FC } from "react";
import { twMerge } from "tailwind-merge";
import { tv, VariantProps } from "tailwind-variants";
import styles from "./AlphaButton.module.scss";

const buttonVariants = tv({
  base: styles.alphaButton,
  variants: {
    variant: {
      primaryXL: styles.primaryXL,
      secondaryXL: styles.secondaryXL,
      primary: styles.primary,
      secondary: styles.secondary,
      small: styles.small,
      extraSmall: styles.extraSmall,
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
