import React from "react";
import { ReactComponent as ChevronLeftIcon } from "src/assets/svg/chevron-left.svg";
import { ReactComponent as Close3Icon } from "src/assets/svg/close3.svg";
import { twMerge } from "tailwind-merge";

interface PagerProps {
    title?: string | React.ReactNode;
    handleClose?: () => void;
    handleBack?: () => void;
}

export const Pager: React.FC<PagerProps> = ({
    title,
    handleBack,
    handleClose,
}) => {
    return (
        <div className="w-full flex justify-between items-center px-4 py-5">
            <button
                type="button"
                className={twMerge(
                    "flex flex-grow invisible",
                    handleBack && "visible"
                )}
                onClick={handleBack}
                title="Back"
            >
                <ChevronLeftIcon />
            </button>
            <div className="flex flex-grow justify-center uppercase font-bold text-base">
                {title}
            </div>
            <button
                type="button"
                className={twMerge(
                    "flex flex-grow justify-end invisible",
                    handleClose && "visible"
                )}
                onClick={handleClose}
                title="Close"
            >
                <Close3Icon className="text-primary" />
            </button>
        </div>
    );
};
