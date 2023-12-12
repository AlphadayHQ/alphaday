import { FC } from "react";
import { ReactComponent as CloseSVG } from "src/assets/svg/close3.svg";
import { twMerge } from "tailwind-merge";

export type TTabsOption = { label: string; value: string; removable?: boolean };

export const TabsBar: FC<{
    options: TTabsOption[];
    selectedOption: TTabsOption;
    onChange: (option: string) => void;
    onRemoveTab?: (option: string) => MaybeAsync<void>;
}> = ({ options, selectedOption, onChange, onRemoveTab }) => {
    return (
        <div className="w-full">
            <div className="block over">
                <div className="border-b border-borderLine overflow-hidden">
                    <nav
                        className="-mb-px flex space-x-3 overflow-scroll"
                        aria-label="Tabs"
                    >
                        {options.map((tab) => (
                            <span
                                key={tab.label}
                                className={twMerge(
                                    tab.value === selectedOption.value
                                        ? "border-primary text-primary"
                                        : "border-transparent hover:border-primaryFiltered text-primaryVariant100 hover:text-primaryFiltered",
                                    "flex items-center whitespace-nowrap border-b-2 py-1 px-2 text-sm font-medium box-border cursor-pointer fontGroup-highlightSemi"
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
                                {tab.removable && (
                                    <CloseSVG
                                        className="close w-2 h-2 ml-1 !p-0 !pt-0.5"
                                        onClick={(e) => {
                                            const handler = async () => {
                                                e.stopPropagation();
                                                if (onRemoveTab) {
                                                    await onRemoveTab(
                                                        tab.value
                                                    );
                                                }
                                            };
                                            handler().catch(() => ({}));
                                        }}
                                    />
                                )}
                            </span>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
};
