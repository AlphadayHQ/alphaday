import { FC } from "react";
import { twMerge } from "tailwind-merge";
import styles from "Button.module.scss";

interface IProps {
    isCollapsed: boolean;
    className?: string;
}

const CollapseButton: FC<IProps> = ({ isCollapsed, className }) => (
    <div
        className={twMerge(className, styles.collapseButton)}
        role="button"
        title="Open/close details"
    >
        <span
            className={`expand-collapse-icon ${
                isCollapsed ? "collapsed" : ""
            } `}
        />
    </div>
);

export default CollapseButton;
