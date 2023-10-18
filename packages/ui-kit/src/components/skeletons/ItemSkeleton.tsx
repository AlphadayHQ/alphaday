import Skeleton from "react-loading-skeleton";
import { twMerge } from "tailwind-merge";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./Skeleton.module.scss";

export const ItemSkeleton = () => {
    return (
        <div className="py-2 pr-1.5 pl-[10px] flex flex-row bg-backgroundVariant200 hover:bg-backgroundVariant200">
            <div className="w-[50px] h-auto [&>a]:block [&:img]:w-[50px] [&:img]:h-[50px] [&:img]:rounded-[4px] [&:img]:object-cover">
                <Skeleton
                    className={twMerge(
                        "rounded-[4px] w-[50px] h-[50px]",
                        styles["custom-skeleton"]
                    )}
                />
            </div>
            <div className="flex-1 mt-1 ml-[10px] two-col:ml-5">
                <p className="uppercase fontGroup-supportBold mb-[5px] block text-primary">
                    <Skeleton
                        className={twMerge(
                            "max-w-[70px]",
                            styles["custom-skeleton"]
                        )}
                    />
                </p>
                <h6 className="[&>a]:text-btnBackgroundVariant1800 mb-0">
                    <Skeleton className={styles["custom-skeleton"]} />
                </h6>
            </div>
        </div>
    );
};
