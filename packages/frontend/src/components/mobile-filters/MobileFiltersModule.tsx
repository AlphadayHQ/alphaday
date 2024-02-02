import { useState } from "react";
import {
    FullPageModal,
    Input,
    OptionsDisclosure,
    Toggle,
} from "@alphaday/ui-kit";
import { ReactComponent as ChevronSVG } from "src/assets/icons/chevron-down2.svg";

type EOptionCategory = "mediaOptions";

type TOption = {
    id: number;
    name: string;
    selected: boolean;
    color: string;
};

const AllOptions: Record<EOptionCategory, TOption[]> = {
    mediaOptions: [
        { id: 1, name: "News", selected: true, color: "red" },
        { id: 2, name: "Videos", selected: true, color: "blue" },
        { id: 3, name: "Podcasts", selected: true, color: "green" },
        { id: 4, name: "Images", selected: false, color: "yellow" },
        { id: 5, name: "Events", selected: false, color: "purple" },
        { id: 6, name: "Price action", selected: false, color: "orange" },
    ],
};

const MobileFiltersModule = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [enabled, setEnabled] = useState(true);

    const handleSelect = (id: number, optionCategory: EOptionCategory) => {
        AllOptions[optionCategory].forEach((option, i) => {
            if (option.id === id) {
                AllOptions[optionCategory][i].selected = !option.selected;
            }
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
                    options={AllOptions.mediaOptions}
                    onSelect={(id: number) => handleSelect(id, "mediaOptions")}
                />
            </div>
        </FullPageModal>
    );
};
export default MobileFiltersModule;
