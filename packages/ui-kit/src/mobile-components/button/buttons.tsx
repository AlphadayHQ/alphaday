import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

export const ActionButton: FC<{ children: ReactNode; onClick: () => void }> = ({
    onClick,
    children,
}) => {
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
            className="bg-backgroundVariant300 text-primary fontGroup-mini mx-0.5 flex h-4 max-w-[48px] items-center justify-center rounded-lg px-2 py-0.5"
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
                    "bg-backgroundBlue100 text-primary fontGroup-mini m-0.5 flex h-4 max-w-min items-center whitespace-nowrap rounded-lg px-2 py-0.5 !capitalize leading-[18px]",
                    className
                )}
            >
                {name}
            </button>
        );
    }
    return (
        <Link
            to={`/superfeed?tags=${slug}`}
            className={twMerge(
                "bg-backgroundBlue100 text-primary fontGroup-mini m-0.5 flex h-4 max-w-min items-center whitespace-nowrap rounded-lg px-2 py-0.5 !capitalize leading-[18px]",
                className
            )}
        >
            {name}
        </Link>
    );
};
