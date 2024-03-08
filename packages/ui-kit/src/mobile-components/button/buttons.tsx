import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

export const ActionButton: FC<{
    children: ReactNode;
    onClick: () => MaybeAsync<void>;
}> = ({ onClick, children }) => {
    const handleClick = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        e.stopPropagation();
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        onClick();
    };
    return (
        <button
            type="button"
            onClick={handleClick}
            className="bg-backgroundVariant300 hover:bg-backgroundVariant400 min-w-[36px] text-primary fontGroup-mini mx-0.5 flex h-5 max-w-[48px] items-center justify-center rounded-lg px-2 py-1"
        >
            {children}
        </button>
    );
};

export const TagButton: FC<{
    name: string;
    slug?: string;
    onClick: () => void;
    className?: string;
}> = ({ name, slug, onClick, className }) => {
    const handleClick = (e: React.MouseEvent<Element, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
    };
    if (!slug) {
        return (
            <button
                type="button"
                onClick={handleClick}
                className={twMerge(
                    "bg-backgroundBlue100 text-primary fontGroup-mini !font-semibold m-0.5 flex h-5 max-w-min items-center whitespace-nowrap rounded-lg px-2 py-0.5 !capitalize leading-[18px]",
                    className
                )}
            >
                {name}
            </button>
        );
    }
    return (
        <Link
            to={`/superfeed/search/${slug}`}
            className={twMerge(
                "bg-backgroundBlue100 text-primary fontGroup-mini m-0.5 flex h-5 max-w-min items-center whitespace-nowrap rounded-lg px-2 py-0.5 !capitalize leading-[18px]",
                className
            )}
        >
            {name}
        </Link>
    );
};

export const OutlineButton: FC<{
    title: string;
    subtext: string;
    icon: React.ReactNode;
    onClick: () => void;
    isAuthenticated: boolean;
}> = ({ onClick, title, subtext, icon, isAuthenticated }) => {
    return (
        <div
            onClick={onClick}
            tabIndex={0}
            role="button"
            className={twMerge(
                "w-full flex flex-col justify-center py-3 px-4 mt-2 border-2 border-backgroundVariant400 rounded-lg",
                isAuthenticated &&
                    "border-accentVariant100 bg-backgroundVariant200 hover:bg-backgroundVariant300"
            )}
        >
            <div className="flex flex-col px-4 py-3 items-center">
                <span
                    className={twMerge(
                        "fontGroup-highlight inline-flex !font-bold text-backgroundVariant400",
                        isAuthenticated &&
                            "[&_svg]:text-accentVariant100 text-primary"
                    )}
                >
                    {icon}
                    {title}
                </span>
                <span
                    className={twMerge(
                        "fontGroup-normal mt-2 text-backgroundVariant400",
                        isAuthenticated && "text-primary"
                    )}
                >
                    {subtext}
                </span>
            </div>
        </div>
    );
};
