import { FC, useState } from "react";
import { Combobox } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import { ReactComponent as CheckmarkSVG } from "../../assets/svg/checkmark.svg";
import { ReactComponent as ChevronUpDownSVG } from "../../assets/svg/chevron-up-down.svg";

type TItem = {
    id: number;
    name: string;
};

interface IDropdownSelect {
    label?: string;
    items: {
        label: string;
        value: string;
    }[];
}

export const DropdownSelect: FC<IDropdownSelect> = ({ label, items }) => {
    const [selectedItem, setSelectedItem] = useState(items[0]);
    return (
        <Combobox
            as="div"
            className=" flex flex-grow"
            value={selectedItem}
            onChange={setSelectedItem}
        >
            {label && (
                <Combobox.Label className="block text-sm font-medium leading-6 text-primary mb-2">
                    {label}
                </Combobox.Label>
            )}
            <div className="relative w-full">
                <Combobox.Input
                    className="w-full rounded-md border-0 bg-backgroundVariant200 py-1.5 pl-3 pr-10 text-primary shadow-sm ring-1 ring-inset ring-borderline focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(event) =>
                        setSelectedItem(
                            items.find(
                                (item) => item.value === event.target.value
                            ) || items[0]
                        )
                    }
                    value={selectedItem?.label}
                    displayValue={(Item: TItem) => Item?.name}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <ChevronUpDownSVG
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                    />
                </Combobox.Button>

                {items.length > 0 && (
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-backgroundVariant200 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {items.map((item) => (
                            <Combobox.Option
                                key={item.value}
                                value={item}
                                className={({ active }) =>
                                    twMerge(
                                        "relative cursor-default select-none py-2 pl-3 pr-9",
                                        active
                                            ? "bg-accentVariant100 cursor-pointer text-white"
                                            : "text-primary"
                                    )
                                }
                            >
                                {({ active, selected }) => (
                                    <>
                                        <span
                                            className={twMerge(
                                                "block truncate",
                                                selected && "font-semibold"
                                            )}
                                        >
                                            {item.label}
                                        </span>

                                        {selected && (
                                            <span
                                                className={twMerge(
                                                    "absolute inset-y-0 right-0 flex items-center pr-4",
                                                    active
                                                        ? "text-white"
                                                        : "text-indigo-600"
                                                )}
                                            >
                                                <CheckmarkSVG
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        )}
                                    </>
                                )}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                )}
            </div>
        </Combobox>
    );
};
