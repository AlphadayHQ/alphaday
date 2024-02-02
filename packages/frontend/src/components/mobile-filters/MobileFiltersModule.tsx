import { useState } from "react";
import {
    FullPageModal,
    Input,
    OptionsDisclosure,
    Toggle,
    themeColors,
} from "@alphaday/ui-kit";
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

const ALL_OPTIONS: Record<EOptionCategory, TOption[]> = {
    mediaOptions: [
        { id: 1, name: "News", selected: true, color: themeColors.categoryOne },
        {
            id: 2,
            name: "Videos",
            selected: true,
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

const MobileFiltersModule = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [enabled, setEnabled] = useState(true);

    const [allOptions, setAllOptions] = useState(ALL_OPTIONS);

    const handleSelect = (id: number, optionCategory: EOptionCategory) => {
        setAllOptions((prev) => {
            const newOptions = prev[optionCategory].map((option) => {
                if (option.id === id) {
                    return { ...option, selected: !option.selected };
                }
                return option;
            });
            return { ...prev, [optionCategory]: newOptions };
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
                />
            </div>
            <div className="w-full flex flex-col justify-between py-6 border-b border-borderLine">
                <OptionsDisclosure
                    title="media"
                    options={allOptions.coinsOptions}
                    onSelect={(id: number) =>
                        handleSelect(id, EOptionCategory.COINS)
                    }
                />
            </div>
        </FullPageModal>
    );
};
export default MobileFiltersModule;
