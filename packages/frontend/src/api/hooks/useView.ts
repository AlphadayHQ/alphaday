import { useCallback, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useViewRoute } from "src/api/hooks";
import {
    useSaveViewMutation,
    useSaveViewAsMutation,
    useDeleteViewMutation,
    TRemoteUserView,
    useGetSubscribedViewsQuery,
    useSaveViewMetaMutation,
    TRemoteUserViewPreview,
} from "src/api/services";
import { useAppSelector, useAppDispatch } from "src/api/store/hooks";
import * as viewsStore from "src/api/store/slices/views";
import {
    TCachedView,
    TSubscribedView,
    TBaseUserView,
    EViewDialogState,
    TUserViewWidget,
    TTag,
    TViewMeta,
} from "src/api/types";
import { Logger } from "src/api/utils/logging";
import {
    buildViewPath,
    remoteViewAsCachedView,
    buildViewDraft,
} from "src/api/utils/viewUtils";
import CONFIG from "src/config/config";
import { EWidgetSettingsRegistry } from "src/constants";
import { RequestRejectedError } from "../errors";
import { getReadableErrorMessage } from "../utils/errorHandling";
import { toast } from "../utils/toastUtils";

export const RTK_VIEW_CACHE_KEYS = {
    SAVE_VIEW: "save-view-cache-key",
    SAVE_VIEW_AS: "save-view-as-cache-key",
    SAVE_VIEW_META: "save-view-meta-cache-key",
    DELETE_VIEW: "delete-view-cache-key",
};

interface IView {
    /**
     * A *sorted* list of all the views that are spotlighted or that the user has subscribed to.
     * It is fetched from the server, memory-cached by redux and updated upon `SubscribedViews` tag invalidation.
     * It also contains the views from the `sharedViewsCache` so as to show the views on the views tab.
     */
    subscribedViews: ReadonlyArray<TSubscribedView>;
    /**
     * The current selected view that is being displayed
     */
    selectedView: TCachedView | undefined;
    /**
     * Sets the currently selected view by id.
     *
     * @param id the id of the view to be selected
     */
    setSelectedViewId: (id: number | undefined) => void;
    /**
     * A flag that indicates whether the current view has been modified.
     */
    isViewModified: boolean;
    /**
     * A flag that indicates whether the user is allowed to save an empty view.
     * This is used when creating a new view from scratch.
     */
    allowEmptyView: boolean;
    dialogState: EViewDialogState;
    openSaveViewDialog: () => void;
    openRemoveViewDialog: () => void;
    closeViewDialog: () => void;
    dialogErrorMessage: string | undefined;
    /**
     * Saves the current `selectedView` as a new view.
     *
     * @param viewName the name of the new view
     */
    saveViewAs: (viewName: string) => void;
    /**
     * Saves/Updates the current selectedView`.
     *
     * @param saveSystemViews if true, system views will be saved as well. Defaults to false.
     */
    saveSelectedView: (saveSystemViews?: boolean) => void;
    /**
     * Saves meta data for a view. This is used when a user changes the name of a view.
     * It is also used when a user changes the description/icon and other top level view properties.
     *
     * @param viewId the id of the view to be updated
     * @param viewMeta the view meta data to be updated
     */
    saveViewMeta: (viewId: number, viewMeta: Partial<TBaseUserView>) => void;
    /**
     * Deletes a custom user view from the backend based on the id.
     * If it's a shared or read only view, it is just removed from the cache.
     *
     * @param viewId the id of the view to be deleted
     */
    removeView: ({ id, isReadOnly, hash, slug }: TViewMeta) => void;
    /**
     * Essentially, we have three types of views stored in cache.
     * 1. Available/cached views - these contain full view data (ie. including widget data).
     * 2. Shared views - these contain full view data but the user is not subscribed to them. It's a cache of length 1.
     * 3. Subscribed views - these contain only view metadata (no widget data).
     *
     * This function adds a view to the cache.
     * It is used when a user visits a view that is not in the cache.
     * It is also used to update the cache when a user subscribes to a view.
     * It is also used to update the cache when a subscribed system view is refreshed.
     */
    addViewToCache: (view: TRemoteUserView) => void;
    /**
     * Removes a view from the cache (typically a stale system view or a view explicitly removed
     * or unsubscribed by the user).
     * The view is removed from either the main cache, the shared views cache or both.
     *
     * @param id the id of the view to be removed from cache
     */
    removeViewFromCache: (id: number) => void;
    addWidgetsToCache: (w: TUserViewWidget[]) => void;
    removeTagFromViewWidget: (viewHash: string, tagId: number) => void;
    includeTagInViewWidget: (viewHash: string, tag: TTag) => void;
    /**
     * Checks if a widget is in the `data` cache of the currently selected view.
     *
     * @param wdgHash the hash of the widget to be checked
     */
    hasWidgetInCache: (wdgHash: string) => boolean;
    toggleAllowEmptyView: () => void;

    /**
     * builds the path to a view based on the view hash and slug and navigates to it.
     *
     * @param view the view to be navigated to
     */
    navigateToView: (view: TRemoteUserViewPreview) => void;
}

export const useView: () => IView = () => {
    const navigate = useHistory();
    const dispatch = useAppDispatch();

    const { routeInfo, pathContainsHashOrSlug } = useViewRoute();
    const {
        currentData: remoteSubscribedViews,
        isFetching: isFetchingSubscribedViews,
    } = useGetSubscribedViewsQuery();

    const selectedViewId = useAppSelector(
        (state) => state.views.selectedViewId
    );

    const setSelectedViewId = useCallback(
        (id: number | undefined) => {
            dispatch(viewsStore.setSelectedViewId(id));
        },
        [dispatch]
    );

    const viewsCache = useAppSelector((state) => state.views.viewsCache);

    const sharedViewsCache = useAppSelector(
        (state) => state.views.sharedViewsCache
    );

    const subscribedViewsCache = useAppSelector(
        (state) => state.views.subscribedViewsCache
    );

    /**
     * A list of all the views that user has subscribed to.
     * We will assume that the user has also subscribed to the views that
     * have been visited and stored in the sharedViewsCache.
     * We do this to show the shared views in the views tab.
     */
    const subscribedViews = useMemo<TSubscribedView[]>(() => {
        const allViews = [
            ...Object.values(subscribedViewsCache ?? {}),
            ...Object.values(sharedViewsCache ?? {}),
        ].reduce((acc, view) => {
            if (!acc.find((v) => v.data.id === view.data.id)) {
                return [...acc, view];
            }
            return acc;
        }, [] as TSubscribedView[]);
        const systemViews = allViews
            .filter((v) => v.data.is_system_view)
            .sort(
                (viewA, viewD) => viewA.data.sort_order - viewD.data.sort_order
            );
        const customViews = allViews
            .filter((v) => !v.data.is_system_view)
            .sort(
                (viewA, viewD) => viewA.data.sort_order - viewD.data.sort_order
            );
        return [...systemViews, ...customViews];
    }, [subscribedViewsCache, sharedViewsCache]);

    const isViewModified = useAppSelector(viewsStore.isViewModifiedSelector);

    const selectedView = useAppSelector(viewsStore.selectedViewSelector);

    const [saveViewMut] = useSaveViewMutation({
        fixedCacheKey: RTK_VIEW_CACHE_KEYS.SAVE_VIEW,
    });
    const [saveViewAsMut] = useSaveViewAsMutation({
        fixedCacheKey: RTK_VIEW_CACHE_KEYS.SAVE_VIEW_AS,
    });
    const [saveViewMetaMut] = useSaveViewMetaMutation({
        fixedCacheKey: RTK_VIEW_CACHE_KEYS.SAVE_VIEW_META,
    });
    const [deleteViewMut] = useDeleteViewMutation({
        fixedCacheKey: RTK_VIEW_CACHE_KEYS.DELETE_VIEW,
    });

    const [dialogState, setDialogState] = useState<EViewDialogState>(
        EViewDialogState.Closed
    );

    const [dialogErrorMessage, setDialogErrorMessage] = useState<
        string | undefined
    >();
    const [allowEmptyView, setAllowEmptyView] = useState(false);
    const toggleAllowEmptyView = () => setAllowEmptyView((prev) => !prev);

    const closeViewDialog = () => setDialogState(EViewDialogState.Closed);

    /**
     * Adds a view to the corresponding cache:
     *  viewsCache -> for subscribed views
     *  sharedViewsCache -> for shared views or views that the user previews from the board library
     */
    const addViewToCache = useCallback(
        (view: TRemoteUserView) => {
            // if we are fetching subscribed views, we should wait until we have them
            if (isFetchingSubscribedViews) {
                return;
            }
            /**
             * If a view is subscribed to, we will add it to the main views
             * cache. Otherwise, we will add it to the shared views cache.
             * This is to ensure the views cache is always up to date.
             */
            if (
                // the user must be subscribed to the view
                remoteSubscribedViews?.find((v) => v.id === view.id) !==
                undefined
            ) {
                dispatch(
                    viewsStore.setViewsCache({
                        ...viewsCache,
                        [view.id]: {
                            ...remoteViewAsCachedView(view),
                        },
                    })
                );
                return;
            }
            // if the view is already in cache, we don't need to add it again
            if (viewsCache?.[view.id] !== undefined) {
                return;
            }
            // We keep at most 1 view in the shared views cache to avoid polluting the view tab menu
            dispatch(
                viewsStore.setSharedViewsCache({
                    [view.id]: {
                        ...remoteViewAsCachedView(view),
                        isReadOnly: !view.is_system_view,
                    },
                })
            );
        },
        [dispatch, remoteSubscribedViews, viewsCache, isFetchingSubscribedViews]
    );

    const removeViewFromCache = useCallback(
        (viewId: number) => {
            Logger.debug("useView::removeViewFromCache called");
            dispatch(viewsStore.removeViewFromCache(viewId));
            dispatch(viewsStore.removeSharedViewFromCache(viewId));
        },
        [dispatch]
    );

    /**
     * save/save as actions
     */
    const openSaveViewDialog = () => setDialogState(EViewDialogState.Save);

    const saveViewAs = useCallback(
        (viewName: string) => {
            try {
                setDialogState(EViewDialogState.Busy);
                const currentView =
                    allowEmptyView || selectedView === undefined
                        ? remoteViewAsCachedView({
                              name: "",
                              hash: "",
                              slug: "",
                              is_system_view: false,
                              is_smart: false,
                              description: "Alphaday",
                              widgets: [],
                              is_subscribed: false,
                              sort_order: 0,
                              updated_at: Date.now().toString(),
                              id: 0,
                              icon: null,
                              keywords: [],
                              max_widgets: CONFIG.VIEWS.MAX_WIDGETS,
                          })
                        : selectedView;
                if (currentView === undefined) {
                    throw new Error("useView::saveViewAs: No view selected");
                }
                const viewData = { ...currentView.data };
                Logger.debug("useView::saveViewAs: called", viewData);

                // if this is a new board, get last sort_order and increment it
                let sortOrder: number | undefined;
                if (viewsCache) {
                    const sortNumbers = Object.values(viewsCache)
                        .map((view) => view.data.sort_order)
                        .sort();
                    sortOrder = sortNumbers[sortNumbers.length - 1];
                    if (sortOrder) {
                        sortOrder += 1;
                    }
                }
                const body = buildViewDraft(viewData, viewName, sortOrder);
                Logger.debug("useView::saveViewAs::body:", body);

                const { max_widgets: maxWidgets } = currentView.data;
                const MAX_WIDGETS = maxWidgets ?? CONFIG.VIEWS.MAX_WIDGETS;

                if (body.widgets.length > MAX_WIDGETS) {
                    setDialogState(EViewDialogState.LimitReached);
                    setDialogErrorMessage(
                        `Boards cannot have more than ${String(
                            MAX_WIDGETS
                        )} widgets.`
                    );
                    return;
                }

                saveViewAsMut(body)
                    .unwrap()
                    .then((response) => {
                        Logger.debug(
                            "useView::saveViewAs::saveViewAsMut: success. Response:",
                            response
                        );
                        setDialogState(EViewDialogState.Closed);
                        setAllowEmptyView(false);
                        toast(`Created new Board: ${response.name}`, {
                            status: "alert",
                        });
                        // update browser history
                        const pathToView = buildViewPath(response);
                        navigate.push(pathToView);
                    })
                    .catch((rejected: RequestRejectedError) => {
                        Logger.error(
                            "useView::saveView::saveViewAsMut: error",
                            rejected
                        );
                        setDialogState(EViewDialogState.Error);
                        setDialogErrorMessage(
                            getReadableErrorMessage(
                                rejected.data?.non_field_errors?.[0]
                            )
                        );
                        setAllowEmptyView(false);
                    });
            } catch (e) {
                Logger.error("useView::saveViewAs: Unexpected error", e);
                setDialogState(EViewDialogState.Error);
                setDialogErrorMessage(
                    "An unexpected error ocurred trying to save board. Please try again later."
                );
            }
        },
        [saveViewAsMut, selectedView, viewsCache, allowEmptyView, navigate]
    );

    /**
     * This is method handles saving a board automatically when the it is modified
     *
     * It should be called once, at the top level anytime the board is modified
     *
     * @param saveSystemViews Allow saving a system view. Defaults to `false`
     */
    const saveSelectedView = useCallback(
        (saveSystemViews = false) => {
            Logger.debug("useView::saveSelectedView: called");
            if (
                !isFetchingSubscribedViews &&
                selectedView !== undefined &&
                (!selectedView.data.is_system_view || saveSystemViews) &&
                !selectedView.isReadOnly &&
                navigator.onLine
            ) {
                const viewData = { ...selectedView.data };
                const body = buildViewDraft(viewData);
                Logger.debug("useView::saveSelectedView::body", body);

                saveViewMut({
                    id: viewData.id,
                    body,
                })
                    .unwrap()
                    .then((response) => {
                        Logger.debug(
                            "useView::saveSelectedView::saveViewMut: success. Response:",
                            response
                        );
                        dispatch(viewsStore.syncView(response));
                    })
                    .catch((rejected) => {
                        Logger.error(
                            "useView::saveSelectedView::saveViewMut::rejected:",
                            rejected
                        );
                    });
            }
        },
        [isFetchingSubscribedViews, selectedView, saveViewMut, dispatch]
    );

    const saveViewMeta = useCallback(
        (viewId: number, viewMeta: Partial<TBaseUserView>) => {
            Logger.debug("useView::saveViewMeta: called");
            if (navigator.onLine) {
                setDialogState(EViewDialogState.Busy);
                saveViewMetaMut({
                    id: viewId,
                    body: viewMeta,
                })
                    .unwrap()
                    .then((response) => {
                        Logger.debug(
                            "useView::saveViewMeta::saveViewMetaMut: success. Response:",
                            response
                        );
                        dispatch(
                            viewsStore.updateViewMeta({
                                id: viewId,
                                meta: viewMeta,
                            })
                        );
                        setDialogState(EViewDialogState.Closed);
                        toast("Board successfully updated", {
                            status: "alert",
                        });
                    })
                    .catch((rejected) => {
                        Logger.error(
                            "useView::saveViewMeta::saveViewMetaMut::rejected:",
                            rejected
                        );
                        setDialogState(EViewDialogState.Error);
                        setDialogErrorMessage(
                            "An unexpected error ocurred trying to update board. Please try again later."
                        );
                    });
            } else {
                setDialogState(EViewDialogState.Error);
                setDialogErrorMessage("You are currently offline.");
            }
        },
        [dispatch, saveViewMetaMut]
    );

    /**
     * remove view actions
     */

    const openRemoveViewDialog = () => setDialogState(EViewDialogState.Remove);

    const removeView = useCallback(
        (request: TViewMeta) => {
            const { id: viewId, isReadOnly, hash, slug } = request;
            if (isReadOnly) {
                // it's important to navigate out first, and then remove from cache
                // otherwise the view might be added back by an effect in home/
                if (
                    routeInfo !== undefined &&
                    pathContainsHashOrSlug &&
                    [hash, slug].indexOf(routeInfo.value) !== -1
                ) {
                    navigate.push("/");
                }
                removeViewFromCache(viewId);
                return;
            }
            setDialogState(EViewDialogState.Busy);
            deleteViewMut({ id: viewId })
                .unwrap()
                .then((response) => {
                    Logger.debug(
                        "useView::removeView::deleteViewMut: success. Response:",
                        response
                    );
                    removeViewFromCache(viewId);
                    if (
                        routeInfo !== undefined &&
                        pathContainsHashOrSlug &&
                        [hash, slug].indexOf(routeInfo.value) !== -1
                    ) {
                        Logger.debug(
                            "useView::removeView: Navigating to root path"
                        );
                        navigate.push("/");
                    }
                    setDialogState(EViewDialogState.Closed);
                    toast("Board successfully removed", {
                        status: "alert",
                    });
                })
                .catch((e) => {
                    Logger.error("useView::removeView: Unexpected error", e);
                    setDialogState(EViewDialogState.Error);
                    setDialogErrorMessage(
                        "An unexpected error ocurred trying to remove the board. Please try again later."
                    );
                });
        },
        [
            deleteViewMut,
            navigate,
            removeViewFromCache,
            routeInfo,
            pathContainsHashOrSlug,
        ]
    );

    /**
     * add/remove widget from view actions
     */

    const hasWidgetInCache = useCallback(
        (moduleHash: string) => {
            if (selectedViewId === undefined || selectedView === undefined) {
                Logger.error(
                    "useView::hasWidgetInCache: selectedView is undefined. Should never happen"
                );
                return false;
            }
            return selectedView.data.widgets.some(
                ({ hash }) => hash === moduleHash
            );
        },
        [selectedView, selectedViewId]
    );

    const addWidgetsToCache = useCallback(
        (widgets: TUserViewWidget[]) => {
            Logger.debug("useView::addWidgetsToCache called");
            dispatch(viewsStore.addWidgetsToView({ widgets }));
        },
        [dispatch]
    );
    /**
     * remove tag from view widget
     * note: tags are added to widgets through the global search bar. (see
     * useGlobalSearch::setKeywordSearchList)
     */
    const removeTagFromViewWidget = useCallback(
        (widgetHash: string, tagId: number) => {
            const widgetsWithTag = selectedView?.data.widgets.filter((w) => {
                const widgetTagSettings = w.settings.find(
                    (s) =>
                        s.setting.slug === EWidgetSettingsRegistry.IncludedTags
                );
                if (!widgetTagSettings) {
                    return false;
                }

                return widgetTagSettings.tags.find((tag) => tag.id === tagId);
            });

            const currentWidgetSetting = widgetsWithTag
                ?.find((w) => w.hash === widgetHash)
                ?.settings.find(
                    (s) =>
                        s.setting.slug === EWidgetSettingsRegistry.IncludedTags
                );

            /**
             * If there is only 1 widget with a tag, and
             * removeTagFromViewWidget is called we should also
             * remove it from the view keywords list
             */
            if (
                widgetsWithTag?.length === 1 &&
                currentWidgetSetting?.tags.length === 1 && // if there is only 1 tag in the widget
                selectedView?.data.keywords?.length // only remove if there are keywords
            ) {
                const updatedKeywords = selectedView?.data.keywords.filter(
                    (kw) => kw.tag.id !== tagId
                );

                if (updatedKeywords) {
                    dispatch(viewsStore.setViewKeywords(updatedKeywords));
                }
            }
            dispatch(viewsStore.removeTagFromViewWidget({ widgetHash, tagId }));
        },
        [dispatch, selectedView?.data.keywords, selectedView?.data.widgets]
    );

    const includeTagInViewWidget = useCallback(
        (widgetHash: string, tag: TTag) => {
            dispatch(
                viewsStore.includeTagInViewWidget({
                    widgetHash,
                    tag,
                })
            );
        },
        [dispatch]
    );

    const navigateToView = useCallback(
        (view: TRemoteUserViewPreview) => {
            navigate.push(buildViewPath(view));
        },
        [navigate]
    );

    return {
        subscribedViews,
        selectedView,
        setSelectedViewId,
        isViewModified,
        dialogState,
        allowEmptyView,
        closeViewDialog,
        dialogErrorMessage,
        openSaveViewDialog,
        saveViewAs,
        saveSelectedView,
        saveViewMeta,
        openRemoveViewDialog,
        removeView,
        addViewToCache,
        removeViewFromCache,
        addWidgetsToCache,
        removeTagFromViewWidget,
        includeTagInViewWidget,
        hasWidgetInCache,
        toggleAllowEmptyView,
        navigateToView,
    };
};
