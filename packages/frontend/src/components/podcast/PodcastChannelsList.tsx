import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { ChannelSkeleton, IconButton, Input, twMerge } from "@alphaday/ui-kit";
import { TPodcastChannel } from "src/api/types";
import { ReactComponent as ChevronSVG } from "src/assets/icons/chevron-down2.svg";

interface IPodcastChannelsList {
    channels: TPodcastChannel[] | undefined;
    isLoadingChannels: boolean;
    headerRef: HTMLDivElement | null;
    setHeaderRef: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
    handleClickScroll: (scrollRight?: boolean) => void;
    hideLeftPan: boolean;
    hideRightPan: boolean;
    showChannels: boolean;
    setShowChannels: React.Dispatch<React.SetStateAction<boolean>>;
    channelsHeight: number;
    onSelectChannel: (channel: TPodcastChannel) => void;
    onRemoveChannel: (channel: TPodcastChannel) => void;
    showAllChannels: boolean;
    setShowAllChannels: React.Dispatch<React.SetStateAction<boolean>>;
    preferredChannelIds: number[] | undefined;
    setPreferredChannelIds: (channels: TPodcastChannel[]) => void;
}
const PodcastChannelsList: FC<IPodcastChannelsList> = ({
    channels,
    isLoadingChannels,
    headerRef,
    setHeaderRef,
    handleClickScroll,
    hideLeftPan,
    hideRightPan,
    showChannels,
    setShowChannels,
    showAllChannels,
    setShowAllChannels,
    channelsHeight,
    onSelectChannel,
    onRemoveChannel,
    preferredChannelIds,
    setPreferredChannelIds,
}) => {
    const [searchState, setSearchState] = useState<string>("");
    const preferredChannelIdsCountRef = useRef<number | undefined>(
        preferredChannelIds?.length
    );

    const onClickMore = () => {
        setSearchState("");
        setShowAllChannels((prev) => !prev);
    };

    const sortedChannels = useMemo(() => {
        if (!channels?.length) return [];
        return [...channels].sort((a, b) => a.name.localeCompare(b.name));
    }, [channels]);

    const filteredChannels = useMemo(() => {
        return [...sortedChannels].filter((channel) =>
            channel.name.toLowerCase().includes(searchState.toLowerCase())
        );
    }, [searchState, sortedChannels]);

    const selectedChannels = useMemo(() => {
        if (channels) {
            if (preferredChannelIds) {
                return channels
                    .filter((channel) =>
                        preferredChannelIds.includes(channel.id)
                    ) // Sort the channels in the order of the preferredChannelIds
                    .sort(
                        (a, b) =>
                            preferredChannelIds.indexOf(a.id) -
                            preferredChannelIds.indexOf(b.id)
                    );
            }
            return channels.slice(0, 8);
        }
    }, [channels, preferredChannelIds]);

    // This effect keeps the channels scrolled to the right when the user adds a
    // channel to their preferred channels. It needs to happen with a after the channel
    // has been added to the preferred channels list in the DOM. It needs to trigger a re-render
    useEffect(() => {
        if (
            headerRef !== null &&
            preferredChannelIdsCountRef.current !== preferredChannelIds?.length
        ) {
            // eslint-disable-next-line no-param-reassign
            headerRef.scrollLeft = headerRef.scrollWidth;
            preferredChannelIdsCountRef.current = preferredChannelIds?.length;
        }
    }, [headerRef, preferredChannelIds]);

    return (
        <div
            className="w-full border-b border-solid border-btnRingVariant500 transition-all duration-[400] relative cursor-pointer"
            // $show={showChannels}
            // $showAll={showAllChannels}
            // $height={channelsHeight}
            style={{
                height: showAllChannels ? "600px" : `${channelsHeight}px`,
            }}
        >
            <div className="flex w-full justify-between pt-[10px] px-[15px] pb-3 cursor-pointer">
                <div
                    role="button"
                    tabIndex={-1}
                    onClick={() => {
                        if (!showAllChannels) {
                            setShowChannels((prev) => !prev);
                        }
                    }}
                    className="min-w-max flex"
                >
                    <span className="fontGroup-highlight uppercase text-primary m-0 transition-all duration-[400]">
                        {showAllChannels ? "Selected Channels" : "Channels"}
                    </span>
                    <div className="flex items-center h-[17.5px]">
                        {!showAllChannels && (
                            <ChevronSVG
                                className={twMerge(
                                    "ml-1 w-[14px] h-[14.5px] stroke-primary duration-[400] transition-transform",
                                    showAllChannels ? "rotate-90" : "rotate-0"
                                )}
                            />
                        )}
                    </div>
                </div>
                <div
                    role="button"
                    tabIndex={-1}
                    onClick={onClickMore}
                    className="capitalize"
                >
                    <span
                        className={`fontGroup-highlight uppercase text-primary m-0 transition-all duration-[400] ${
                            showAllChannels ? "text-btnRingVariant100" : ""
                        }`}
                    >
                        {showAllChannels ? "less" : "more"}
                    </span>
                </div>
            </div>

            <div
                ref={(ref: HTMLDivElement | null) => ref && setHeaderRef(ref)}
                className="flex overflow-y-hidden overflow-x-scroll pb-[13px]"
            >
                <div className="spacer" />
                {!hideLeftPan && (
                    <span
                        className={twMerge(
                            "absolute self-center top-[70px] left-[3px] z-[1]",
                            showAllChannels ? "block" : "none"
                        )}
                    >
                        <IconButton
                            title="Pan Coins Left"
                            variant="leftArrow"
                            onClick={() => handleClickScroll()}
                        />
                    </span>
                )}
                {selectedChannels?.length && !isLoadingChannels ? (
                    selectedChannels.map((channel) => (
                        <span key={channel.id} className="mr-1.5">
                            <div
                                role="button"
                                tabIndex={-1}
                                className="flex w-[60px] flex-col"
                                onClick={() => onSelectChannel(channel)}
                            >
                                <img
                                    loading="lazy"
                                    className="w-[60px] h-[60px] z-1"
                                    src={channel.icon}
                                    alt=""
                                />
                                <span className="relative text-ellipsis overflow-hidden fontGroup-supportBold [display:_-webkit-box] [-webkit-line-clamp:_3] [-webkit-box-orient:_vertical]">
                                    {channel.name}
                                </span>
                            </div>
                        </span>
                    ))
                ) : (
                    <>
                        {[...Array(7).keys()].map((item) => (
                            <ChannelSkeleton key={item} />
                        ))}
                    </>
                )}
                <div className="min-w-[15px] h-5 self-center" />
                {!hideRightPan && (
                    <span
                        className={twMerge(
                            "absolute self-center top-[70px] z-[2] left-auto right-[3px]",
                            showAllChannels ? "block" : "none"
                        )}
                    >
                        <IconButton
                            title="Pan Coins Right"
                            variant="rightArrow"
                            onClick={() => handleClickScroll(true)}
                        />
                    </span>
                )}
            </div>
            {!isLoadingChannels && (
                <div className="h-[436px] p-[15px] m-0 overflow-y-scroll overflow-x-hidden border-t border-solid border-btnRingVariant500">
                    <p className="fontGroup-highlight uppercase text-primary m-0 mb-[10px]">
                        All Channels
                    </p>
                    <div className="mb-5 w-full">
                        <Input
                            value={searchState}
                            onChange={(e) => setSearchState(e.target.value)}
                            placeholder="Filter channels..."
                            id="search-podcast-channels"
                            name="search podcast channels"
                        />
                    </div>
                    <div className="w-full flex flex-wrap justify-between">
                        {showAllChannels &&
                            filteredChannels.map((channel) => {
                                const isSelectedChannel =
                                    selectedChannels?.some(
                                        (c) => c.id === channel.id
                                    );

                                // Add/remove to selected channels
                                const onClick = () => {
                                    if (isSelectedChannel) {
                                        setPreferredChannelIds(
                                            selectedChannels?.filter(
                                                (c) => c.id !== channel.id
                                            ) || []
                                        );
                                        onRemoveChannel(channel);
                                    } else {
                                        setPreferredChannelIds([
                                            ...(selectedChannels || []),
                                            channel,
                                        ]);
                                        onSelectChannel(channel);
                                    }
                                };
                                return (
                                    <span
                                        key={channel.id}
                                        className="p-[10px] relative [&:last-of-type]:mr-auto"
                                    >
                                        <div
                                            role="button"
                                            tabIndex={-1}
                                            className="flex w-[60px] flex-col"
                                            onClick={onClick}
                                        >
                                            <div
                                                className={`absolute inset-0 m-auto w-[95%] h-[93%] rounded-xl opacity-0 bg-primaryVariant300 transition-opacity duration-[0.05s] ease-in ${
                                                    isSelectedChannel
                                                        ? "opacity-1"
                                                        : ""
                                                }`}
                                            />

                                            <img
                                                loading="lazy"
                                                className="w-[60px] h-[60px] z-1"
                                                src={channel.icon}
                                                alt=""
                                            />
                                            <span className="relative text-ellipsis overflow-hidden fontGroup-supportBold [display:_-webkit-box] [-webkit-line-clamp:_3] [-webkit-box-orient:_vertical]">
                                                {channel.name}
                                            </span>
                                        </div>
                                    </span>
                                );
                            })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PodcastChannelsList;
