import { FC, useEffect, useRef, useState } from "react";
import moment from "moment-with-locales-es6";
import { AudioPlayerProvider } from "react-use-audio-player";
import { useView, usePagination, useWidgetHeight } from "src/api/hooks";
import { TBaseTag } from "src/api/services";
import {
    useBookmarkPodcastItemMutation,
    useGetPodcastChannelsListQuery,
    useGetPodcastListQuery,
    useOpenPodcastItemMutation,
} from "src/api/services/podcast/podcastEndpoints";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import { selectIsAuthenticated } from "src/api/store/slices/user";
import {
    selectPodcastFeedPreference,
    selectPodcastPreferredChannelIds,
    setPodcastFeedPreference,
    setPodcastPreferredChannelIds,
} from "src/api/store/slices/widgets";
import {
    EItemFeedPreference,
    ETag,
    TPodcastChannel,
    TPodcastItem,
} from "src/api/types";
import { filteringListToStr } from "src/api/utils/filterUtils";
import {
    buildUniqueItemList,
    itemListsAreEqual,
} from "src/api/utils/itemUtils";
import { Logger } from "src/api/utils/logging";
import { toast } from "src/api/utils/toastUtils";
import PodcastModule from "src/components/podcast/PodcastModule";
import CONFIG from "src/config";
import { EWidgetSettingsRegistry } from "src/constants";
import { IModuleContainer } from "src/types";

const { DEFAULT_FEED_PREFERENCE, MAX_PAGE_NUMBER } = CONFIG.WIDGETS.PODCAST;

const PodcastContainer: FC<IModuleContainer> = ({
    moduleData,
    mobileViewWidgetHeight,
}) => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const [openPodcastItemMut] = useOpenPodcastItemMutation();
    const [bookmarkPodcastItemMut] = useBookmarkPodcastItemMutation();

    const { includeTagInViewWidget, removeTagFromViewWidget } = useView();

    const tagsRef = useRef<TBaseTag[]>();

    const [items, setItems] = useState<TPodcastItem[] | undefined>();

    const [currentPage, setCurrentPage] = useState<number | undefined>(
        undefined
    );

    const widgetHeight = useWidgetHeight(moduleData);
    const [selectedPodcast, setSelectedPodcast] = useState<TPodcastItem | null>(
        null
    );

    const selectedPodcastRef = useRef<TPodcastItem | null>(null);

    const feedPreference =
        useAppSelector(selectPodcastFeedPreference(moduleData.hash)) ??
        DEFAULT_FEED_PREFERENCE;

    const preferredChannelIds = useAppSelector(
        selectPodcastPreferredChannelIds(moduleData.hash)
    );

    const setFeedPreference = (preference: EItemFeedPreference) => {
        dispatch(
            setPodcastFeedPreference({
                widgetHash: moduleData.hash,
                preference,
            })
        );
    };

    const setPreferredChannelIds = (channels: TPodcastChannel[]) => {
        const preference = channels.map((c: TPodcastChannel) => c.id);
        dispatch(
            setPodcastPreferredChannelIds({
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
        currentData: podcastData,
        isLoading,
        isSuccess,
    } = useGetPodcastListQuery(
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
        useGetPodcastChannelsListQuery();

    const onBookmarkPodcastItem = (item: TPodcastItem) => {
        bookmarkPodcastItemMut({ item })
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
                            "PodcastContainer::onBookmarkPodcastItem: prevItems is undefined, this should not happen for podcast",
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
                                "PodcastContainer::onBookmarkPodcastItem: podcast item is not in prevItems, this should not happen for podcast",
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
        if (podcastData?.results !== undefined) {
            setItems((prevItems) => {
                if (prevItems) {
                    return buildUniqueItemList([
                        ...prevItems,
                        ...podcastData.results,
                    ]).sort(
                        (a, b) =>
                            moment(b.publishedAt).valueOf() -
                            moment(a.publishedAt).valueOf()
                    );
                }
                return podcastData.results;
            });
        }
    }, [podcastData?.results]);

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
        podcastData?.links,
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

    const onSelectChannel = (channel: TPodcastChannel) => {
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
    const onRemoveChannel = (channel: TPodcastChannel) => {
        if (!channel.tags?.length) return;
        channel.tags.forEach((channelTag) => {
            const tagExists = tags?.find((t) => t.id === channelTag.id);
            if (tagExists && tagExists.tag_type === ETag.Local) {
                removeTagFromViewWidget(moduleData.hash, channelTag.id);
            }
        });
    };

    useEffect(() => {
        if (selectedPodcast?.id === selectedPodcastRef.current?.id) return;
        selectedPodcastRef.current = selectedPodcast;
        if (selectedPodcast?.id) {
            openPodcastItemMut({ id: selectedPodcast.id }).catch((err) =>
                Logger.error(
                    "PodcastContainer::openPodcastItemMut: Failed to send click event",
                    err
                )
            );
        }
    }, [openPodcastItemMut, selectedPodcast]);

    return (
        <AudioPlayerProvider>
            <PodcastModule
                isLoadingItems={isLoading}
                isLoadingChannels={isLoadingChannels}
                // we default items to podcastData?.results to avoid a flickering/infinite loading
                items={items || podcastData?.results}
                channels={channelsData}
                onSelectChannel={onSelectChannel}
                onRemoveChannel={onRemoveChannel}
                handlePaginate={handleNextPage}
                feedPreference={feedPreference}
                onSetFeedPreference={setFeedPreference}
                widgetHeight={widgetHeight}
                onBookmark={onBookmarkPodcastItem}
                isAuthenticated={isAuthenticated}
                selectedPodcast={selectedPodcast}
                setSelectedPodcast={setSelectedPodcast}
                preferredChannelIds={preferredChannelIds}
                setPreferredChannelIds={setPreferredChannelIds}
                mobileViewWidgetHeight={mobileViewWidgetHeight}
            />
        </AudioPlayerProvider>
    );
};

export default PodcastContainer;
