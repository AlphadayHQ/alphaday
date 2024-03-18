import { FC, ReactNode } from "react";
import { Disclosure, Spinner, themeColors, twMerge } from "@alphaday/ui-kit";
import { ReactComponent as CheckedSVG } from "src/assets/icons/checkmark.svg";
import { ReactComponent as ChevronSVG } from "src/assets/icons/chevron-down2.svg";
import { TTimeRangeOption, TOption } from "./filterOptions";

export const OptionButton: FC<{
    name: string;
    selected: boolean;
    bgColor: string;
    onClick: () => void;
}> = ({ name, onClick, selected, bgColor }) => {
    const handleClick = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
    };
    return (
        <button
            type="button"
            onClick={handleClick}
            className="flex items-center px-3 py-0.5 bg-backgroundBlue100 text-primary fontGroup-mini h-7 !text-sm rounded-full whitespace-nowrap m-1"
            style={{
                backgroundColor: selected
                    ? bgColor
                    : themeColors.backgroundVariant200,
            }}
        >
            {name}
            <CheckedSVG
                className="w-3 h-3 ml-1 text-primary [&_path]:!stroke-primary"
                style={{ display: selected ? "block" : "none" }}
            />
        </button>
    );
};

export const OptionsDisclosure: FC<{
    title: string;
    options: TOption[] | TTimeRangeOption[];
    onSelect: (slug: string) => void;
    children: ReactNode;
    pillType?: boolean;
    subtext?: string;
    isLoading?: boolean;
}> = ({ options, onSelect, children, title, pillType, subtext, isLoading }) => {
    const pillsToShow = pillType
        ? options.slice(0, 6)
        : [
              options.find(
                  (option: TOption | TTimeRangeOption) => option.selected
              ) || options[0],
          ];
    return (
        <Disclosure>
            {({ open }) => (
                <>
                    <Disclosure.Button className="flex flex-col">
                        <div className="flex w-full justify-between">
                            <p className="fontGroup-highlight uppercase mb-0 self-center">
                                {title}
                            </p>

                            <ChevronSVG
                                className={twMerge(
                                    "w-6 h-6 mr-2 self-center -ml-1.5 text-primary rotate-90",
                                    open && "-rotate-90"
                                )}
                            />
                        </div>
                        <p className="fontGroup-normal text-primaryVariant100 my-2">
                            {subtext}
                        </p>

                        {!open && (
                            <div className="w-full flex flex-wrap pb-2 -ml-1">
                                {isLoading ? (
                                    <Spinner className="mx-auto" />
                                ) : (
                                    pillsToShow.map((option) => (
                                        <OptionButton
                                            key={`${option.id}- ${option.name}`}
                                            name={option.name}
                                            bgColor={
                                                pillType && option.color
                                                    ? option.color
                                                    : themeColors.accentVariant100
                                            }
                                            selected={option.selected}
                                            onClick={() =>
                                                onSelect(option.slug)
                                            }
                                        />
                                    ))
                                )}
                            </div>
                        )}
                    </Disclosure.Button>
                    <Disclosure.Panel className="pb-2 pt-2">
                        {children}
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
};
