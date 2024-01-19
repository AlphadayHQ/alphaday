import { ReactComponent as HomeSVG } from "src/assets/svg/home.svg";
import { twMerge } from "tailwind-merge";

const navigation = [
    {
        name: "Superfeed",
        href: "#",
        current: true,
        hasNew: true,
        icon: <HomeSVG className="w-4 h-4 my-0.5" />,
    },
    {
        name: "Portfolio",
        href: "#",
        current: false,
        hasNew: true,

        icon: <HomeSVG className="w-4 h-4 my-0.5" />,
    },
    {
        name: "Events",
        href: "#",
        current: false,
        hasNew: false,
        icon: <HomeSVG className="w-4 h-4 my-0.5" />,
    },
    {
        name: "Settings",
        href: "#",
        current: false,
        hasNew: true,
        icon: <HomeSVG className="w-4 h-4 my-0.5" />,
    },
    {
        name: "Places",
        href: "#",
        current: false,
        hasNew: false,
        icon: <HomeSVG className="w-4 h-4 my-0.5" />,
    },
];

const NavItem = ({ href, icon, current, hasNew }: (typeof navigation)[0]) => (
    <a
        href={href}
        className="inline-flex flex-col items-center justify-center px-5"
    >
        <span
            className={twMerge(
                "border border-gray-200 py-1 px-2 rounded-2xl relative",
                current && "bg-black border-black"
            )}
        >
            {icon}
            {hasNew && (
                <span
                    className={twMerge(
                        "w-2 h-2 bg-black border border-gray-200 rounded-full my-1 absolute -top-0.5 -right-0.5",
                        current && "bg-gray-200 border-black"
                    )}
                />
            )}
        </span>
    </a>
);

export const NavBottom = () => {
    return (
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 border-t bg-gray-700 border-gray-600">
            <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
                {navigation.map((item) => (
                    <NavItem key={item.name} {...item} />
                ))}
            </div>
        </div>
    );
};
