import { FC, FormEvent, useCallback } from "react";
import { FeedCard, ModuleLoader, ScrollBar } from "@alphaday/ui-kit";
import { TSuperfeedItem } from "src/api/types";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";

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
    const handleScrollEvent = useCallback(
        ({ currentTarget }: FormEvent<HTMLElement>) => {
            if (shouldFetchMoreItems(currentTarget)) {
                handlePaginate("next");
            }
        },
        [handlePaginate]
    );
    if (isLoading || feed === undefined) {
        return <ModuleLoader $height="100%" />;
    }

    return (
        <ScrollBar onScroll={handleScrollEvent} className="w-full px-5 pt-4">
            {feed.map((item) => (
                <FeedCard key={item.id} item={item} />
            ))}
        </ScrollBar>
    );
};

export default SuperfeedModule;
