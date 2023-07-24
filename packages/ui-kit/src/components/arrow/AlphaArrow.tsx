import { FC } from "react";
import ArrowDown from "src/assets/svg/arrow-down.svg";
import ArrowUp from "src/assets/svg/arrow-up.svg";
export const AlphaArrow: FC<{ direction: "up" | "down" }> = ({ direction }) => {
    return (
        <img
            className="ml-[3px] inline-block h-2"
            src={direction === "up" ? ArrowUp : ArrowDown}
            alt="arrow"
        />
    );
};
