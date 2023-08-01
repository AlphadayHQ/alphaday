/* eslint-disable react/button-has-type */
import { FC } from "react";
import { ReactComponent as CloseSVG } from "src/assets/icons/close3.svg";
import { StyledButton } from "./AlphaTabButton.style";

export interface ButtonProps {
    variant?: "primary" | "small" | "extraSmall" | "transparent" | "removable";
    open?: boolean;
    disabled?: boolean;
    uppercase?: boolean;
    label?: string;
    title?: string;
    extraClassStyles?: string;
    onClick?: () => MaybeAsync<void>;
    onClose?: () => MaybeAsync<void>;
    children?: React.ReactNode;
}

export const AlphaTabButton: FC<ButtonProps> = ({
    children,
    variant,
    open,
    disabled,
    uppercase,
    label,
    onClose,
    extraClassStyles,
    ...restProps
}) => {
    return (
        <StyledButton
            $variant={variant}
            $open={open}
            disabled={open ? false : disabled}
            $uppercase={uppercase}
            aria-label={label}
            className={extraClassStyles}
            name={restProps.title}
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
        </StyledButton>
    );
};

AlphaTabButton.defaultProps = {
    variant: "primary",
    open: false,
    disabled: false,
    uppercase: true,
    label: "button",
};
