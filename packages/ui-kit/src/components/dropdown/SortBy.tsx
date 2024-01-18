import { FC, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ReactComponent as ChevronDownSVG } from "src/assets/svg/chevron-down.svg";
import { twMerge } from "tailwind-merge";

interface ISortBy {
    selected: string;
    onSortBy: (sort: string) => void;
    options: string[];
}

export const SortBy: FC<ISortBy> = ({ selected, onSortBy, options }) => {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div className="pl-4">
                <Menu.Button className="flex items-center cursor-pointer rounded-lg px-2 py-1 hover:bg-backgroundVariant200">
                    <span className="fontGroup-highlightSemi whitespace-nowrap">
                        <span className="mr-3">Sort by:</span>
                        <span className="mr-0.5">{selected}</span>
                    </span>
                    <ChevronDownSVG className="text-primary w-3.5 fill-primary" />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute fontGroup-highlightSemi top-[27px] right-0 z-10 w-40 py-2 origin-top-right bg-backgroundVariant100 rounded-lg border border-borderLine focus:outline-none">
                    {options.map((option, index) => (
                        <Menu.Item>
                            <span
                                className={twMerge(
                                    "block hover:bg-backgroundVariant200 py-2 px-2 border-b mx-2 border-borderLine text-primary cursor-pointer",
                                    index === options.length - 1 &&
                                        "border-b-0 rounded-b-md",
                                    index === 1 && "rounded-t-md"
                                )}
                                onClick={() => onSortBy(option)}
                                tabIndex={0}
                                role="button"
                            >
                                {option}
                            </span>
                        </Menu.Item>
                    ))}
                    {/* <Menu.Item>
                            {({ active }) => (
                                <a
                                    href="#"
                                    className={classNames(
                                        active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-700",
                                        "block px-4 py-2 text-sm"
                                    )}
                                >
                                    Support
                                </a>
                            )}
                        </Menu.Item> */}
                </Menu.Items>
            </Transition>
        </Menu>
    );
};
