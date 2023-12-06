import { FC } from "react";
import { twMerge } from "tailwind-merge";

export type TTabsOption = { label: string; value: string };

export const TabsBar: FC<{
    options: TTabsOption[];
    selectedOption: TTabsOption;
    onChange: (option: string) => void;
}> = ({ options, selectedOption, onChange }) => {
    return (
        <div className="w-full">
            <div className="block">
                <div className="border-b border-borderLine">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {options.map((tab) => (
                            <span
                                key={tab.label}
                                className={twMerge(
                                    tab.value === selectedOption.value
                                        ? "border-primary text-primary"
                                        : "border-transparent hover:border-primaryFiltered text-primaryVariant100 hover:text-primaryFiltered",
                                    "whitespace-nowrap border-b-2 py-1 px-2 text-sm font-medium box-border cursor-pointer fontGroup-highlightSemi"
                                )}
                                aria-current={
                                    tab.value === selectedOption.value
                                        ? "page"
                                        : undefined
                                }
                                onClick={() => onChange(tab.value)}
                                role="button"
                                tabIndex={0}
                            >
                                {tab.label}
                            </span>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
};
