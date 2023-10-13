import { FC } from "react";
import Skeleton from "react-loading-skeleton";
import { twMerge } from "tailwind-merge";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./Skeleton.module.scss";

export const ChannelSkeleton: FC = () => {
    return (
        <div className="p-[5px] pl-[10px] flex flex-col bg-backgroundVariant200 hover:bg-backgroundVariant200">
            <div className="w-[50px] h-auto [&>a]:block [&:img]:w-[50px] [&:img]:h-[50px] [&:img]:rounded-[4px] [&:img]:object-cover">
                <Skeleton
                    className={twMerge(
                        "rounded-[4px] w-[60px] h-[60px]",
                        styles["custom-skeleton"]
                    )}
                />
            </div>
            <Skeleton
                className={twMerge(
                    "rounded-[4px] w-[60px] mt-3",
                    styles["custom-skeleton"]
                )}
            />
        </div>
    );
};
