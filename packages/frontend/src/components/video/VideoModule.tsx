import { FC, useMemo, useState, memo } from "react";
import { TabButton } from "@alphaday/ui-kit";
import useHeaderScroll from "src/api/hooks/useHeaderScroll";
import { EItemFeedPreference, TVideoChannel, TVideoItem } from "src/api/types";
import VideoPlayer from "src/components/video/VideoPlayer";
import VideoChannelsList from "./VideoChannelsList";
import VideoItemList from "./VideoItemList";
import {
    StyledContainer,
    StyledList,
    StyledSwitchWrap,
    StyledPlayerWrap,
} from "./VideoModule.style";

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
        <StyledContainer
            onScroll={(e: Event) => e.preventDefault()}
            $isFullSize={isFullSize}
            $showVideo={showVideo}
        >
            <div className="slide-wrap">
                <div ref={squareRef} className="list-wrap">
                    <StyledSwitchWrap
                        $height={SWITCH_HEIGHT}
                        $isLoading={isLoadingItems || !items}
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
                    </StyledSwitchWrap>

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

                    <StyledList
                        $height={widgetHeight - SWITCH_HEIGHT - channelsHeight}
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
                    </StyledList>
                </div>
                <StyledPlayerWrap $isFullSize={isFullSize}>
                    <VideoPlayer
                        video={selectedVideo}
                        closePlayer={onClosePlayer}
                        onBookmark={onBookmark}
                        isAuthenticated={isAuthenticated}
                        isFullSize={isFullSize}
                    />
                </StyledPlayerWrap>
            </div>
        </StyledContainer>
    );
});
export default VideoModule;
