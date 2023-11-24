import { FC, useMemo } from "react";
import { Button } from "@alphaday/ui-kit";
import useElementSize from "src/api/hooks/useElementSize";
import { TVideoItem } from "src/api/types";
import { computeDuration } from "src/api/utils/dateUtils";
import { ReactComponent as ArrowSVG } from "src/assets/icons/arrow-right.svg";
import ItemBookmark from "src/components/listItem/ItemBookmark";

interface IVideoPlayer {
    video: TVideoItem | null;
    closePlayer: () => void;
    onBookmark: (id: TVideoItem) => MaybeAsync<void>;
    isAuthenticated?: boolean;
    isFullSize: boolean | undefined;
}

const BACK_BUTTON_HEIGHT = 42; // including the margin

const VideoPlayer: FC<IVideoPlayer> = ({
    video,
    closePlayer,
    onBookmark,
    isAuthenticated,
    isFullSize,
}) => {
    const [
        setVideoPlayerWrapRef,
        { width: videoPlayerWrapWidth, height: videoPlayerWrapHeight },
    ] = useElementSize();
    const [setVideoInfoRef, { height: videoInfoHeight }] = useElementSize();

    // The PlayerHeight needs to be set but we want it to take
    // the available space, so we subtract the height of the back button
    // and the height of the video details.
    const playerHeight = useMemo(() => {
        const height =
            videoPlayerWrapHeight !== 0 && videoInfoHeight !== 0
                ? videoPlayerWrapHeight - videoInfoHeight
                : undefined;

        if (!isFullSize && height) return height - BACK_BUTTON_HEIGHT;
        return height;
    }, [videoPlayerWrapHeight, videoInfoHeight, isFullSize]);

    const duration = video?.publishedAt
        ? computeDuration(video?.publishedAt)
        : undefined;

    if (video === null) {
        return (
            <div className="w-full flex justify-center items-center bg-backgroundVariant200">
                No Video Selected
            </div>
        );
    }

    if (!video) {
        return (
            <div className="w-full flex justify-center items-center bg-backgroundVariant200">
                Something went wrong.
            </div>
        );
    }

    return (
        <div className="w-full h-full p-[15px] bg-backgroundVariant200">
            <div
                className="w-full h-full flex flex-col items-start"
                ref={setVideoPlayerWrapRef}
            >
                {!isFullSize && (
                    <Button
                        className="mb-4"
                        variant="extraSmall"
                        onClick={closePlayer}
                    >
                        <ArrowSVG className="mr-[5px]" /> Back
                    </Button>
                )}
                <div className="w-full relative text-[0]">
                    <iframe
                        title="video"
                        className="w-full border-0 border-none"
                        src={video.url
                            .replace("watch?v=", "embed/")
                            .concat("?autoplay=1")}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        width={videoPlayerWrapWidth}
                        height={playerHeight}
                    />
                </div>
                <div className="flex flex-col">
                    <div
                        ref={setVideoInfoRef}
                        className="pr-0 pb-0 pt-[14.5px] pl-[10px] flex flex-col justify-between h-[initial]"
                    >
                        <p className="fontGroup-highlight text-primary m-0">
                            {video.title}
                        </p>

                        <p className="flex mt-[8.5px] fontGroup-mini text-primaryVariant100 text-center [&_.bookmark]:block [&_.bookmark]:mt-[1px] [&_.bookmark]:cursor-pointer">
                            <span>{video.sourceName}</span>
                            <span className="my-0 mx-[7px]">•</span>
                            <span className="date">{duration}</span>
                            <ItemBookmark
                                isAuthenticated={isAuthenticated}
                                onBookmark={() => onBookmark(video)}
                                bookmarked={video.bookmarked}
                            />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default VideoPlayer;
