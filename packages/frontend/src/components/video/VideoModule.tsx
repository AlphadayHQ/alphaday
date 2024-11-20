import { FC, useMemo, useState, memo, UIEvent } from "react";
import { TabsBar, twMerge } from "@alphaday/ui-kit";
import useHeaderScroll from "src/api/hooks/useHeaderScroll";
import { EItemFeedPreference, TVideoChannel, TVideoItem } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import { translateLabels } from "src/api/utils/translationUtils";
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

const SWITCH_HEIGHT = 38;
const CHANNELS_LIST_HEIGHT = 149;
const CHANNELS_LIST_HEIGHT_COLLAPSED = 36;

const VIDEO_NAV_ITEMS = [
    {
        label: translateLabels("Feed"),
        value: EItemFeedPreference.Last,
    },
    {
        label: translateLabels("Trending"),
        value: EItemFeedPreference.Trending,
    },
    {
        label: translateLabels("Bookmarks"),
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

    const NavItemPreference =
        VIDEO_NAV_ITEMS.find((item) => item.value === feedPreference) ||
        VIDEO_NAV_ITEMS[0];

    const onTabOptionChange = (value: string) => {
        const optionItem = VIDEO_NAV_ITEMS.find((item) => item.value === value);
        if (optionItem === undefined) {
            Logger.debug("VideoModule::Nav option item not found");
            return;
        }
        onSetFeedPreference(optionItem?.value);
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
                            "flex items-center mx-2",
                            (isLoadingItems || !items) && "bg-transparent"
                        )}
                        style={{ height: SWITCH_HEIGHT }}
                    >
                        <TabsBar
                            options={VIDEO_NAV_ITEMS}
                            onChange={onTabOptionChange}
                            selectedOption={NavItemPreference}
                        />
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
                        className="transition-all duration-300 bg-background relative z-[1] [&_.title]:line-clamp-3"
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
                        "flex overflow-hidden z-[1]",
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
