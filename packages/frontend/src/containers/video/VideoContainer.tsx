import { FC, useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import { useView, usePagination, useWidgetHeight } from "src/api/hooks";
import { TBaseTag } from "src/api/services";
import {
    useBookmarkVideoItemMutation,
    useGetVideoChannelsListQuery,
    useGetVideoListQuery,
    useOpenVideoItemMutation,
} from "src/api/services/video/videoEndpoints";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import { selectIsAuthenticated } from "src/api/store/slices/user";
import {
    selectVideoPreferredChannelIds,
    selectVideoFeedPreference,
    setVideoPreferredChannelIds,
    setVideoFeedPreference,
} from "src/api/store/slices/widgets";
import {
    EItemFeedPreference,
    ETag,
    TVideoChannel,
    TVideoItem,
} from "src/api/types";
import { filteringListToStr } from "src/api/utils/filterUtils";
import {
    buildUniqueItemList,
    itemListsAreEqual,
} from "src/api/utils/itemUtils";
import { Logger } from "src/api/utils/logging";
import { toast } from "src/api/utils/toastUtils";
import VideoModule from "src/components/video/VideoModule";
import CONFIG from "src/config";
import { EWidgetSettingsRegistry } from "src/constants";
import globalMessages from "src/globalMessages";
import { IModuleContainer } from "src/types";

const { DEFAULT_FEED_PREFERENCE, MAX_PAGE_NUMBER } = CONFIG.WIDGETS.VIDEO;

const VideoContainer: FC<IModuleContainer> = ({ moduleData, showFullSize }) => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const [openVideoItemMut] = useOpenVideoItemMutation();
    const [bookmarkVideoItemMut] = useBookmarkVideoItemMutation();

    const { includeTagInViewWidget, removeTagFromViewWidget } = useView();

    const tagsRef = useRef<TBaseTag[]>();

    const [items, setItems] = useState<TVideoItem[] | undefined>();

    const [currentPage, setCurrentPage] = useState<number | undefined>(
        undefined
    );

    const widgetHeight = useWidgetHeight(moduleData);

    const feedPreference =
        useAppSelector(selectVideoFeedPreference(moduleData.hash)) ??
        DEFAULT_FEED_PREFERENCE;
    const preferredChannelIds = useAppSelector(
        selectVideoPreferredChannelIds(moduleData.hash)
    );

    const setFeedPreference = (preference: EItemFeedPreference) => {
        dispatch(
            setVideoFeedPreference({
                widgetHash: moduleData.hash,
                preference,
            })
        );
    };
    const setPreferredChannelIds = (channels: TVideoChannel[]) => {
        const preference = channels.map((c: TVideoChannel) => c.id);
        dispatch(
            setVideoPreferredChannelIds({
                widgetHash: moduleData.hash,
                preference,
            })
        );
    };

    const pollingInterval =
        (moduleData.widget.refresh_interval ||
            CONFIG.WIDGETS.PODCAST.POLLING_INTERVAL) * 1000;

    const tags = moduleData.settings.find(
        (s) =>
            s.widget_setting.setting.slug ===
            EWidgetSettingsRegistry.IncludedTags
    )?.tags;

    const {
        currentData: videoData,
        isLoading,
        isSuccess,
    } = useGetVideoListQuery(
        {
            page: currentPage,
            tags: tags ? filteringListToStr(tags) : undefined,
            feedPreference,
            limit: MAX_PAGE_NUMBER,
        },
        {
            pollingInterval,
        }
    );
    const { currentData: channelsData, isLoading: isLoadingChannels } =
        useGetVideoChannelsListQuery();

    const onOpenVideoItem = async (id: number) => {
        await openVideoItemMut({ id });
    };

    const onBookmarkVideoItem = (item: TVideoItem) => {
        if (!isAuthenticated) {
            toast(globalMessages.callToAction.signUpToBookmark("videos"));
            return;
        }
        bookmarkVideoItemMut({ item })
            .unwrap()
            .then(() => toast("Your preference has been saved successfully."))
            .then(() => {
                /**
                 * When a user bookmarks an item, we need to update the list of items
                 * to reflect the change. We do this by updating the list of items
                 */
                setItems((prevItems) => {
                    if (!prevItems) {
                        /**
                         * Prev items should never be undefined, but we need to handle this case
                         */
                        Logger.error(
                            "VideoContainer::onBookmarkVideoItem: prevItems is undefined, this should not happen for video",
                            item.id
                        );
                        return prevItems;
                    }
                    /**
                     * If the current feedPreference is not bookmarked items, then we need to toggle its bookmark status
                     * else we need to remove it from the list
                     */
                    if (feedPreference !== EItemFeedPreference.Bookmark) {
                        const bookmarkPos = prevItems.indexOf(item);
                        if (bookmarkPos === -1) {
                            /**
                             * Bookmarked item should be in the list of items, but we need to handle this case
                             */
                            Logger.error(
                                "VideoContainer::onBookmarkVideoItem: video item is not in prevItems, this should not happen for video",
                                item.id
                            );
                            return prevItems;
                        }
                        const newItems = [...prevItems];
                        newItems[bookmarkPos] = {
                            ...item,
                            bookmarked: !item.bookmarked,
                        };
                        return newItems;
                    }
                    // removing from the list ensures bookmarked items only are shown in the list
                    return prevItems.filter((i) => i.id !== item.id);
                });
            })
            .catch(() =>
                toast("We could not save your preference. Please try again")
            );
    };

    useEffect(() => {
        if (videoData?.results !== undefined) {
            setItems((prevItems) => {
                if (prevItems) {
                    return buildUniqueItemList([
                        ...prevItems,
                        ...videoData.results,
                    ]).sort(
                        (a, b) =>
                            moment(b.publishedAt).valueOf() -
                            moment(a.publishedAt).valueOf()
                    );
                }
                return videoData.results;
            });
        }
    }, [videoData?.results]);

    // reset results when tags preferences changed
    useEffect(() => {
        /**
         * To ensure that the items are not duplicated, we need to check if the
         * new tags are different from the previous ones. If they are, we need to
         * reset the items and the current page.
         *
         * We use a ref to store the previous tags, because we don't want to
         * trigger a re-render when the tags change. And assigning a default
         * value when tagsRef.current is undefined ensures that the first
         * comparison will always be true.
         */
        if (tags && !itemListsAreEqual(tagsRef.current || [], tags)) {
            setItems(undefined);
            setCurrentPage(undefined);
        }
        tagsRef.current = tags;
    }, [tags]);

    useEffect(() => {
        if (
            !isAuthenticated &&
            feedPreference === EItemFeedPreference.Bookmark
        ) {
            setFeedPreference(EItemFeedPreference.Last);
        }
        // we do not want to track `setFeedPreference`
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [feedPreference, isAuthenticated]);

    // reset results when feed preference changes
    useEffect(() => {
        setItems(undefined);
        setCurrentPage(undefined);
    }, [feedPreference]);

    const { nextPage, handleNextPage } = usePagination(
        videoData?.links,
        MAX_PAGE_NUMBER,
        isSuccess
    );

    // set current page 350ms after next page is set.
    // RTK should cache requests, so we don't need to be too careful about rerenders.
    useEffect(() => {
        if (nextPage === undefined) return () => null;
        const timeout = setTimeout(() => {
            setCurrentPage(nextPage);
        }, 350);
        return () => {
            clearTimeout(timeout);
        };
    }, [nextPage]);

    const onSelectChannel = (channel: TVideoChannel) => {
        if (!channel.tags?.length) return;

        channel.tags.forEach((channelTag) => {
            const tagExists = tags?.find((t) => t.id === channelTag.id);
            if (tagExists && tagExists.tag_type === ETag.Local) return;
            includeTagInViewWidget?.(moduleData.hash, {
                id: channelTag.id,
                name: channelTag.name,
                slug: channelTag.slug,
                tagType: ETag.Local,
            });
        });
    };
    const onRemoveChannel = (channel: TVideoChannel) => {
        if (!channel.tags?.length) return;
        channel.tags.forEach((channelTag) => {
            const tagExists = tags?.find((t) => t.id === channelTag.id);
            if (tagExists && tagExists.tag_type === ETag.Local) {
                removeTagFromViewWidget(moduleData.hash, channelTag.id);
            }
        });
    };

    const uniqueItems = useMemo(() => {
        if (items) return buildUniqueItemList(items);
        if (videoData?.results) return buildUniqueItemList(videoData.results);
        return undefined;
    }, [items, videoData?.results]);

    return (
        <VideoModule
            isLoadingItems={isLoading}
            isLoadingChannels={isLoadingChannels}
            items={uniqueItems}
            channels={channelsData}
            onSelectChannel={onSelectChannel}
            onRemoveChannel={onRemoveChannel}
            handlePaginate={handleNextPage}
            feedPreference={feedPreference}
            onSetFeedPreference={setFeedPreference}
            widgetHeight={widgetHeight}
            onClick={onOpenVideoItem}
            onBookmark={onBookmarkVideoItem}
            isAuthenticated={isAuthenticated}
            isFullSize={showFullSize}
            preferredChannelIds={preferredChannelIds}
            setPreferredChannelIds={setPreferredChannelIds}
        />
    );
};

export default VideoContainer;
