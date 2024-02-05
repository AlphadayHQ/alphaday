import { FC, ReactNode, useMemo, useState } from "react";
import {
    Disclosure,
    FullPageModal,
    Input,
    Toggle,
    themeColors,
    twMerge,
} from "@alphaday/ui-kit";
import { ReactComponent as CheckedSVG } from "src/assets/icons/checkmark.svg";
import { ReactComponent as ChevronSVG } from "src/assets/icons/chevron-down2.svg";

enum EOptionCategory {
    MEDIA = "mediaOptions",
    COINS = "coinsOptions",
    DATE = "dateOptions",
}

type TOption = {
    id: number;
    name: string;
    selected: boolean;
    color: string;
};

type TDateOption = {
    id: number;
    name: string;
    selected: boolean;
    value: number | undefined;
};

const sortOptions = (mediaOptions: TOption[]): TOption[] => {
    return mediaOptions.sort((a, b) => {
        // If a is selected and b is not, a should come first
        if (a.selected && !b.selected) {
            return -1;
        }
        // If b is selected and a is not, b should come first
        if (b.selected && !a.selected) {
            return 1;
        }
        // If both have the same selected status, maintain their order
        return 0;
    });
};

const ALL_OPTIONS = {
    mediaOptions: [
        { id: 1, name: "News", selected: true, color: themeColors.categoryOne },
        {
            id: 2,
            name: "Videos",
            selected: false,
            color: themeColors.categoryTwo,
        },
        {
            id: 3,
            name: "Podcasts",
            selected: true,
            color: themeColors.categoryThree,
        },
        {
            id: 4,
            name: "Images",
            selected: false,
            color: themeColors.categoryFour,
        },
        {
            id: 5,
            name: "Events",
            selected: false,
            color: themeColors.categoryFive,
        },
        {
            id: 6,
            name: "Price action",
            selected: false,
            color: themeColors.categorySix,
        },
        {
            id: 7,
            name: "Social Posts",
            selected: false,
            color: themeColors.categorySeven,
        },
        {
            id: 8,
            name: "Forums",
            selected: false,
            color: themeColors.categoryEight,
        },
        {
            id: 9,
            name: "TVL",
            selected: false,
            color: themeColors.categoryNine,
        },
        {
            id: 10,
            name: "Blogs",
            selected: false,
            color: themeColors.categoryTen,
        },
        {
            id: 11,
            name: "Perons",
            selected: false,
            color: themeColors.categoryEleven,
        },
        {
            id: 12,
            name: "Memes",
            selected: false,
            color: themeColors.categoryTwelve,
        },
    ],
    coinsOptions: [
        {
            id: 1,
            name: "BTC",
            selected: true,
            color: themeColors.accentVariant100,
        },
        {
            id: 2,
            name: "ETH",
            selected: false,
            color: themeColors.accentVariant100,
        },
        {
            id: 3,
            name: "SOL",
            selected: true,
            color: themeColors.accentVariant100,
        },
        {
            id: 4,
            name: "DOT",
            selected: false,
            color: themeColors.accentVariant100,
        },
        {
            id: 5,
            name: "MANTLE",
            selected: false,
            color: themeColors.accentVariant100,
        },
        {
            id: 6,
            name: "WAX",
            selected: false,
            color: themeColors.accentVariant100,
        },
        {
            id: 7,
            name: "AVAX",
            selected: false,
            color: themeColors.accentVariant100,
        },
        {
            id: 8,
            name: "OP",
            selected: false,
            color: themeColors.accentVariant100,
        },
        {
            id: 9,
            name: "LINK",
            selected: false,
            color: themeColors.accentVariant100,
        },
    ],
    dateOptions: [
        { id: 1, name: "Anytime", value: undefined, selected: false },
        { id: 2, name: "Last 24 hours", value: 24, selected: true },
        { id: 3, name: "Last 7 days", value: 168, selected: false },
        { id: 4, name: "Last 30 days", value: 720, selected: false },
        { id: 5, name: "last 90 days", value: 2160, selected: false },
        { id: 6, name: "last 6 months", value: 4320, selected: false },
    ],
};

const TagButton: FC<{
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
    options: TOption[] | TDateOption[];
    onSelect: (id: number) => void;
    children: ReactNode;
    pillType?: boolean;
    subtext?: string;
}> = ({ options, onSelect, children, title, pillType, subtext }) => {
    const pillsToShow = pillType
        ? options.slice(0, 6)
        : [options.find((option) => option.selected) || options[0]];
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
                                {pillsToShow.map((option) => (
                                    <TagButton
                                        key={option.name}
                                        name={option.name}
                                        bgColor={
                                            "color" in option
                                                ? option.color
                                                : themeColors.accentVariant100
                                        }
                                        selected={option.selected}
                                        onClick={() => onSelect(option.id)}
                                    />
                                ))}
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

const MobileFiltersModule = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [enabled, setEnabled] = useState(true);

    const [allOptions, setAllOptions] = useState({
        ...ALL_OPTIONS,
        coinsOptions: sortOptions(ALL_OPTIONS.coinsOptions),
        mediaOptions: sortOptions(ALL_OPTIONS.mediaOptions),
    });

    const handlePillSelect = (id: number, optionCategory: EOptionCategory) => {
        setAllOptions((prev) => {
            if (
                optionCategory === EOptionCategory.MEDIA ||
                optionCategory === EOptionCategory.COINS
            ) {
                const selectedOptions: TOption[] = [];
                const nonSelectedOptions: TOption[] = [];
                let selectedOption: TOption | undefined;
                prev[optionCategory].forEach((option) => {
                    if (option.id === id) {
                        selectedOption = option;
                        return;
                    }
                    if (option.selected) {
                        selectedOptions.push(option);
                        return;
                    }
                    nonSelectedOptions.push(option);
                });
                if (selectedOption !== undefined) {
                    return {
                        ...prev,
                        [optionCategory]: [
                            ...selectedOptions,
                            {
                                ...selectedOption,
                                selected: !selectedOption?.selected,
                            },
                            ...nonSelectedOptions,
                        ],
                    };
                }
            }
            return prev;
        });
    };

    const handleDateSelect = (id: number) => {
        setAllOptions((prev) => {
            const updatedDateOptions = prev.dateOptions.map((option) => {
                if (option.id === id) {
                    return {
                        ...option,
                        selected: true,
                    };
                }
                return {
                    ...option,
                    selected: false,
                };
            });
            return {
                ...prev,
                dateOptions: updatedDateOptions,
            };
        });
    };

    const selectedDateOption = useMemo(
        () => allOptions.dateOptions.find((option) => option.selected),
        [allOptions]
    );

    return (
        <FullPageModal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
            <div className="flex flex-start w-full items-center mb-4">
                <ChevronSVG className="w-6 h-6 mr-2 rotate-180 self-center -ml-1.5" />
                <h1 className="uppercase fontGroup-major !text-lg flex-grow text-center mb-0">
                    Superfeed filters
                </h1>
            </div>
            <div className="w-full">
                <p className="fontGroup-highlight">
                    Craft your ideal superfeed by customizing the filters below.
                </p>
                {/* //TODO use search when backend is ready */}
                <div className="flex justify-center [&>div]:w-full">
                    <Input
                        id="filters-input"
                        name="filters-input"
                        className="w-full"
                        width="100%"
                    />
                </div>
            </div>
            <div className="w-full flex justify-between py-6 border-b border-borderLine">
                <p className="fontGroup-highlight uppercase mb-0 self-center">
                    trending
                </p>
                <Toggle
                    enabled={enabled}
                    onChange={() => setEnabled((prev) => !prev)}
                />
            </div>
            <div className="w-full flex flex-col justify-between py-6 border-b border-borderLine">
                <OptionsDisclosure
                    title="media"
                    options={allOptions.mediaOptions}
                    onSelect={(id: number) =>
                        handlePillSelect(id, EOptionCategory.MEDIA)
                    }
                    pillType
                >
                    <div className="w-full flex flex-wrap -ml-1">
                        {allOptions.mediaOptions.map((option) => (
                            <TagButton
                                key={option.name}
                                name={option.name}
                                bgColor={option.color}
                                selected={option.selected}
                                onClick={() =>
                                    handlePillSelect(
                                        option.id,
                                        EOptionCategory.MEDIA
                                    )
                                }
                            />
                        ))}
                    </div>
                </OptionsDisclosure>
            </div>
            <div className="w-full flex flex-col justify-between py-6 border-b border-borderLine">
                <OptionsDisclosure
                    title="coins"
                    options={allOptions.coinsOptions}
                    onSelect={(id: number) =>
                        handlePillSelect(id, EOptionCategory.COINS)
                    }
                    pillType
                >
                    <div className="w-full flex flex-wrap -ml-1">
                        {allOptions.coinsOptions.map((option) => (
                            <TagButton
                                key={option.name}
                                name={option.name}
                                bgColor={option.color}
                                selected={option.selected}
                                onClick={() =>
                                    handlePillSelect(
                                        option.id,
                                        EOptionCategory.COINS
                                    )
                                }
                            />
                        ))}
                    </div>
                </OptionsDisclosure>
            </div>
            <div className="w-full flex flex-col justify-between py-6 border-b border-borderLine">
                <OptionsDisclosure
                    title="Date range"
                    subtext="Filter based on publication date."
                    options={allOptions.dateOptions}
                    onSelect={(id: number) => handleDateSelect(id)}
                >
                    <fieldset>
                        <div className="w-full flex flex-wrap pb-2 -ml-1">
                            {selectedDateOption && (
                                <TagButton
                                    key={selectedDateOption.name}
                                    name={selectedDateOption.name}
                                    bgColor={themeColors.accentVariant100}
                                    selected={selectedDateOption.selected}
                                    onClick={() => {}}
                                />
                            )}
                        </div>
                        <legend className="sr-only">Notification method</legend>
                        <div className="space-y-4">
                            {allOptions.dateOptions.map((option) => (
                                <div
                                    key={option.id}
                                    className="flex items-center cursor-pointer"
                                    role="radio"
                                    tabIndex={0}
                                    aria-checked={option.selected}
                                    onClick={() => handleDateSelect(option.id)}
                                >
                                    <input
                                        id={option.id.toString()}
                                        name="notification-method"
                                        type="radio"
                                        defaultChecked={option.id === 2}
                                        className="h-4 w-4 border-borderLine text-accentBlue100 focus:ring-accentBlue100 cursor-pointer"
                                    />
                                    <label
                                        htmlFor={option.id.toString()}
                                        className="ml-3 block text-sm font-medium leading-6 text-primary cursor-pointer"
                                    >
                                        {option.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </fieldset>
                </OptionsDisclosure>
            </div>
        </FullPageModal>
    );
};

export default MobileFiltersModule;
