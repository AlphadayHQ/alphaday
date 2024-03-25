import { FC } from "react";
import ArrowDown from "src/assets/svg/arrow-down.svg";
import ArrowUp from "src/assets/svg/arrow-up.svg";
import { twMerge } from "tailwind-merge";

export const Arrow: FC<{ direction: "up" | "down"; className?: string }> = ({
    direction,
    className,
}) => {
    return (
        <img
            className={twMerge("ml-[3px] inline-block h-2", className)}
            src={direction === "up" ? ArrowUp : ArrowDown}
            alt="arrow"
        />
    );
};
