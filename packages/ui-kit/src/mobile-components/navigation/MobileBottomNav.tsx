import { ReactComponent as HomeSVG } from "src/assets/svg/home.svg";
import { twMerge } from "tailwind-merge";

const navigation = [
    {
        name: "Superfeed",
        href: "#",
        current: true,
        icon: <HomeSVG className="w-4 h-4 my-0.5" />,
    },
    {
        name: "Portfolio",
        href: "#",
        current: false,
        icon: <HomeSVG className="w-4 h-4 my-0.5" />,
    },
    {
        name: "Events",
        href: "#",
        current: false,
        icon: <HomeSVG className="w-4 h-4 my-0.5" />,
    },
    {
        name: "Settings",
        href: "#",
        current: false,
        icon: <HomeSVG className="w-4 h-4 my-0.5" />,
    },
    {
        name: "Places",
        href: "#",
        current: false,
        icon: <HomeSVG className="w-4 h-4 my-0.5" />,
    },
];

const NavItem = ({ href, icon, current }: (typeof navigation)[0]) => (
    <a
        href={href}
        className="inline-flex flex-col items-center justify-center px-5"
    >
        <span
            className={twMerge(
                "border border-gray-200 py-2 px-3 rounded-2xl",
                current && "bg-black border-black"
            )}
        >
            {icon}
        </span>
    </a>
);

const MobileBottomNav = () => {
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

export default MobileBottomNav;
