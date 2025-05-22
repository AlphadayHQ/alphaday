import { useState, useEffect, useMemo, useRef } from "react";
import { useHistory } from "react-router-dom";
import {
    useView,
    useViewRoute,
    useResolvedView,
    RTK_VIEW_CACHE_KEYS,
    useAvailableViews,
} from "src/api/hooks";
import {
    useGetSubscribedViewsQuery,
    useSaveViewMutation,
} from "src/api/services";
import { useAppSelector, useAppDispatch } from "src/api/store/hooks";
import * as userStore from "src/api/store/slices/user";
import * as viewsStore from "src/api/store/slices/views";
import { Logger } from "src/api/utils/logging";
import {
    buildViewPathFromHashOrSlug,
    isViewLangModified,
    isViewStale,
} from "src/api/utils/viewUtils";
import CONFIG from "src/config/config";
import useEventListener from "./useEventListener";
import { useWalletView } from "./useWalletView";

export const useViewUpdater: () => void = () => {
    const dispatch = useAppDispatch();
    const navigate = useHistory();
    const selectedLangCode = useAppSelector(
        (state) => state.ui.selectedLanguageCode
    );

    const saveDebounceTimeout = useRef<NodeJS.Timeout>();

    const {
        saveSelectedView,
        selectedView,
        subscribedViews,
        setSelectedViewId,
        addViewToCache,
        removeViewFromCache,
    } = useView();

    const availableViews = useAvailableViews();

    const selectedViewId = useAppSelector(
        (state) => state.views.selectedViewId
    );

    const {
        currentData: remoteSubscribedViews,
        isFetching: isFetchingSubscribedViews,
    } = useGetSubscribedViewsQuery(
        { lang: selectedLangCode },
        {
            refetchOnMountOrArgChange: true,
        }
    );

    const [, { isLoading: isLoadingSaveView }] = useSaveViewMutation({
        fixedCacheKey: RTK_VIEW_CACHE_KEYS.SAVE_VIEW,
    });

    const isAuthenticated = useAppSelector(userStore.selectIsAuthenticated);
    const prevIsAuthenticated = useRef<boolean>(isAuthenticated);

    useWalletView();

    const isViewModified = useAppSelector(viewsStore.isViewModifiedSelector);

    const subscribedViewsCache = useAppSelector(
        (state) => state.views.subscribedViewsCache
    );

    const sharedViewsCache = useAppSelector(
        (state) => state.views.sharedViewsCache
    );

    // Extract data from the current URL
    const { routeInfo, isFullSize, pathContainsHashOrSlug } = useViewRoute();
    const [prevIsFullSize, setPrevIsFullSize] = useState(isFullSize);

    const resolvedView = useResolvedView();

    /**
     * This event handles the resetting of system/shared views when the page is refreshed.
     *
     * Key Points:
     * - If a user refreshes the page while modifying a system/shared view, the view reverts to its original state, fetched from the backend.
     * - This behavior assumes that users won't refresh the page while modifying a system view. If they do, any unsaved changes will be lost, which is the expected behavior.
     *
     * Benefits of this Approach:
     * - Ensures users always see the most recent version of a view after a page refresh.
     * - Provides immediate UI feedback (Zero-Delay), enhancing the user experience.
     * - Optimizes performance by only resetting the view if it has been modified, saving resources.
     */
    useEventListener("beforeunload", () => {
        Logger.debug("useViewUpdater::beforeunload event triggered");
        const isSharedView =
            selectedView?.isReadOnly &&
            selectedView.data.id === resolvedView.currentData.id;
        if (
            isViewModified &&
            resolvedView.currentData !== undefined &&
            (resolvedView.currentData.is_system_view || isSharedView)
        ) {
            Logger.debug(
                "useViewUpdater::beforeunload resetting before unloading view",
                resolvedView.currentData.name
            );
            addViewToCache(resolvedView.currentData);
            const subscribedView =
                subscribedViewsCache?.[resolvedView.currentData.id];
            if (subscribedView) {
                const updatedSubscribedViewsCache = {
                    ...subscribedViewsCache,
                    [resolvedView.currentData.id]: {
                        ...subscribedView,
                        lastModified: undefined,
                        lastSynced: new Date().toISOString(),
                    },
                };
                dispatch(
                    viewsStore.setSubscribedViewsCache(
                        updatedSubscribedViewsCache
                    )
                );
            }
        }
    });

    const shouldAddToCache = useMemo(() => {
        if (!resolvedView.currentData) return false;

        const isLangChanged = isViewLangModified(
            selectedView,
            resolvedView.currentData
        );
        const isNewView =
            !isViewModified &&
            !isFetchingSubscribedViews &&
            !availableViews?.find(
                (v) => v.data.hash === resolvedView.data?.hash
            );

        return isLangChanged || isNewView;
    }, [
        resolvedView.currentData,
        resolvedView.data?.hash,
        selectedView,
        isViewModified,
        isFetchingSubscribedViews,
        availableViews,
    ]);

    if (shouldAddToCache && resolvedView.currentData) {
        Logger.debug(
            "useViewUpdater: adding view to cache",
            resolvedView.currentData.name
        );
        addViewToCache(resolvedView.currentData);
    }

    /**
     * Handle login/logout transitions
     */
    if (isAuthenticated !== prevIsAuthenticated.current) {
        Logger.debug("useViewUpdater: isAuthenticated changed");
        if (!isAuthenticated) {
            /**
             * If user has logged out and the current view is a custom view,
             * we navigate to the root
             */
            // eslint-disable-next-line no-lonely-if
            if (!selectedView?.data.is_system_view) {
                navigate.push("/");
            }
        }
        prevIsAuthenticated.current = isAuthenticated;
    }

    /**
     * Handle stale views
     * Stale views are views that have been recently modified on the backend
     * and hence should be updated in the local cache.
     * We check this when a new view is selected
     */
    if (selectedView?.data !== undefined) {
        const viewMeta = remoteSubscribedViews?.find(
            (v) => v.id === selectedView.data.id
        );
        /**
         * if the selectedView is stale, remove it from the cache
         * so that we can display the resolved view instead
         */
        if (viewMeta !== undefined && isViewStale(selectedView, viewMeta)) {
            Logger.debug(
                `useViewUpdater: removing stale view ${selectedView.data.name} from cache`
            );
            removeViewFromCache(selectedView.data.id);
        }
    }

    /**
     * Handle updates in shared views (or non-subscribed views)
     * On mount only, if the selected view is a shared view, remove it in from
     * the cache in order to re-fetch it from the backend.
     * This is because the isViewStale function used above uses view metadata
     * from the subscribed views endpoint, so non-subscribed views are not
     * included in the response.
     */
    useEffect(() => {
        if (selectedView === undefined) return;
        if (sharedViewsCache === undefined) return;
        const sharedViews = Object.values(sharedViewsCache);
        if (sharedViews.length === 0) return;
        const currentViewIsSharedView = sharedViews.find(
            (v) => v.data.id === selectedView.data.id
        );
        if (currentViewIsSharedView) {
            Logger.debug(
                `useViewUpdater: removing non-subscribed view <<${selectedView.data.name}>> from cache`
            );
            removeViewFromCache(selectedView.data.id);
        }
        // should only run on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * View auto-save
     */
    if (
        isViewModified &&
        !isLoadingSaveView &&
        !selectedView?.data.is_system_view // don't auto save system views
    ) {
        if (saveDebounceTimeout.current !== undefined) {
            clearTimeout(saveDebounceTimeout.current);
        }
        saveDebounceTimeout.current = setTimeout(() => {
            saveSelectedView();
        }, CONFIG.VIEWS.AUTO_SAVE_DEBOUNCE);
    }

    /**
     * Handle navigation to full-size widgets
     * If current url = / and user navigates to some /fullSizeWidget
     * we need to select the default view cause the URL does not provide any view ID
     */
    if (
        isFullSize &&
        prevIsFullSize !== isFullSize &&
        !pathContainsHashOrSlug &&
        selectedView === undefined &&
        subscribedViews.length > 0
    ) {
        setPrevIsFullSize(isFullSize);
        const defaultView = subscribedViews[0].data;
        Logger.debug(
            "useViewUpdater: selecting default view for FullSize mode",
            defaultView.name
        );
        setSelectedViewId(defaultView.id);
    }

    /**
     * Remote views update effect.
     */
    useEffect(() => {
        if (remoteSubscribedViews !== undefined) {
            Logger.debug("useViewUpdater::updateSubscribedViewsCache called");
            dispatch(
                viewsStore.updateSubscribedViewsCache([
                    ...remoteSubscribedViews,
                ])
            );
        }
    }, [dispatch, remoteSubscribedViews]);

    const viewFromPathInCache = useMemo(() => {
        if (routeInfo === undefined) return undefined;
        // Look for the current view slug/hash in the views cache
        return subscribedViews.find(
            (v) =>
                v.data.slug === routeInfo.value ||
                v.data.hash === routeInfo.value
        );
    }, [routeInfo, subscribedViews]);

    /**
     * Listen to changes in the URL path.
     * Update the current selected view from the URL path if a new one is given.
     */
    if (!resolvedView.isFetching) {
        if (
            pathContainsHashOrSlug &&
            routeInfo !== undefined &&
            !resolvedView.isError
        ) {
            if (
                viewFromPathInCache !== undefined &&
                viewFromPathInCache.data.id !== selectedViewId
            ) {
                Logger.debug(
                    `useViewUpdater: selecting view ${viewFromPathInCache.data.name} from path`
                );
                setSelectedViewId(viewFromPathInCache.data.id);
                return;
            }
        }
        /**
         * If resolving the view from the path fails, we should reset the selectedViewId.
         */
        if (
            pathContainsHashOrSlug &&
            resolvedView.isError &&
            selectedViewId !== undefined
        ) {
            setSelectedViewId(undefined);
            return;
        }
        /**
         * If the path does not contain a hash or slug, we should select the default view
         */
        if (!pathContainsHashOrSlug && selectedView === undefined) {
            if (isFullSize) {
                // See "Handle navigation to full-size widgets" above
                Logger.debug("useViewUpdater: full-size mode");
                return;
            }
            if (subscribedViews.length > 0) {
                const defaultView = subscribedViews[0].data; // recall: subscribedViews is already sorted
                Logger.debug(
                    "useViewUpdater: selecting default view",
                    defaultView.name
                );

                const defaultViewPath = buildViewPathFromHashOrSlug(
                    defaultView.slug ?? defaultView.hash
                );

                if (window.location.pathname !== defaultViewPath) {
                    navigate.push(defaultViewPath);
                }
                return;
            }
            Logger.debug("useViewUpdater: can't select view.");
            /**
             * If we can't select a view, we should reset the selectedViewId.
             */
            if (selectedViewId !== undefined) {
                setSelectedViewId(undefined);
            }
        }
    }
};
