import { FC } from "react";
import ReactSkeleton from "react-loading-skeleton";
import { twMerge } from "tailwind-merge";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./Skeleton.module.scss";

export const Skeleton: FC<{ className?: string }> = ({ className }) => {
    return (
        <ReactSkeleton
            className={twMerge(styles["custom-skeleton"], className)}
        />
    );
};
