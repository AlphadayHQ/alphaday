import { FC } from "react";
import { twMerge } from "tailwind-merge";
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
    onChange,
    ...restProps
}) => {
    return (
        <label
            htmlFor="switch"
            aria-label={label}
            className={twMerge(
                "relative inline-block text-primary",
                disabled ? styles.disabled : "",
                className
            )}
            {...restProps}
        >
            <input
                readOnly
                type="checkbox"
                aria-label={label}
                checked={checked}
                className="opacity-0 z-[1] w-full h-full absolute cursor-pointer"
                onChange={onChange}
            />
            <span className="flex justify-between items-center cursor-pointer bg-btnBackgroundVariant1100 rounded-[10px] transition duration-[ms] ease-in-out">
                <span
                    className={twMerge(
                        "m-[3px] text-center capitalize fontGroup-highlightSemi duration-[400ms] rounded-lg py-[3px] px-2 min-w-min two-col:min-w-[62px] hover:bg-btnBackgroundVariant1200 active:bg-btnBackgroundVariant1600 option1",
                        !checked && "bg-btnBackgroundVariant1400"
                    )}
                >
                    {options[0]}
                </span>
                <span
                    className={twMerge(
                        "m-[3px] text-center capitalize fontGroup-highlightSemi duration-[400ms] rounded-lg py-[3px] px-2 min-w-min two-col:min-w-[62px] hover:bg-btnBackgroundVariant1200 active:bg-btnBackgroundVariant1600 option2",
                        checked && "bg-btnBackgroundVariant1400"
                    )}
                >
                    {options[1]}
                </span>
            </span>
        </label>
    );
};
