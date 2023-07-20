import { FC } from "react";
import styles from "./AlphaButton.module.scss";

interface IProps {
    isCollapsed: boolean;
}

const AlphaCollapseButton: FC<IProps> = ({ isCollapsed }) => (
  <div
    className={styles.alphaCollapseButton}
    role="button"
    title="Open/close details"
  >
    <span
      className={`expand-collapse-icon ${isCollapsed ? "collapsed" : ""} `}
    />
  </div>
);

export default AlphaCollapseButton;
