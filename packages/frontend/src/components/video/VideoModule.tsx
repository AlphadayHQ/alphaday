import { FC, useMemo, useState, memo, UIEvent } from "react";
import { TabButton, twMerge } from "@alphaday/ui-kit";
import useHeaderScroll from "src/api/hooks/useHeaderScroll";
import { EItemFeedPreference, TVideoChannel, TVideoItem } from "src/api/types";
import VideoPlayer from "src/components/video/VideoPlayer";
import VideoChannelsList from "./VideoChannelsList";
import VideoItemList from "./VideoItemList";

interface IVideoModule {
    items: TVideoItem[] | undefined;
    isLoadingItems: boolean;
    channels: TVideoChannel[] | undefined;
    isLoadingChannels: boolean;
    handlePaginate: (type: "next" | "previous") => void;
    feedPreference: EItemFeedPreference;
    onSetFeedPreference: (preference: EItemFeedPreference) => void;
    widgetHeight: number;
    onClick?: (id: number) => MaybeAsync<void>;
    onBookmark: (id: TVideoItem) => MaybeAsync<void>;
    isAuthenticated: boolean;
    onSelectChannel: (channel: TVideoChannel) => void;
    onRemoveChannel: (channel: TVideoChannel) => void;
    isFullSize: boolean | undefined;
    preferredChannelIds: number[] | undefined;
    setPreferredChannelIds: (channels: TVideoChannel[]) => void;
}

const SWITCH_HEIGHT = 50;
const CHANNELS_LIST_HEIGHT = 157;
const CHANNELS_LIST_HEIGHT_COLLAPSED = 36;

const VIDEO_NAV_BUTTONS = [
    {
        label: "Feed",
        value: EItemFeedPreference.Last,
    },
    {
        label: "Trending",
        value: EItemFeedPreference.Trending,
    },
    {
        label: "Bookmarks",
        value: EItemFeedPreference.Bookmark,
        auth: true,
    },
];

const VideoModule: FC<IVideoModule> = memo(function VideoModule({
    items,
    isLoadingItems,
    channels,
    isLoadingChannels,
    handlePaginate,
    feedPreference,
    onSetFeedPreference,
    widgetHeight,
    onClick,
    onBookmark,
    isAuthenticated,
    onSelectChannel,
    onRemoveChannel,
    isFullSize,
    preferredChannelIds,
    setPreferredChannelIds,
}) {
    const {
        squareRef,
        headerRef,
        setHeaderRef,
        handleClickScroll,
        hideLeftPan,
        hideRightPan,
    } = useHeaderScroll();

    const [selectedVideo, setSelectedVideo] = useState<TVideoItem | null>(null);

    const [showChannels, setShowChannels] = useState(true);
    const [showVideo, setShowVideo] = useState(!!selectedVideo);
    const [showAllChannels, setShowAllChannels] = useState(false);

    const handleSelectVideo = (video: TVideoItem) => {
        setSelectedVideo(video);
    };
    const channelsHeight = useMemo(
        () =>
            showChannels
                ? CHANNELS_LIST_HEIGHT
                : CHANNELS_LIST_HEIGHT_COLLAPSED,
        [showChannels]
    );

    const onItemClick = async (id: number) => {
        if (onClick) {
            setShowVideo(true);
            await onClick(id);
        }
    };

    const onClosePlayer = () => {
        setShowVideo(false);
        setSelectedVideo(null);
    };
    return (
        <div
            onScroll={(e: UIEvent<HTMLElement>) => e.preventDefault()}
            className="overflow-hidden"
        >
            <div
                className={twMerge(
                    "flex transition-all duration-500 ease",
                    isFullSize ? "w-full" : "w-[200%]",
                    showVideo && !isFullSize
                        ? "translate-x-[-50%]"
                        : "translate-x-0"
                )}
            >
                <div
                    ref={squareRef}
                    className={twMerge(
                        isFullSize
                            ? "basis-auto max-w-full"
                            : "basis-[100%] max-w-[50%]"
                    )}
                    style={{ width: isFullSize ? "500px" : "100%" }}
                >
                    <div
                        className={twMerge(
                            "m-0 flex p-0 pl-[15px] items-center bg-background border-b border-borderLine [&>.wrap]:mr-[10px] transition-all duration-400",
                            (isLoadingItems || !items) && "bg-transparent"
                        )}
                        style={{ height: SWITCH_HEIGHT }}
                    >
                        {VIDEO_NAV_BUTTONS.map(
                            (nav) =>
                                ((nav.auth === true && isAuthenticated) ||
                                    !nav.auth) && (
                                    <span
                                        key={String(nav.value)}
                                        className="wrap"
                                    >
                                        <TabButton
                                            variant="small"
                                            uppercase={false}
                                            open={feedPreference === nav.value}
                                            onClick={() =>
                                                onSetFeedPreference(nav.value)
                                            }
                                        >
                                            {nav.label}
                                        </TabButton>
                                    </span>
                                )
                        )}
                    </div>

                    <VideoChannelsList
                        channels={channels}
                        isLoadingChannels={isLoadingChannels}
                        onSelectChannel={onSelectChannel}
                        onRemoveChannel={onRemoveChannel}
                        headerRef={headerRef}
                        setHeaderRef={setHeaderRef}
                        handleClickScroll={handleClickScroll}
                        hideLeftPan={hideLeftPan}
                        hideRightPan={hideRightPan}
                        showChannels={showChannels}
                        setShowChannels={setShowChannels}
                        showAllChannels={showAllChannels}
                        setShowAllChannels={setShowAllChannels}
                        channelsHeight={channelsHeight}
                        preferredChannelIds={preferredChannelIds}
                        setPreferredChannelIds={setPreferredChannelIds}
                    />

                    <div
                        className="transition-all duration-300 relative z-[1] [&_.title]:three-liner"
                        style={{
                            height:
                                widgetHeight - SWITCH_HEIGHT - channelsHeight,
                        }}
                    >
                        <VideoItemList
                            videos={items}
                            handlePaginate={handlePaginate}
                            handlePlay={handleSelectVideo}
                            selectedVideo={selectedVideo}
                            onClick={onItemClick}
                            onBookmark={onBookmark}
                            isAuthenticated={isAuthenticated}
                        />
                    </div>
                </div>
                <div
                    className={twMerge(
                        "flex overflow-hidden z-[1] bg-btnBackgroundVariant400",
                        isFullSize ? `w-[calc(100%_-_500px)]` : "w-full"
                    )}
                >
                    <VideoPlayer
                        video={selectedVideo}
                        closePlayer={onClosePlayer}
                        onBookmark={onBookmark}
                        isAuthenticated={isAuthenticated}
                        isFullSize={isFullSize}
                    />
                </div>
            </div>
        </div>
    );
});
export default VideoModule;
