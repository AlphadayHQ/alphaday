import { FC } from "react";
import {twMerge} from "tailwind-merge"
import styles from "./AlphaButton.module.scss";

interface IProps {
  isCollapsed: boolean;
  className?: string;
}

const AlphaCollapseButton: FC<IProps> = ({ isCollapsed, className }) => (
  <div
    className={twMerge(className, styles.alphaCollapseButton)}
    role="button"
    title="Open/close details"
  >
    <span
      className={`expand-collapse-icon ${isCollapsed ? "collapsed" : ""} `}
    />
  </div>
);

export default AlphaCollapseButton;
