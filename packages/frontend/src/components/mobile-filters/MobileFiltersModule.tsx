import { FC, ReactNode, useState } from "react";
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
}

type TOption = {
    id: number;
    name: string;
    selected: boolean;
    color: string;
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

const ALL_OPTIONS: Record<EOptionCategory, TOption[]> = {
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
    options: TOption[];
    onSelect: (id: number) => void;
    children: ReactNode;
    tagType: boolean;
}> = ({ options, onSelect, children, title, tagType }) => {
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
                        {tagType && !open && (
                            <div className="w-full flex flex-wrap pt-4 pb-2">
                                {options.slice(0, 6).map((option) => (
                                    <TagButton
                                        key={option.name}
                                        name={option.name}
                                        bgColor={option.color}
                                        selected={option.selected}
                                        onClick={() => onSelect(option.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </Disclosure.Button>
                    <Disclosure.Panel className=" pb-2 pt-4">
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

    const handleSelect = (id: number, optionCategory: EOptionCategory) => {
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
                        handleSelect(id, EOptionCategory.MEDIA)
                    }
                    tagType
                >
                    <div className="w-full flex flex-wrap">
                        {allOptions.mediaOptions.map((option) => (
                            <TagButton
                                key={option.name}
                                name={option.name}
                                bgColor={option.color}
                                selected={option.selected}
                                onClick={() =>
                                    handleSelect(
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
                        handleSelect(id, EOptionCategory.COINS)
                    }
                    tagType
                >
                    <div className="w-full flex flex-wrap">
                        {allOptions.coinsOptions.map((option) => (
                            <TagButton
                                key={option.name}
                                name={option.name}
                                bgColor={option.color}
                                selected={option.selected}
                                onClick={() =>
                                    handleSelect(
                                        option.id,
                                        EOptionCategory.COINS
                                    )
                                }
                            />
                        ))}
                    </div>
                </OptionsDisclosure>
            </div>
        </FullPageModal>
    );
};
export default MobileFiltersModule;
