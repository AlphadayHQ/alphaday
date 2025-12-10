import { FC, useMemo, useState } from "react";
import { TabsBar, twMerge } from "@alphaday/ui-kit";
import { useAudioPlayer } from "react-use-audio-player";
import useHeaderScroll from "src/api/hooks/useHeaderScroll";
import {
    EItemFeedPreference,
    TPodcastChannel,
    TPodcastItem,
} from "src/api/types";
import { Logger } from "src/api/utils/logging";
import { translateLabels } from "src/api/utils/translationUtils";
import AudioPlayer from "src/components/podcast/AudioPlayer";
import PodcastChannelsList from "./PodcastChannelsList";
import PodcastItemList from "./PodcastItemList";

interface IPodcastModule {
    items: TPodcastItem[] | undefined;
    isLoadingItems: boolean;
    channels: TPodcastChannel[] | undefined;
    isLoadingChannels: boolean;
    handlePaginate: (type: "next" | "previous") => void;
    feedPreference: EItemFeedPreference;
    onSetFeedPreference: (preference: EItemFeedPreference) => void;
    widgetHeight: number;
    onBookmark: (id: TPodcastItem) => MaybeAsync<void>;
    isAuthenticated: boolean;
    selectedPodcast: TPodcastItem | null;
    setSelectedPodcast: React.Dispatch<
        React.SetStateAction<TPodcastItem | null>
    >;
    onSelectChannel: (channel: TPodcastChannel) => void;
    onRemoveChannel: (channel: TPodcastChannel) => void;
    preferredChannelIds: number[] | undefined;
    setPreferredChannelIds: (channels: TPodcastChannel[]) => void;
    mobileViewWidgetHeight?: number;
}

const SWITCH_HEIGHT = 38;
const AUDIO_PLAYER_HEIGHT = 52;
const CHANNELS_LIST_HEIGHT = 157;
const CHANNELS_LIST_HEIGHT_COLLAPSED = 36;

const translateNavItems = () => [
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

const PodcastModule: FC<IPodcastModule> = ({
    items,
    isLoadingItems,
    channels,
    isLoadingChannels,
    handlePaginate,
    feedPreference,
    onSetFeedPreference,
    widgetHeight,
    onBookmark,
    isAuthenticated,
    selectedPodcast,
    setSelectedPodcast,
    onSelectChannel,
    onRemoveChannel,
    preferredChannelIds,
    setPreferredChannelIds,
    mobileViewWidgetHeight,
}) => {
    const podcastNavItems = translateNavItems();

    const {
        squareRef,
        headerRef,
        setHeaderRef,
        handleClickScroll,
        hideLeftPan,
        hideRightPan,
    } = useHeaderScroll();
    const {
        togglePlayPause,
        ready: isAudioReady,
        loading: isAudioLoading,
        playing: isAudioPlaying,
    } = useAudioPlayer({
        src: selectedPodcast?.fileUrl,
        format: "mp3",
        autoplay: true,
        html5: true,
    });

    const [showChannels, setShowChannels] = useState(true);
    const [showAllChannels, setShowAllChannels] = useState(false);

    const handleSelectPodcast = (podcast: TPodcastItem) => {
        setSelectedPodcast(podcast);
        togglePlayPause();
    };
    const channelsHeight = useMemo(
        () =>
            showChannels
                ? CHANNELS_LIST_HEIGHT
                : CHANNELS_LIST_HEIGHT_COLLAPSED,
        [showChannels]
    );

    const audioPlayerHeight = useMemo(
        () => (selectedPodcast === null ? 0 : AUDIO_PLAYER_HEIGHT),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedPodcast === null]
    );

    const NavItemPreference =
        podcastNavItems.find((item) => item.value === feedPreference) ||
        podcastNavItems[0];

    const onTabOptionChange = (value: string) => {
        const optionItem = podcastNavItems.find((item) => item.value === value);
        if (optionItem === undefined) {
            Logger.debug("PodcastModule::Nav option item not found");
            return;
        }
        onSetFeedPreference(optionItem?.value);
    };
    return (
        <div className="block relative">
            <div ref={squareRef}>
                <div
                    className={twMerge(
                        "flex items-center mx-2",
                        (isLoadingItems || !items) && "bg-transparent"
                    )}
                    style={{ height: SWITCH_HEIGHT }}
                >
                    <TabsBar
                        options={podcastNavItems}
                        onChange={onTabOptionChange}
                        selectedOption={NavItemPreference}
                    />
                </div>

                <PodcastChannelsList
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
                    className="transition-all duration-300 relative z-[1] bg-background"
                    style={{
                        height:
                            (mobileViewWidgetHeight ?? widgetHeight) -
                            SWITCH_HEIGHT -
                            channelsHeight -
                            audioPlayerHeight,
                    }}
                >
                    <PodcastItemList
                        podcasts={items}
                        handlePaginate={handlePaginate}
                        handlePlay={handleSelectPodcast}
                        selectedPodcast={selectedPodcast}
                        onBookmark={onBookmark}
                        isAuthenticated={isAuthenticated}
                        isPlaying={isAudioPlaying}
                    />
                </div>
                <div
                    className="transition-all duration-300"
                    style={{
                        height: audioPlayerHeight,
                    }}
                />
                <div
                    className="absolute bottom-0 transition-all duration-300 overflow-hidden w-full rounded-tl-md rounded-bl-md bg-backgroundVariant200"
                    style={{
                        height: audioPlayerHeight,
                    }}
                >
                    <AudioPlayer
                        podcast={selectedPodcast}
                        isAudioReady={isAudioReady}
                        isAudioLoading={isAudioLoading}
                        isAudioPlaying={isAudioPlaying}
                        togglePlayPause={togglePlayPause}
                        closePlayer={() => {
                            setSelectedPodcast(null);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
export default PodcastModule;
