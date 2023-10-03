import { FC } from "react";
import styles from "./Switch.module.scss";

export interface SwitchProps {
    options: [string, string];
    checked?: boolean;
    disabled?: boolean;
    label?: string;
    title?: string;
    className?: string;
    onChange?: () => void | (() => Promise<void>);
}

export const Switch: FC<SwitchProps> = ({
    options,
    checked,
    disabled,
    label,
    className,
    ...restProps
}) => {
    return (
        <label
            htmlFor="switch"
            aria-label={label}
            className={`${styles.switch} ${
                disabled ? styles.disabled : ""
            } ${className}`}
            {...restProps}
        >
            <input
                readOnly
                type="checkbox"
                aria-label={label}
                checked={checked}
            />
            <span className="slider">
                <span className="options option1">{options[0]}</span>
                <span className="options option2">{options[1]}</span>
            </span>
        </label>
    );
};
