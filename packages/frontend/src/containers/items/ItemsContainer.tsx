import { FC, useState, useEffect, useRef, useCallback } from "react";
import moment from "moment-with-locales-es6";
import { usePagination, useWidgetHeight } from "src/api/hooks";
import {
    TBaseTag,
    useBookmarkNewsItemMutation,
    useGetNewsListQuery,
    useOpenNewsItemMutation,
    useBookmarkBlogItemMutation,
    useGetBlogListQuery,
    useOpenBlogItemMutation,
    useGetDaoItemsQuery,
    useGetForumItemsQuery,
    useGetRedditItemsQuery,
    useGetDiscordItemsQuery,
} from "src/api/services";
import {
    setNewsFeedPreference,
    selectNewsFeedPreference,
    setBlogFeedPreference,
    selectBlogFeedPreference,
} from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import * as userStore from "src/api/store/slices/user";
import {
    TNewsItem,
    EItemFeedPreference,
    TBlogItem,
    TDaoItem,
    TForumItem,
    TRedditItem,
    TDiscordItem,
} from "src/api/types";
import * as filterUtils from "src/api/utils/filterUtils";
import {
    buildUniqueItemList,
    itemListsAreEqual,
} from "src/api/utils/itemUtils";
import { Logger } from "src/api/utils/logging";
import { toast } from "src/api/utils/toastUtils";
import { getWidgetName } from "src/api/utils/viewUtils";
import DaoModule from "src/components/daos/DaoModule";
import DiscordModule from "src/components/discord/DiscordModule";
import NewsModule from "src/components/news/NewsModule";
import CONFIG from "src/config";
import { EWidgetSettingsRegistry, ETemplateNameRegistry } from "src/constants";
import globalMessages from "src/globalMessages";
import { IModuleContainer } from "src/types";

type TItemGroup =
    | ETemplateNameRegistry.Blog
    | ETemplateNameRegistry.News
    | ETemplateNameRegistry.Forum
    | ETemplateNameRegistry.Dao
    | ETemplateNameRegistry.Reddit
    | ETemplateNameRegistry.Discord;

type TItem =
    | TNewsItem
    | TBlogItem
    | TDaoItem
    | TForumItem
    | TRedditItem
    | TDiscordItem;

const ITEMS_DICT = {
    config: {
        BLOG: CONFIG.WIDGETS.BLOG,
        NEWS: CONFIG.WIDGETS.NEWS,
        DAO: CONFIG.WIDGETS.DAO,
        FORUM: CONFIG.WIDGETS.FORUM,
        REDDIT: CONFIG.WIDGETS.REDDIT,
        DISCORD: CONFIG.WIDGETS.DISCORD,
    },
    setFeedPreference: {
        BLOG: setBlogFeedPreference,
        NEWS: setNewsFeedPreference,
        DAO: undefined,
        FORUM: undefined,
        REDDIT: undefined,
        DISCORD: undefined,
    },
    selectFeedPreference: {
        BLOG: selectBlogFeedPreference,
        NEWS: selectNewsFeedPreference,
        DAO: undefined,
        FORUM: undefined,
        REDDIT: undefined,
        DISCORD: undefined,
    },
    useOpenItemMutation: {
        BLOG: useOpenBlogItemMutation,
        NEWS: useOpenNewsItemMutation,
        DAO: undefined,
        FORUM: undefined,
        REDDIT: undefined,
        DISCORD: undefined,
    },
    useBookmarkItemMutation: {
        BLOG: useBookmarkBlogItemMutation,
        NEWS: useBookmarkNewsItemMutation,
        DAO: undefined,
        FORUM: undefined,
        REDDIT: undefined,
        DISCORD: undefined,
    },
    useGetItemListQuery: {
        BLOG: useGetBlogListQuery,
        NEWS: useGetNewsListQuery,
        DAO: useGetDaoItemsQuery,
        REDDIT: useGetRedditItemsQuery,
        FORUM: useGetForumItemsQuery,
        DISCORD: useGetDiscordItemsQuery,
    },
};

const ItemsContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const widgetType = getWidgetName(
        moduleData.widget.template.slug
    ) as TItemGroup;

    const isNewsOrBlog = widgetType === "NEWS" || widgetType === "BLOG";

    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(userStore.selectIsAuthenticated);

    const widgetHeight = useWidgetHeight(moduleData);

    const [currentPage, setCurrentPage] = useState<number | undefined>(
        undefined
    );

    const feedPreferenceSelector =
        ITEMS_DICT.selectFeedPreference[widgetType] || (() => () => undefined);

    const defaultFeed =
        widgetType === "NEWS" || widgetType === "BLOG"
            ? ITEMS_DICT.config[widgetType]?.DEFAULT_FEED_PREFERENCE
            : undefined;

    const feedPreference =
        useAppSelector(feedPreferenceSelector(moduleData.hash)) ?? defaultFeed;

    const setFeedPreference = useCallback(
        (preference: EItemFeedPreference) => {
            const action = ITEMS_DICT.setFeedPreference[widgetType];
            if (action !== undefined) {
                dispatch(
                    action({
                        widgetHash: moduleData.hash,
                        preference,
                    })
                );
            }
        },
        [dispatch, moduleData.hash, widgetType]
    );

    const [items, setItems] = useState<TItem[] | undefined>();

    const tagsSettings = moduleData.settings.filter(
        (s) =>
            s.widget_setting.setting.slug ===
            EWidgetSettingsRegistry.IncludedTags
    );

    const tagsRef = useRef<TBaseTag[]>();

    const tags =
        tagsSettings[0] !== undefined ? tagsSettings[0].tags : undefined;

    const pollingInterval =
        (moduleData.widget.refresh_interval ||
            ITEMS_DICT.config[widgetType].POLLING_INTERVAL) * 1000;

    const queryParameters = {
        page: currentPage,
        tags: tags ? filterUtils.filteringListToStr(tags) : undefined,
        ...((widgetType === "NEWS" || widgetType === "BLOG") && {
            feedPreference,
        }),
    };

    const response = ITEMS_DICT.useGetItemListQuery[widgetType](
        queryParameters,
        {
            pollingInterval,
        }
    );

    const { currentData: itemsData, isLoading, isSuccess } = response;

    const [openItemMut] = ITEMS_DICT.useOpenItemMutation[widgetType]?.() || [];
    const [bookmarkItemMut] =
        ITEMS_DICT.useBookmarkItemMutation[widgetType]?.() || [];

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
                    if (isNewsOrBlog) {
                        return (newItems as TNewsItem[]).sort(
                            (a, b) =>
                                moment(b.publishedAt).valueOf() -
                                moment(a.publishedAt).valueOf()
                        );
                    }
                    return newItems;
                }
                return data;
            });
        }
    }, [itemsData?.results, isNewsOrBlog]);

    const { nextPage, handleNextPage } = usePagination(
        itemsData?.links,
        ITEMS_DICT.config[widgetType].MAX_PAGE_NUMBER,
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

    if (isNewsOrBlog && feedPreference !== undefined) {
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

    if (widgetType === "DISCORD") {
        return (
            <DiscordModule
                isLoadingItems={isLoading}
                items={(items ?? itemsData?.results ?? []) as TDiscordItem[]}
                widgetHeight={widgetHeight}
                handlePaginate={handleNextPage}
            />
        );
    }

    return (
        <DaoModule
            // we default items to daoData?.results to avoid a flickering/infinite loading
            items={(items || itemsData?.results) as TDaoItem[] | undefined}
            isLoadingItems={isLoading}
            handlePaginate={handleNextPage}
            widgetHeight={widgetHeight}
        />
    );
};

export default ItemsContainer;
