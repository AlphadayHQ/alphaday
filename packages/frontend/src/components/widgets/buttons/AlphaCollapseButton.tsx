import { FC } from "react";
import { StyledCollapseButton } from "./AlphaCollapseButton.style";

interface IProps {
    isCollapsed: boolean;
}

const AlphaCollapseButton: FC<IProps> = ({ isCollapsed }) => (
    <StyledCollapseButton
        className="collapse-button"
        role="button"
        title="Open/close details"
    >
        <span
            className={`expand-collapse-icon ${
                isCollapsed ? "collapsed" : ""
            } `}
        />
    </StyledCollapseButton>
);

export default AlphaCollapseButton;
