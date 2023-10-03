import { FC } from "react";
import { twMerge } from "tailwind-merge";
import styles from "./Spinner.module.scss";

export interface IProps {
    /**
     * Pass extra classes
     */
    className?: string;
    /**
     *  Default is `border`.
     */
    variant?: "border" | "grow";
    /**
     * Default is `text`.
     */
    color?:
        | "primary"
        | "secondary"
        | "success"
        | "danger"
        | "warning"
        | "info"
        | "light"
        | "dark"
        | "white";
    /**
     * Default is `md`.
     */
    size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
    xs: "w-4 h-4 border-[0.2em]",
    sm: "w-6 h-6 border-[0.2em]",
    md: "w-8 h-8 border-[0.25em]",
    lg: "w-10 h-10 border-[0.3em]",
    xl: "w-12 h-12 border-[0.3em]",
};

const variantClasses = {
    grow: `inline-block h-8 w-8 bg-current align-text-bottom opacity-0 ${styles.animateGrow}`,
    border: `inline-block align-text-bottom ${styles.animateBorder} rounded-[50%] border-solid border-current border-r-transparent`,
};

export const Spinner: FC<IProps> = ({
    className,
    variant = "border",
    color: _color, // TODO: Implement color
    size = "md",
    ...restProps
}) => {
    return (
        <div
            className={twMerge(
                "text-primary",
                sizeClasses[size],
                variantClasses[variant],
                className
            )}
            {...restProps}
        />
    );
};
