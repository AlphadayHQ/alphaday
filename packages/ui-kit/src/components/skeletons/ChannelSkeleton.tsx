import { FC } from "react";
import Skeleton from "react-loading-skeleton";

export const ChannelSkeleton: FC = () => {
    return (
        <div className="p-[5px] pl-[10px] flex flex-col bg-backgroundVariant200 hover:bg-backgroundVariant200">
            <div className="w-[50px] h-auto [&>a]:block [&:img]:w-[50px] [&:img]:h-[50px] [&:img]:rounded-[4px] [&:img]:object-cover">
                <Skeleton
                    style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "4px",
                    }}
                />
            </div>
            <Skeleton
                style={{
                    width: "60px",
                    marginTop: "14px",
                }}
            />
        </div>
    );
};
