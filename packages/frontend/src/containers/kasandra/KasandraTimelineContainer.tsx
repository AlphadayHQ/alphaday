import { FC, useState, useEffect, useRef, useCallback } from "react";
import { usePagination, useWidgetHeight } from "src/api/hooks";
import {
    TBaseTag,
    useBookmarkNewsItemMutation,
    useGetNewsListQuery,
    useOpenNewsItemMutation,
} from "src/api/services";
import {
    setKasandraFeedPreference,
    selectKasandraFeedPreference,
} from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import * as userStore from "src/api/store/slices/user";
import { TNewsItem, EItemFeedPreference } from "src/api/types";
import * as filterUtils from "src/api/utils/filterUtils";
import {
    buildUniqueItemList,
    itemListsAreEqual,
} from "src/api/utils/itemUtils";
import { Logger } from "src/api/utils/logging";
import { toast } from "src/api/utils/toastUtils";
import NewsModule from "src/components/news/NewsModule";
import CONFIG from "src/config";
import { EWidgetSettingsRegistry } from "src/constants";
import globalMessages from "src/globalMessages";
import { IModuleContainer } from "src/types";

const widgetConfig = CONFIG.WIDGETS.KASANDRA_PREDICTIONS;
const ItemsContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(userStore.selectIsAuthenticated);

    const widgetHeight = useWidgetHeight(moduleData);

    const [currentPage, setCurrentPage] = useState<number | undefined>(
        undefined
    );

    const defaultFeed = widgetConfig.DEFAULT_FEED_PREFERENCE;

    const feedPreference =
        useAppSelector(selectKasandraFeedPreference(moduleData.hash)) ??
        defaultFeed;

    const setFeedPreference = useCallback(
        (preference: EItemFeedPreference) => {
            dispatch(
                setKasandraFeedPreference({
                    widgetHash: moduleData.hash,
                    preference,
                })
            );
        },
        [dispatch, moduleData.hash]
    );

    const [items, setItems] = useState<TNewsItem[] | undefined>();

    const tagsSettings = moduleData.settings.filter(
        (s) =>
            s.widget_setting.setting.slug ===
            EWidgetSettingsRegistry.IncludedTags
    );

    const tagsRef = useRef<TBaseTag[]>();

    const tags =
        tagsSettings[0] !== undefined ? tagsSettings[0].tags : undefined;

    const pollingInterval =
        (moduleData.widget.refresh_interval || widgetConfig.POLLING_INTERVAL) *
        1000;

    const queryParameters = {
        page: currentPage,
        tags: tags ? filterUtils.filteringListToStr(tags) : undefined,
        feedPreference,
    };

    // TODO(xavier-charles): refactor to use the new api
    const {
        currentData: itemsData,
        isLoading,
        isSuccess,
    } = useGetNewsListQuery(queryParameters, {
        pollingInterval,
    });
    const [openItemMut] = useOpenNewsItemMutation();
    const [bookmarkItemMut] = useBookmarkNewsItemMutation();

    const onOpenItem = async (id: number) => {
        if (openItemMut !== undefined) {
            await openItemMut({
                id,
            });
        }
    };

    const onBookmarkItem = useCallback(
        (item: TNewsItem) => {
            if (bookmarkItemMut !== undefined) {
                if (!isAuthenticated) {
                    toast(
                        globalMessages.callToAction.signUpToBookmark("items")
                    );
                    return;
                }
                bookmarkItemMut({ item })
                    .unwrap()
                    .then(() => {
                        toast("Your preference has been saved successfully.");
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
                                    "ItemsContainer::onBookmarkNewsItem: prevItems is undefined, this should not happen for news",
                                    item.id
                                );
                                return prevItems;
                            }
                            /**
                             * If the current feedPreference is not bookmarked items, then we need to toggle its bookmark status
                             * else we need to remove it from the list
                             */
                            if (
                                feedPreference !== EItemFeedPreference.Bookmark
                            ) {
                                const bookmarkPos = prevItems.indexOf(item);
                                if (bookmarkPos === -1) {
                                    /**
                                     * Bookmarked item should be in the list of items, but we need to handle this case
                                     */
                                    Logger.error(
                                        "ItemsContainer::onBookmarkNewsItem: news item is not in prevItems, this should not happen for news",
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
                        toast(
                            "We could not save your preference. Please try again"
                        )
                    );
            }
        },
        [bookmarkItemMut, feedPreference, isAuthenticated]
    );

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

    useEffect(() => {
        const data = itemsData?.results;
        if (data !== undefined) {
            setItems((prevItems) => {
                if (prevItems) {
                    const newItems = buildUniqueItemList([
                        ...prevItems,
                        ...data,
                    ]);

                    return newItems;
                }
                return data;
            });
        }
    }, [itemsData?.results]);

    const { nextPage, handleNextPage } = usePagination(
        itemsData?.links,
        widgetConfig.MAX_PAGE_NUMBER,
        isSuccess
    );

    // set current page 350ms after next page is set.
    // RTK should cache requests, so we don't need to be too careful about rerenders.
    useEffect(() => {
        if (nextPage === undefined) {
            return () => null;
        }
        const timeout = setTimeout(() => {
            setCurrentPage(nextPage);
        }, 350);
        return () => {
            clearTimeout(timeout);
        };
    }, [nextPage]);

    if (feedPreference !== undefined) {
        return (
            <NewsModule
                isLoadingItems={isLoading}
                // we default items to newsData?.results to avoid a flickering/infinite loading
                items={(items || itemsData?.results) as TNewsItem[] | undefined}
                handlePaginate={handleNextPage}
                feedPreference={feedPreference}
                onSetFeedPreference={setFeedPreference}
                widgetHeight={widgetHeight}
                onClick={onOpenItem}
                onBookmark={onBookmarkItem}
                isAuthenticated={isAuthenticated}
            />
        );
    }
    return null;
};

export default ItemsContainer;
