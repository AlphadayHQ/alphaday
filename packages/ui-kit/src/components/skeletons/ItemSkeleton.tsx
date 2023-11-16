import { Skeleton } from "./Skeleton";

export const ItemSkeleton = () => {
    return (
        <div className="py-2 pr-1.5 pl-[10px] flex flex-row bg-backgroundVariant200 hover:bg-backgroundVariant200">
            <div className="w-[50px] h-auto [&>a]:block [&:img]:w-[50px] [&:img]:h-[50px] [&:img]:rounded-[4px] [&:img]:object-cover">
                <Skeleton className="rounded-[4px] w-[50px] h-[50px]" />
            </div>
            <div className="flex-1 mt-1 ml-[10px] two-col:ml-5">
                <p className="uppercase fontGroup-supportBold mb-[5px] block text-primary">
                    <Skeleton className="max-w-[70px]" />
                </p>
                <h6 className="[&>a]:text-btnBackgroundVariant1800 mb-0">
                    <Skeleton />
                </h6>
            </div>
        </div>
    );
};
