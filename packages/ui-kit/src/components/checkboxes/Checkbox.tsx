import { FC } from "react";
import { ReactComponent as CheckedSVG } from "src/assets/svg/checked.svg";
import { ReactComponent as UncheckedSVG } from "src/assets/svg/unchecked.svg";
import { twMerge } from "tailwind-merge";

export interface CheckBoxProps {
    checked: boolean;
    disabled?: boolean;
    label?: string;
    onChange?: () => void | (() => Promise<void>);
}

export const Checkbox: FC<CheckBoxProps> = ({
    checked,
    disabled,
    label,
    ...restProps
}) => {
    return (
        <label
            htmlFor={label}
            aria-label={label}
            className="text-primary relative inline-block cursor-pointer select-none text-6xl"
            {...restProps}
        >
            <input
                className="absolute h-0 w-0 cursor-pointer opacity-0"
                type="checkbox"
                aria-label={label}
                checked={checked}
            />
            <span className="absolute left-0 top-0 h-6 w-6 bg-transparent">
                {checked ? (
                    <CheckedSVG
                        className={twMerge(disabled && "disabled", "vector")}
                    />
                ) : (
                    <UncheckedSVG
                        className={twMerge(disabled && "disabled", "vector")}
                    />
                )}
            </span>
        </label>
    );
};

Checkbox.defaultProps = {
    disabled: false,
    label: "checkbox",
};
