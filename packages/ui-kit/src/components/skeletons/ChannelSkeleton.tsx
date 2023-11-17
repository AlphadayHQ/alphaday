import { FC } from "react";
import { Skeleton } from "./Skeleton";

export const ChannelSkeleton: FC = () => {
    return (
        <div className="p-[5px] pl-[10px] flex flex-col bg-backgroundVariant200 hover:bg-backgroundVariant200">
            <div className="w-[50px] h-auto [&>a]:block [&:img]:w-[50px] [&:img]:h-[50px] [&:img]:rounded-[4px] [&:img]:object-cover">
                <Skeleton className="rounded-[4px] w-[60px] h-[60px]" />
            </div>
            <Skeleton className="rounded-[4px] w-[60px] mt-3" />
        </div>
    );
};
