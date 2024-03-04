import { useRef, FC, FormEvent, useCallback } from "react";
import { twMerge, ModuleLoader, ScrollBar } from "@alphaday/ui-kit";
import { useOnScreen } from "src/api/hooks";
import { TSuperfeedItem } from "src/api/types";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import { ReactComponent as SettingsSVG } from "src/assets/icons/settings.svg";
import { ReactComponent as Settings2SVG } from "src/assets/icons/settings3.svg";
import { FeedCard } from "./feed/FeedCard";

interface ISuperfeedModule {
    isLoading: boolean;
    feed: TSuperfeedItem[] | undefined;
    handlePaginate: (type: "next" | "previous") => void;
    toggleShowFeedFilters: () => void;
    onShareItem: (item: TSuperfeedItem) => Promise<void>;
    selectedPodcast: TSuperfeedItem | null;
    setSelectedPodcast: React.Dispatch<
        React.SetStateAction<TSuperfeedItem | null>
    >;
}

const FiltersButton: FC<{ toggleShowFeedFilters: () => void }> = ({
    toggleShowFeedFilters,
}) => {
    const element1: React.Ref<HTMLDivElement> = useRef(null);
    const element2: React.Ref<HTMLDivElement> = useRef(null);
    const element1Visible = useOnScreen(element1);

    return (
        <>
            <div
                ref={element1}
                className="flex justify-between mb-4 px-4 py-2 border border-accentVariant100 rounded-lg"
                onClick={toggleShowFeedFilters}
                tabIndex={0}
                role="button"
            >
                <p className="m-0 pr-2 fontGroup-highlight self-center">
                    Craft your superfeed with personalized filters
                </p>
                <SettingsSVG className="w-6 text-accentVariant100 mt-[3px]" />
            </div>
            <div
                ref={element2}
                onClick={toggleShowFeedFilters}
                tabIndex={0}
                role="button"
                title="Open filters"
                className={twMerge(
                    "absolute bg-accentVariant100 rounded-lg p-4 bottom-10 right-5 z-10 delay-300",
                    element1Visible && "hidden delay-0"
                )}
            >
                <Settings2SVG className="w-6 text-primary" />
            </div>
        </>
    );
};

const SuperfeedModule: FC<ISuperfeedModule> = ({
    isLoading,
    feed,
    handlePaginate,
    toggleShowFeedFilters,
    selectedPodcast,
    setSelectedPodcast,
    onShareItem,
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
            <FiltersButton toggleShowFeedFilters={toggleShowFeedFilters} />
            {feed.map((item) => (
                <FeedCard
                    key={item.id}
                    item={item}
                    selectedPodcast={selectedPodcast}
                    setSelectedPodcast={setSelectedPodcast}
                    onLike={() => {}}
                    onShare={() => onShareItem(item)}
                />
            ))}
        </ScrollBar>
    );
};

export default SuperfeedModule;
