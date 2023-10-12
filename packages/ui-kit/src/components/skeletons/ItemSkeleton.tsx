import Skeleton from "react-loading-skeleton";

export const ItemSkeleton = () => {
    return (
        <div className="p-[5px] pl-[10px] flex flex-col bg-backgroundVariant200 hover:bg-backgroundVariant200">
            <div className="w-[50px] h-auto [&>a]:block [&:img]:w-[50px] [&:img]:h-[50px] [&:img]:rounded-[4px] [&:img]:object-cover">
                <Skeleton
                    style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "4px",
                    }}
                />
            </div>
            <div className="flex-1 mt-0 ml-[10px] two-col:ml-5">
                <p className="uppercase fontGroup-supportBold mb-[5px] block text-primary">
                    <Skeleton style={{ maxWidth: "70px" }} />
                </p>
                <h6 className="[&>a]:text-btnBackgroundVariant1800">
                    <Skeleton />
                </h6>
            </div>
        </div>
    );
};
