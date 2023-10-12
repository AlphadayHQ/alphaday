import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { ChannelSkeleton, IconButton, Input } from "@alphaday/ui-kit";
import { TPodcastChannel } from "src/api/types";
import { ReactComponent as ChevronSVG } from "src/assets/icons/chevron-down2.svg";

import {
    StyledChannel,
    StyledChannels,
    StyledHeader,
    StyledTray,
} from "./PodcastModule.style";

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
        <StyledChannels
            $show={showChannels}
            $showAll={showAllChannels}
            $height={channelsHeight}
        >
            <div className="header">
                <div
                    role="button"
                    tabIndex={-1}
                    onClick={() => {
                        if (!showAllChannels) {
                            setShowChannels((prev) => !prev);
                        }
                    }}
                    className="channels"
                >
                    <span className="title">
                        {showAllChannels ? "Selected Channels" : "Channels"}
                    </span>
                    <div className="svg-wrap">
                        {!showAllChannels && <ChevronSVG className="chevron" />}
                    </div>
                </div>
                <div
                    role="button"
                    tabIndex={-1}
                    onClick={onClickMore}
                    className="more"
                >
                    <span
                        className={`title ${showAllChannels ? "showAll" : ""}`}
                    >
                        {showAllChannels ? "less" : "more"}
                    </span>
                </div>
            </div>

            <StyledHeader
                ref={(ref: HTMLDivElement | null) => ref && setHeaderRef(ref)}
                $showChannels={showChannels}
            >
                <div className="spacer" />
                {!hideLeftPan && (
                    <span className="pan">
                        <IconButton
                            title="Pan Coins Left"
                            variant="leftArrow"
                            onClick={() => handleClickScroll()}
                        />
                    </span>
                )}
                {selectedChannels?.length && !isLoadingChannels ? (
                    selectedChannels.map((channel) => (
                        <span key={channel.id} className="wrap">
                            <StyledChannel
                                onClick={() => onSelectChannel(channel)}
                            >
                                <img
                                    loading="lazy"
                                    className="img"
                                    src={channel.icon}
                                    alt=""
                                />
                                <span className="label">{channel.name}</span>
                            </StyledChannel>
                        </span>
                    ))
                ) : (
                    <>
                        {[...Array(7).keys()].map((item) => (
                            <ChannelSkeleton key={item} />
                        ))}
                    </>
                )}
                <div className="spacer" />
                {!hideRightPan && (
                    <span className="pan right">
                        <IconButton
                            title="Pan Coins Right"
                            variant="rightArrow"
                            onClick={() => handleClickScroll(true)}
                        />
                    </span>
                )}
            </StyledHeader>
            {!isLoadingChannels && (
                <StyledTray>
                    <p className="title">All Channels</p>
                    <div className="search">
                        <Input
                            value={searchState}
                            onChange={(e) => setSearchState(e.target.value)}
                            placeholder="Filter channels..."
                            id="search-podcast-channels"
                            name="search podcast channels"
                        />
                    </div>
                    <div className="channels">
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
                                    <span key={channel.id} className="wrap">
                                        <StyledChannel onClick={onClick}>
                                            <div
                                                className={`overlay ${
                                                    isSelectedChannel
                                                        ? "visible"
                                                        : ""
                                                }`}
                                            />

                                            <img
                                                loading="lazy"
                                                className="img"
                                                src={channel.icon}
                                                alt=""
                                            />
                                            <span className="label">
                                                {channel.name}
                                            </span>
                                        </StyledChannel>
                                    </span>
                                );
                            })}
                    </div>
                </StyledTray>
            )}
        </StyledChannels>
    );
};

export default PodcastChannelsList;
