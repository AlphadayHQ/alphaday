import { useRef, FC, FormEvent, useCallback } from "react";
import { twMerge, ModuleLoader } from "@alphaday/ui-kit";
import { IonFab, IonList } from "@ionic/react";
import { useOnScreen } from "src/api/hooks";
import { TSuperfeedItem } from "src/api/types";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import { ReactComponent as SettingsSVG } from "src/assets/icons/settings.svg";
import { ReactComponent as Settings2SVG } from "src/assets/icons/settings3.svg";
import { FeedCard } from "./feed/FeedCard";

interface ISuperfeedModule {
    isLoading: boolean;
    isAuthenticated: boolean;
    feed: TSuperfeedItem[] | undefined;
    isEmptyFeedResult?: boolean;
    handlePaginate: (type: "next" | "previous") => void;
    toggleShowFeedFilters: () => void;
    onShareItem: (item: TSuperfeedItem) => Promise<void>;
    onLikeItem: (item: TSuperfeedItem) => Promise<void>;
    onClickItem: (item: TSuperfeedItem) => Promise<void>;
    selectedPodcast: TSuperfeedItem | null;
    setSelectedPodcast: React.Dispatch<
        React.SetStateAction<TSuperfeedItem | null>
    >;
}

const SuperfeedModule: FC<ISuperfeedModule> = ({
    isLoading,
    isAuthenticated,
    feed,
    handlePaginate,
    toggleShowFeedFilters,
    selectedPodcast,
    setSelectedPodcast,
    onShareItem,
    onLikeItem,
    onClickItem,
    isEmptyFeedResult,
}) => {
    const filtersWrap: React.Ref<HTMLDivElement> = useRef(null);
    const isFiltersVisible = useOnScreen(filtersWrap);

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
        <>
            <IonList
                onScroll={handleScrollEvent}
                className="w-full px-3.5 pt-4 bg-transparent overflow-y-auto overscroll-contain h-full"
            >
                <div
                    ref={filtersWrap}
                    className="flex justify-between mb-5 px-4 py-2 border border-accentVariant100 rounded-lg cursor-pointer"
                    onClick={toggleShowFeedFilters}
                    tabIndex={0}
                    role="button"
                >
                    <p className="m-0 pr-4 fontGroup-highlight self-center">
                        {isEmptyFeedResult
                            ? "No results for your current filter preferences"
                            : "Craft your superfeed with personalized filters"}
                    </p>
                    <SettingsSVG className="w-6 text-accentVariant100 self-center" />
                </div>
                {isEmptyFeedResult && (
                    <h3 className="text-xl fontGroup-major mt-4">
                        Explore Trending
                    </h3>
                )}
                {feed.map((item) => (
                    <FeedCard
                        key={`${item.type}-${item.id}`}
                        item={item}
                        isAuthenticated={isAuthenticated}
                        selectedPodcast={selectedPodcast}
                        setSelectedPodcast={setSelectedPodcast}
                        onLike={() => onLikeItem(item)}
                        onShare={() => onShareItem(item)}
                        onClick={() => onClickItem(item)}
                    />
                ))}
            </IonList>
            <IonFab
                slot="fixed"
                horizontal="end"
                vertical="bottom"
                className={twMerge(
                    "fixed",
                    isFiltersVisible && "hidden delay-0"
                )}
            >
                <button
                    type="button"
                    onClick={toggleShowFeedFilters}
                    title="Open filters"
                    className="bg-accentVariant100 rounded-2xl p-4 delay-300 mr-2.5 mb-[5vh]"
                >
                    <Settings2SVG className="w-6 text-primary" />
                </button>
            </IonFab>
        </>
    );
};

export default SuperfeedModule;
