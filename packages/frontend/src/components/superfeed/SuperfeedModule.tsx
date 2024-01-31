import { FC } from "react";
import { FeedCard, ModuleLoader } from "@alphaday/ui-kit";
import { TSuperfeedItem } from "src/api/types";

interface ISuperfeedModule {
    isLoading: boolean;
    feed: TSuperfeedItem[] | undefined;
    handlePaginate: (type: "next" | "previous") => void;
}

const SuperfeedModule: FC<ISuperfeedModule> = ({
    isLoading,
    feed,
    handlePaginate,
}) => {
    if (isLoading || feed === undefined) {
        return <ModuleLoader $height="100%" />;
    }

    return (
        <div className="w-full px-5 pt-4">
            {feed.map((item) => (
                <FeedCard key={item.id} item={item} />
            ))}
        </div>
    );
};

export default SuperfeedModule;
