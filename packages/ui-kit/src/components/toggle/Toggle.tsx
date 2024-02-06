import { FC } from "react";
import { Switch } from "@headlessui/react";
import { ReactComponent as CheckedSVG } from "src/assets/svg/checkmark.svg";
import { twMerge } from "tailwind-merge";

export const Toggle: FC<{ enabled: boolean; onChange: () => void }> = ({
    enabled,
    onChange,
}) => {
    return (
        <div>
            <Switch
                checked={enabled}
                onChange={onChange}
                className={`${
                    enabled ? "bg-accentVariant100" : "bg-primaryVariant200"
                }
          relative inline-flex items-center h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-400 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
            >
                <span className="sr-only">Use setting</span>
                <div
                    aria-hidden="true"
                    className={`${
                        enabled ? "translate-x-[22px]" : "translate-x-0.5"
                    }
            pointer-events-none flex justify-center items-center h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                >
                    <CheckedSVG
                        className={twMerge(
                            "w-3 h-3 opacity-0",
                            enabled && "opacity-100"
                        )}
                    />
                </div>
            </Switch>
        </div>
    );
};
