import { FC } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { ReactComponent as ChevronDownSVG } from "src/assets/svg/chevron-down.svg";

interface IFeedItem {
    id: number;
    type: "news" | "event" | "video" | "podcast";
    title: string;
    date: Date;
    source: {
        name: string;
        img: string;
    };
    tags: string[];
    likes: number;
    comments: number;
    link: string;
    img: string;
}

export const FeedItem: FC<{ item: IFeedItem }> = ({ item }) => {
    const { title, date, source, tags, likes, comments, link, img } = item;
    return (
        <Disclosure>
            {({ open }) => (
                <>
                    <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75 mb-2 cursor-pointer">
                        <span>{title}</span>
                        <ChevronDownSVG
                            className={`${
                                open ? "rotate-180 transform" : ""
                            } h-5 w-5 text-purple-500`}
                        />
                    </Disclosure.Button>
                    <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-500">
                            If you&apos;re unhappy with your purchase for any
                            reason, email us within 90 days and we&apos;ll
                            refund you in full, no questions asked.
                        </Disclosure.Panel>
                    </Transition>
                </>
            )}
        </Disclosure>
    );
};
