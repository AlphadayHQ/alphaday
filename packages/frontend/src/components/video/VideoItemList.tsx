import { FC, FormEvent } from "react";
import { ItemSkeleton, ListItem, ScrollBar } from "@alphaday/ui-kit";
import { TVideoItem } from "src/api/types";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import globalMessages from "src/globalMessages";

interface IVideoItemList {
    videos: TVideoItem[] | undefined;
    handlePaginate: (type: "next" | "previous") => void;
    onClick: ((id: number) => MaybeAsync<void>) | undefined;
    onBookmark: (id: TVideoItem) => MaybeAsync<void>;
    isAuthenticated?: boolean;
    handlePlay: (item: TVideoItem) => MaybeAsync<void>;
    selectedVideo: TVideoItem | null;
}
const VideoItemList: FC<IVideoItemList> = ({
    videos,
    handlePaginate,
    onClick,
    onBookmark,
    isAuthenticated,
    handlePlay,
    selectedVideo,
}) => {
    const handleListScroll = ({ currentTarget }: FormEvent<HTMLElement>) => {
        if (shouldFetchMoreItems(currentTarget)) {
            handlePaginate("next");
        }
    };
    if (!(videos === undefined)) {
        if (videos.length === 0) {
            return (
                <div className="flex w-full h-full justify-center items-center bg-background">
                    <p className="text-primary fontGroup-highlightSemi">
                        {globalMessages.queries.noMatchFound("videos")}
                    </p>
                </div>
            );
        }
        return (
            <ScrollBar onScroll={handleListScroll}>
                {videos.map((item) => {
                    return (
                        <ListItem
                            key={item.id}
                            variant="video"
                            title={item.title}
                            date={item.publishedAt}
                            tag={item.sourceName}
                            tagImg={item.sourceIcon}
                            description={item.shortDescription}
                            bookmarked={item.bookmarked}
                            onClick={async () => {
                                if (handlePlay !== undefined) {
                                    await handlePlay(item);
                                }
                                if (onClick !== undefined) {
                                    await onClick(item.id);
                                }
                            }}
                            onBookmark={() => onBookmark(item)}
                            isAuthenticated={isAuthenticated}
                            isPlaying={item.id === selectedVideo?.id}
                            image={item.image}
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

export default VideoItemList;
