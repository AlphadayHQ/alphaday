import { FC } from "react";
import { Disclosure } from "@headlessui/react";
import { ReactComponent as CheckedSVG } from "src/assets/svg/checkmark.svg";
import { ReactComponent as ChevronDownSVG } from "src/assets/svg/chevron-down.svg";
import { themeColors } from "src/globalStyles/themes";
import { twMerge } from "tailwind-merge";

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
    options: {
        id: number;
        name: string;
        selected: boolean;
        color: string;
    }[];
    onSelect: (id: number) => void;
}> = ({ title, options, onSelect }) => {
    const selectedOptions = options
        .filter((option) => option.selected)
        .sort((a, b) => (a.name > b.name ? 1 : -1));
    const nonSelectedOptions = options
        .filter((option) => !option.selected)
        .sort((a, b) => (a.name > b.name ? 1 : -1));
    const sortedOptions = [...selectedOptions, ...nonSelectedOptions];
    return (
        <Disclosure>
            {({ open }) => (
                <>
                    <Disclosure.Button className="flex flex-col">
                        <div className="flex w-full justify-between">
                            <p className="fontGroup-highlight uppercase mb-0 self-center">
                                {title}
                            </p>
                            <ChevronDownSVG
                                className={twMerge(
                                    "w-6 h-6 mr-2 self-center -ml-1.5 text-primary",
                                    open && "rotate-180"
                                )}
                            />
                        </div>
                        {!open && (
                            <div className="w-full flex flex-wrap pt-4 pb-2">
                                {sortedOptions.slice(0, 6).map((option) => (
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
                        <div className="w-full flex flex-wrap">
                            {sortedOptions.map((option) => (
                                <TagButton
                                    key={option.name}
                                    name={option.name}
                                    bgColor={option.color}
                                    selected={option.selected}
                                    onClick={() => onSelect(option.id)}
                                />
                            ))}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
};
