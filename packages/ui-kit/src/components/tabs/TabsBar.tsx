import { FC } from "react";
import { ReactComponent as CloseSVG } from "src/assets/svg/close3.svg";
import { twMerge } from "tailwind-merge";
import { IconButton } from "../buttons/IconButton";

export type TTabsOption = {
    label: string;
    value: string;
    removable?: boolean;
    icon?: string;
};

export const TabsBar: FC<{
    options: TTabsOption[];
    selectedOption: TTabsOption;
    onChange: (option: string) => void;
    onRemoveTab?: (option: string) => MaybeAsync<void>;

    // controls for scrolling
    setHeaderRef?: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
    handleClickScroll?: (scrollRight?: boolean) => void;
    hideLeftPan?: boolean;
    hideRightPan?: boolean;
}> = ({
    options,
    selectedOption,
    onChange,
    onRemoveTab,
    setHeaderRef,
    handleClickScroll,
    hideLeftPan,
    hideRightPan,
}) => {
    return (
        <>
            {hideLeftPan === false && (
                <span className="block absolute center top-[calc(50%_-_12px)] left-1.5">
                    <IconButton
                        title="Pan Coins Left"
                        variant="leftArrow"
                        onClick={() => handleClickScroll?.()}
                        className="!p-0.5 [&_svg]:!w-4"
                    />
                </span>
            )}
            <div className="w-full pt-2">
                <div className="block over">
                    <div className="border-b border-borderLine overflow-hidden">
                        <nav
                            className="-mb-px flex space-x-3 overflow-scroll"
                            aria-label="Tabs"
                            ref={(ref: HTMLDivElement | null) =>
                                ref && setHeaderRef && setHeaderRef(ref)
                            }
                        >
                            {options.map((tab) => (
                                <span
                                    key={tab.label}
                                    className={twMerge(
                                        tab.value === selectedOption.value
                                            ? "border-primary text-primary"
                                            : "border-transparent hover:border-primaryFiltered text-primaryVariant100 hover:text-primaryFiltered",
                                        "flex min-w-max items-center whitespace-nowrap border-b-2 pt-1 pb-1.5 px-2 text-sm font-medium box-border cursor-pointer fontGroup-highlightSemi"
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
                                    {tab.icon && (
                                        <img
                                            className="w-[18px] h-[18px] rounded-full mr-1"
                                            src={tab.icon}
                                            alt=""
                                        />
                                    )}
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
            {hideRightPan === false && (
                <span className="block absolute center top-[calc(50%_-_12px)] left-auto right-1.5">
                    <IconButton
                        title="Pan Coins Right"
                        variant="rightArrow"
                        onClick={() => handleClickScroll?.(true)}
                        className="!p-0.5 [&_svg]:!w-4"
                    />
                </span>
            )}
        </>
    );
};
