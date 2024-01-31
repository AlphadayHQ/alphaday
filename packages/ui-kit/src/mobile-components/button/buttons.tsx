import { FC, ReactNode } from "react";
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
            className="flex items-center justify-center max-w-[48px] h-4 px-2 py-0.5 rounded-lg bg-backgroundVariant300 text-primary fontGroup-mini mx-0.5"
        >
            {children}
        </button>
    );
};

export const TagButton: FC<{
    name: string;
    onClick: () => void;
    className?: string;
}> = ({ name, onClick, className }) => {
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
            className={twMerge(
                "flex items-center px-2 py-0.5 h-4 rounded-lg bg-backgroundBlue100 text-primary fontGroup-mini m-0.5",
                className
            )}
        >
            {name}
        </button>
    );
};
