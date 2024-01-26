import { ReactComponent as ExploreSVG } from "src/assets/svg/explore.svg";
import { ReactComponent as MarketsSVG } from "src/assets/svg/markets.svg";
import { ReactComponent as PortfolioSVG } from "src/assets/svg/portfolio.svg";
import { ReactComponent as SuperfeedSVG } from "src/assets/svg/superfeed.svg";
import { twMerge } from "tailwind-merge";

const navigation = [
    {
        name: "Superfeed",
        href: "#",
        current: true,
        hasNew: true,
        icon: <SuperfeedSVG className="w-6 h-6 my-0.5" />,
    },
    {
        name: "Markets",
        href: "#",
        current: false,
        hasNew: false,
        icon: <MarketsSVG className="w-6 h-6 my-0.5" />,
    },
    {
        name: "Portfolio",
        href: "#",
        current: false,
        hasNew: true,

        icon: <PortfolioSVG className="w-6 h-6 my-0.5" />,
    },
    {
        name: "Explore",
        href: "#",
        current: false,
        hasNew: false,
        icon: <ExploreSVG className="w-6 h-6 my-0.5" />,
    },
];

const NavItem = ({ href, icon, current, name }: (typeof navigation)[0]) => (
    <a
        href={href}
        className="inline-flex flex-col items-center justify-center py-3 px-2"
    >
        <span
            className={twMerge(
                "rounded-2xl relative text-primaryVariant100",
                current &&
                    "bg-background border-background fill-secondaryOrange text-secondaryOrange"
            )}
        >
            {icon}
        </span>
        <span
            className={twMerge(
                "capitalize text-primaryVariant100 mt-1 fontGroup-highlightSemi",
                current && "text-primary"
            )}
        >
            {name}
        </span>
    </a>
);

export const NavBottom = () => {
    return (
        <>
            {/* spacer for the fixed navigation below. Should be the same height as the navigation */}
            <div className="w-full h-[74px]" />
            <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background border-borderLine">
                <div className="grid h-full max-w-lg grid-cols-4 mx-auto">
                    {navigation.map((item) => (
                        <NavItem key={item.name} {...item} />
                    ))}
                </div>
            </div>
        </>
    );
};
