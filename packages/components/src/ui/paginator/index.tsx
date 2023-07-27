import React from "react";
import { StyledNav } from "./style";

interface IProps {
    onNext: () => void;
    currentPage: number;
    lastPage: boolean;
    startPage: boolean;
    onPrev: () => void;
    LeftIcon: string;
    RightIcon: string;
}
const Paginator: React.FC<IProps> = ({
    onNext,
    onPrev,
    lastPage,
    startPage,
    LeftIcon,
    RightIcon,
}) => {
    return (
        <StyledNav>
            {!startPage && (
                <span
                    onClick={onPrev}
                    role="button"
                    tabIndex={0}
                    className="left"
                    title="left"
                >
                    <img src={LeftIcon} alt="" />
                </span>
            )}
            {!lastPage && (
                <span
                    onClick={onNext}
                    role="button"
                    tabIndex={0}
                    className="right"
                    title="left"
                >
                    <img src={RightIcon} alt="" />
                </span>
            )}
        </StyledNav>
    );
};

export default Paginator;
