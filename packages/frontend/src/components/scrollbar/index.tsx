import { FC } from "react";
import { PositionProps } from "@alphaday/shared/styled";
import PerfectScrollbar, { ScrollBarProps } from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { StyledWrap } from "./style";

const ScrollBar: FC<PositionProps & ScrollBarProps> = ({
    children,
    onScroll,
    containerRef,
    onYReachEnd,
    ...rest
}) => {
    return (
        <StyledWrap {...rest}>
            <PerfectScrollbar
                containerRef={containerRef}
                onYReachEnd={onYReachEnd}
                onScroll={onScroll}
                {...rest}
            >
                {children}
            </PerfectScrollbar>
        </StyledWrap>
    );
};

export default ScrollBar;
