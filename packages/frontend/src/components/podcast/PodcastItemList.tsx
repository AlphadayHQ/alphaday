import { FC, FormEvent } from "react";
import { ItemSkeleton, ListItem, ScrollBar } from "@alphaday/ui-kit";
import { TPodcastItem } from "src/api/types";
import { computeDuration } from "src/api/utils/dateUtils";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import globalMessages from "src/globalMessages";

interface IPodcastItemList {
    podcasts: TPodcastItem[] | undefined;
    handlePaginate: (type: "next" | "previous") => void;
    onBookmark: (id: TPodcastItem) => MaybeAsync<void>;
    isAuthenticated?: boolean;
    handlePlay: (item: TPodcastItem) => void;
    selectedPodcast: TPodcastItem | null;
    isPlaying: boolean;
}
const PodcastItemList: FC<IPodcastItemList> = ({
    podcasts,
    handlePaginate,
    onBookmark,
    isAuthenticated,
    handlePlay,
    selectedPodcast,
    isPlaying,
}) => {
    const handleListScroll = ({ currentTarget }: FormEvent<HTMLElement>) => {
        if (shouldFetchMoreItems(currentTarget)) {
            handlePaginate("next");
        }
    };
    if (!(podcasts === undefined)) {
        if (podcasts.length === 0) {
            return (
                <div className="flex w-full h-full justify-center items-center bg-background">
                    <p className="text-primary fontGroup-highlightSemi">
                        {globalMessages.queries.noMatchFound("podcasts")}
                    </p>
                </div>
            );
        }
        return (
            <ScrollBar onScroll={handleListScroll}>
                {podcasts.map((item) => {
                    return (
                        <ListItem
                            key={item.id}
                            variant="podcast"
                            title={item.title}
                            duration={computeDuration(item.publishedAt)}
                            tag={item.sourceName}
                            tagImg={item.sourceIcon}
                            mediaLength={item.duration}
                            description={item.shortDescription}
                            bookmarked={item.bookmarked}
                            onClick={() => handlePlay(item)}
                            onBookmark={() => onBookmark(item)}
                            isAuthenticated={isAuthenticated}
                            isPlaying={
                                item.id === selectedPodcast?.id && isPlaying
                            }
                        />
                    );
                })}
            </ScrollBar>
        );
    }
    return (
        <ScrollBar>
            {Array.from(Array(9), Math.random).map((item) => {
                return (
                    <div className="abs" key={item}>
                        <ItemSkeleton />
                        <hr className="m-0 border-borderLine" />
                    </div>
                );
            })}
        </ScrollBar>
    );
};

export default PodcastItemList;
