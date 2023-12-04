import { FC } from "react";
import { twMerge } from "tailwind-merge";

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
                disabled && "text-primaryVariant300 pointer-events-none",
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
            <span className="flex justify-between items-center cursor-pointer bg-backgroundVariant100 hover:bg-backgroundVariant200 rounded-[10px] transition duration-[ms] ease-in-out">
                <span
                    className={twMerge(
                        "m-[3px] text-center capitalize fontGroup-highlightSemi duration-[400ms] rounded-lg py-[3px] px-2 min-w-min two-col:min-w-[62px] hover:bg-btnBackgroundVariant1200 active:bg-btnBackgroundVariant1600 option1",
                        !checked && "bg-btnBackgroundVariant1400",
                        !checked && disabled && "bg-primaryVariant300"
                    )}
                >
                    {options[0]}
                </span>
                <span
                    className={twMerge(
                        "m-[3px] text-center capitalize fontGroup-highlightSemi duration-[400ms] rounded-lg py-[3px] px-2 min-w-min two-col:min-w-[62px] hover:bg-btnBackgroundVariant1200 active:bg-btnBackgroundVariant1600 option2",
                        checked && "bg-btnBackgroundVariant1400",
                        checked && disabled && "bg-primaryVariant300"
                    )}
                >
                    {options[1]}
                </span>
            </span>
        </label>
    );
};
