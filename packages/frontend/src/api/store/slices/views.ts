import assert from "assert";
import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { TRemoteUserView } from "src/api/services";
import { logout } from "src/api/services/user/userEndpoints";
import { RootState } from "src/api/store/store";
import {
    TCachedView,
    TKeyword,
    ETag,
    TTag,
    TSubscribedView,
    TUserViewWidget,
    TBaseUserView,
    TUserViewPreview,
} from "src/api/types";
import { Logger } from "src/api/utils/logging";
import { isViewModified, mapRemoteView } from "src/api/utils/viewUtils";
import { EWidgetSettingsRegistry } from "src/constants";

export interface IViewsState {
    selectedViewId: number | undefined; // null means empty view
    prevSelectedViewId: number | undefined;
    viewsCache: Record<number, TCachedView> | undefined;
    sharedViewsCache: Record<number, TCachedView> | undefined;
    subscribedViewsCache: Record<number, TSubscribedView> | undefined;
}

const initialState: IViewsState = {
    selectedViewId: undefined,
    prevSelectedViewId: undefined,
    /**
     * should only contain views the user is subscribed to
     * For non-authenticated users, these correspond to default pinned views.
     * Thus, we only add views that are included in the /views/subscribed/ response.
     * Any view in this cache, should also exist in the subscribedViewsCache index below
     */
    viewsCache: undefined,
    /**
     * Contains any view that is not in the views/subscribed/ response
     * This can include:
     * - shared views from other users (ie. cached views with isReadOnly = true)
     * - system views that are not public yet
     * Even though this cache may contain read-only views, these are also temporarily editable.
     * This cache currently has a size of 1.
     */
    sharedViewsCache: undefined,
    /**
     * similar to viewsCache but contains only minimal view data (aka view metadata)
     */
    subscribedViewsCache: undefined,
};

/**
 * Convinience function to return a WritableDraft reference for
 * the given view id. It takes care of finding the selected view
 * in either the viewsCache or the sharedViewsCache
 * @param id The target view id
 * @param draft An IViewsState slice
 * @returns A reference to the selected view or undefined
 */
export const getViewRefFromDraft = (
    id: number,
    draft: IViewsState
): TCachedView | undefined => {
    if (draft.viewsCache !== undefined && draft.viewsCache[id] !== undefined) {
        return draft.viewsCache[id];
    }
    if (draft.sharedViewsCache !== undefined) {
        return draft.sharedViewsCache[id];
    }
    return undefined;
};

/**
 * Just a wrapper around getViewRefFromDraft to retrieve the current selected view
 * @param draft A IViewsState slice
 * @returns A reference to the selected view or undefined
 */
export const getSelectedViewRefFromDraft = (
    draft: IViewsState
): TCachedView | undefined => {
    if (draft.selectedViewId === undefined) return undefined;
    return getViewRefFromDraft(draft.selectedViewId, draft);
};

const viewsSlice = createSlice({
    name: "views",
    initialState,
    reducers: {
        setSelectedViewId(draft, action: PayloadAction<number | undefined>) {
            const { payload } = action;
            if (draft.selectedViewId !== payload) {
                Logger.debug(
                    "slices::views::setSelectedViewId: setting selectedViewId",
                    payload
                );
                draft.prevSelectedViewId = draft.selectedViewId;
                draft.selectedViewId = payload;
            }
        },
        setViewsCache(
            draft,
            action: PayloadAction<Record<number, TCachedView> | undefined>
        ) {
            const { payload } = action;
            draft.viewsCache = payload;
        },
        removeViewFromCache(draft, action: PayloadAction<number>) {
            const { payload: viewId } = action;
            if (draft.viewsCache !== undefined && viewId in draft.viewsCache) {
                delete draft.viewsCache[viewId];
                Logger.debug(
                    `slices::views::removeViewFromCache: removed view ${viewId} from main cache`
                );
            }
        },
        removeSharedViewFromCache(draft, action: PayloadAction<number>) {
            const { payload: viewId } = action;
            if (
                draft.sharedViewsCache !== undefined &&
                viewId in draft.sharedViewsCache
            ) {
                delete draft.sharedViewsCache[viewId];
                Logger.debug(
                    `slices::views: removed view ${viewId} from shared views cache`
                );
            }
        },
        setSharedViewsCache(
            draft,
            action: PayloadAction<Record<number, TCachedView> | undefined>
        ) {
            const { payload } = action;
            draft.sharedViewsCache = payload;
        },
        setSubscribedViewsCache(
            draft,
            action: PayloadAction<Record<number, TSubscribedView> | undefined>
        ) {
            const { payload } = action;
            draft.subscribedViewsCache = payload;
        },
        updateSubscribedViewsCache(
            draft,
            action: PayloadAction<TUserViewPreview[] | undefined>
        ) {
            const { payload } = action;
            const { subscribedViewsCache } = draft;

            const draftViewsCache: Record<number, TSubscribedView> = {};
            if (payload !== undefined) {
                payload.forEach((subscribedView) => {
                    const prevState = subscribedViewsCache
                        ? subscribedViewsCache[subscribedView.id]
                        : undefined;
                    draftViewsCache[subscribedView.id] =
                        prevState !== undefined
                            ? {
                                  ...prevState,
                                  lastSynced: new Date().toISOString(),
                                  data: {
                                      ...subscribedView,
                                  },
                              }
                            : {
                                  lastModified: undefined,
                                  lastSynced: new Date().toISOString(),
                                  data: {
                                      ...subscribedView,
                                  },
                              };
                });
            }
            draft.subscribedViewsCache = { ...draftViewsCache };
        },
        syncView(draft, action: PayloadAction<TRemoteUserView>) {
            const remoteView = mapRemoteView(action.payload);
            Logger.debug(
                "slices::views::syncView: called, remoteView:",
                remoteView
            );
            const selectedView = getSelectedViewRefFromDraft(draft);
            if (selectedView === undefined) {
                Logger.error(
                    "slices::views::syncView: selectedView is undefined, should never happen"
                );
                return;
            }
            assert(
                remoteView.id === selectedView.data.id,
                "slices::views::syncView: ids should match"
            );
            const { id } = selectedView.data;
            const updatedAt = remoteView.updated_at;
            selectedView.data = {
                ...selectedView.data,
                ...remoteView,
            };
            if (
                draft.subscribedViewsCache !== undefined &&
                draft.subscribedViewsCache[id] !== undefined
            ) {
                draft.subscribedViewsCache[id].data.updated_at = updatedAt;
            } else if (!selectedView.isReadOnly) {
                Logger.warn(
                    "slices::views::syncView: could not find subscribed view in cache"
                );
            }
            selectedView.lastSynced = new Date().toISOString();
        },
        updateViewMeta(
            draft,
            action: PayloadAction<{ id: number; meta: Partial<TBaseUserView> }>
        ) {
            const { id, meta } = action.payload;
            Logger.debug(
                "slices::views::updateViewMeta: called, viewMeta:",
                meta
            );
            const targetView = getViewRefFromDraft(id, draft);
            if (targetView === undefined) {
                Logger.error(
                    "slices::views::updateViewMeta: targetView is undefined, should never happen"
                );
                return;
            }
            targetView.data = {
                ...targetView.data,
                ...meta,
            };
            /**
             * this action shouldn't modify the lastModified field to avoid triggering
             * an automatic save request. This is because changing view metadata uses
             * an specific endpoint.
             */
        },
        setViewKeywords(draft, action: PayloadAction<TKeyword[]>) {
            const { payload } = action;
            const selectedView = getSelectedViewRefFromDraft(draft);
            if (selectedView === undefined) {
                Logger.error(
                    "slices::views::setViewKeywords: selectedView is undefined, should never happen"
                );
                return;
            }
            selectedView.data.keywords = payload;
            selectedView.lastModified = new Date().toISOString();
            if (
                draft.subscribedViewsCache !== undefined &&
                draft.subscribedViewsCache[selectedView.data.id] !== undefined
            ) {
                draft.subscribedViewsCache[selectedView.data.id].lastModified =
                    selectedView.lastModified;
            } else if (!selectedView.isReadOnly) {
                Logger.warn(
                    "slices::views::setViewKeywords: could not find subscribed view in cache"
                );
            }
        },
        /**
         * Add a keyword to the current view
         * Add this keyword's tag to all view widgets
         */
        addKeywordToViewWidgets(draft, action: PayloadAction<TKeyword>) {
            const { payload } = action;
            const selectedView = getSelectedViewRefFromDraft(draft);
            if (selectedView === undefined) {
                Logger.error(
                    "slices::views::addKeywordToViewWidgets: selectedView is undefined, should never happen"
                );
                return;
            }

            // update widgets' tag preferences
            const viewWidgets = selectedView.data.widgets;
            const tagFromKeyword = payload.tag;
            for (let i = 0; i < viewWidgets.length; i += 1) {
                const tagsSettings = viewWidgets[i].settings.filter(
                    (s) =>
                        s.setting.slug === EWidgetSettingsRegistry.IncludedTags
                );
                if (tagsSettings[0]) {
                    const widgetTags = tagsSettings[0].tags;
                    if (tagFromKeyword == null) {
                        /**
                         * When tags from keywords are empty,
                         * we want to keep all tags that were persisted in storage
                         * To do this, we avoid mutating the widget's tags
                         */
                        // eslint-disable-next-line
                        continue;
                    }
                    // add tag only if it's not already there
                    if (
                        !widgetTags
                            .map((wt) => wt.id)
                            .includes(tagFromKeyword.id)
                    ) {
                        widgetTags.push({
                            ...tagFromKeyword,
                            tag_type: ETag.Global,
                        });
                    }
                }
            }
            selectedView.lastModified = new Date().toISOString();
            if (
                draft.subscribedViewsCache !== undefined &&
                draft.subscribedViewsCache[selectedView.data.id] !== undefined
            ) {
                draft.subscribedViewsCache[selectedView.data.id].lastModified =
                    selectedView.lastModified;
            } else if (!selectedView.isReadOnly) {
                Logger.warn(
                    "slices::views::addKeywordToViewWidgets: could not find subscribed view in cache"
                );
            }
        },
        /**
         * Remove a keyword from the current view and all its widgets
         */
        removeKeywordsFromViewWidgets(
            draft,
            action: PayloadAction<TKeyword[]>
        ) {
            const { payload } = action;
            const selectedView = getSelectedViewRefFromDraft(draft);
            if (selectedView === undefined) {
                Logger.error(
                    "slices::views::removeKeywordsFromViewWidgets: selectedView is undefined, should never happen"
                );
                return;
            }

            // update widgets' tag preferences
            const viewWidgets = selectedView.data.widgets;
            for (let i = 0; i < viewWidgets.length; i += 1) {
                const tagsSettings = viewWidgets[i].settings.find(
                    (s) =>
                        s.setting.slug === EWidgetSettingsRegistry.IncludedTags
                );
                if (tagsSettings === undefined) {
                    // eslint-disable-next-line no-continue
                    continue;
                }
                const widgetTags = tagsSettings.tags;
                for (let j = 0; j < payload.length; j += 1) {
                    const tagFromKeyword = payload[j].tag;
                    if (tagFromKeyword == null) {
                        /**
                         * When tags from keywords are empty,
                         * We cant remove any tags from the widget.
                         */
                        // eslint-disable-next-line
                        continue;
                    }
                    const tagIndex = widgetTags.findIndex(
                        (wt) => wt.id === tagFromKeyword.id
                    );
                    if (tagIndex !== -1) {
                        const removedTag = widgetTags.splice(tagIndex, 1);
                        Logger.debug(
                            `slices::views::removeKeywordsFromViewWidgets: removed tag ${removedTag[0].id} from widget ${viewWidgets[i].hash}`
                        );
                    }
                }
            }
        },
        removeTagFromViewWidget(
            draft,
            action: PayloadAction<{ widgetHash: string; tagId: number }>
        ) {
            const { widgetHash, tagId } = action.payload;
            const selectedView = getSelectedViewRefFromDraft(draft);
            if (selectedView === undefined) {
                Logger.error(
                    "slices::views::removeTagFromViewWidget: selectedView is undefined, should never happen"
                );
                return;
            }
            const widget = selectedView.data.widgets.find(
                (w) => w.hash === widgetHash
            );
            if (widget === undefined) {
                Logger.error(
                    "slices::views::removeTagFromViewWidget: could not find widget. Should never happen"
                );
                return;
            }
            const widgetTagSettings = widget.settings.find(
                (s) => s.setting.slug === EWidgetSettingsRegistry.IncludedTags
            );
            if (widgetTagSettings === undefined) {
                Logger.error(
                    "slices::views::removeTagFromViewWidget: could not get widget tag settings"
                );
                return;
            }
            widgetTagSettings.tags = widgetTagSettings.tags.filter(
                (t) => t.id !== tagId
            );
            selectedView.lastModified = new Date().toISOString();
            if (
                draft.subscribedViewsCache !== undefined &&
                draft.subscribedViewsCache[selectedView.data.id] !== undefined
            ) {
                draft.subscribedViewsCache[selectedView.data.id].lastModified =
                    selectedView.lastModified;
            } else if (!selectedView.isReadOnly) {
                Logger.warn(
                    "slices::views::removeTagFromViewWidget: could not find subscribed view in cache"
                );
            }
            Logger.debug(
                "slices::views::removeTagFromViewWidget: widget tags have been updated"
            );
        },
        includeTagInViewWidget(
            draft,
            action: PayloadAction<{ widgetHash: string; tag: TTag }>
        ) {
            const { widgetHash, tag } = action.payload;
            const selectedView = getSelectedViewRefFromDraft(draft);
            if (selectedView === undefined) {
                Logger.error(
                    "slices::views::includeTagInViewWidget: selectedView is undefined, should never happen"
                );
                return;
            }
            const widget = selectedView.data.widgets.find(
                (w) => w.hash === widgetHash
            );
            if (widget === undefined) {
                Logger.error(
                    "slices::views::includeTagInViewWidget: could not find widget. Should never happen"
                );
                return;
            }
            const widgetTagSettings = widget.settings.find(
                (s) => s.setting.slug === EWidgetSettingsRegistry.IncludedTags
            );
            if (widgetTagSettings === undefined) {
                Logger.error(
                    "slices::views::includeTagInViewWidget: could not get widget tag settings"
                );
                return;
            }

            // if the tag already exists, it means it was added from the widget
            // settings, in which case we change it from global to local
            const existingTag = widgetTagSettings.tags.find(
                (t) => t.id === tag.id
            );
            if (
                existingTag !== undefined &&
                existingTag.tag_type === ETag.Global
            ) {
                existingTag.tag_type = ETag.Local;
                return;
            }
            widgetTagSettings.tags.push({ ...tag, tag_type: tag.tagType });
            selectedView.lastModified = new Date().toISOString();
            if (
                draft.subscribedViewsCache !== undefined &&
                draft.subscribedViewsCache[selectedView.data.id] !== undefined
            ) {
                draft.subscribedViewsCache[selectedView.data.id].lastModified =
                    selectedView.lastModified;
            } else if (!selectedView.isReadOnly) {
                Logger.warn(
                    "slices::views::includeTagInViewWidget: could not find subscribed view in cache"
                );
            }
            Logger.debug(
                "slices::views::includeTagInViewWidget: widget tags have been updated"
            );
        },
        removeTagFromAllWidgets(
            draft,
            action: PayloadAction<{ tagId: number }>
        ) {
            const { tagId } = action.payload;
            const selectedView = getSelectedViewRefFromDraft(draft);
            if (selectedView === undefined) {
                Logger.error(
                    "slices::views::setViewKeywords: selectedView is undefined, should never happen"
                );
                return;
            }
            let viewWasModified = false;
            for (let i = 0; i < selectedView.data.widgets.length; i += 1) {
                const widgetTagSettings = selectedView.data.widgets[
                    i
                ].settings.find(
                    (s) =>
                        s.setting.slug === EWidgetSettingsRegistry.IncludedTags
                );
                if (widgetTagSettings !== undefined) {
                    widgetTagSettings.tags = widgetTagSettings.tags.filter(
                        (t) => t.id !== tagId || t.tag_type === ETag.Local
                    );
                    viewWasModified = true;
                }
            }
            if (viewWasModified) {
                selectedView.lastModified = new Date().toISOString();
                if (
                    draft.subscribedViewsCache !== undefined &&
                    draft.subscribedViewsCache[selectedView.data.id] !==
                        undefined
                ) {
                    draft.subscribedViewsCache[
                        selectedView.data.id
                    ].lastModified = selectedView.lastModified;
                } else if (!selectedView.isReadOnly) {
                    Logger.warn(
                        "slices::views::removeTagFromAllWidgets: could not find subscribed view in cache"
                    );
                }
                Logger.debug(
                    "slices::views::removeTagFromAllWidgets: tags have been updated"
                );
            }
        },
        addWidgetsToView(
            draft,
            action: PayloadAction<{ widgets: TUserViewWidget[] }>
        ) {
            const selectedView = getSelectedViewRefFromDraft(draft);
            if (selectedView === undefined) {
                Logger.warn(
                    "slices::views::addWidgetsToView: no view selected"
                );
                return;
            }
            const { widgets } = action.payload;
            if (selectedView.data.widgets) {
                // Recall: The widget hash is always unique even for widgets from the widget library
                const hashArray = widgets.map((e) => e.hash);

                selectedView.data = {
                    ...selectedView.data,
                    // first remove widgets if they already exist
                    widgets: [
                        ...selectedView.data.widgets.filter(
                            (w) => !hashArray.includes(w.hash)
                        ),
                        ...widgets,
                    ],
                };
                selectedView.lastModified = new Date().toISOString();
                const { id } = selectedView.data;

                // if the view is subscribed to, update view metadata in subscribedViewsCache
                if (
                    draft.subscribedViewsCache !== undefined &&
                    draft.subscribedViewsCache[id]
                ) {
                    draft.subscribedViewsCache[id].lastModified =
                        selectedView.lastModified;
                } else if (!selectedView.isReadOnly) {
                    Logger.warn(
                        "useView::removeWidgetFromView: could not find subscribed view in cache"
                    );
                }
                Logger.debug(
                    "slices::views::removeWidgetFromView: widget successfully removed"
                );
            }
        },
        removeWidgetFromView(
            draft,
            action: PayloadAction<{ widgetHash: string }>
        ) {
            const { widgetHash } = action.payload;
            Logger.debug(
                "slices::views::removeWidgetFromView: called, widgetHash",
                widgetHash
            );
            const selectedView = getSelectedViewRefFromDraft(draft);
            if (selectedView === undefined) {
                Logger.warn(
                    "slices::views::removeWidgetFromView: no view selected"
                );
                return;
            }

            selectedView.data = {
                ...selectedView.data,
                widgets: selectedView.data.widgets.filter(
                    // The widget hash is always unique even for widgets from the widget library
                    (widget) => widget.hash !== widgetHash
                ),
            };
            selectedView.lastModified = new Date().toISOString();
            const { id } = selectedView.data;

            // if the view is subscribed to, update view metadata in subscribedViewsCache
            if (
                draft.subscribedViewsCache !== undefined &&
                draft.subscribedViewsCache[id]
            ) {
                draft.subscribedViewsCache[id].lastModified =
                    selectedView.lastModified;
            } else if (!selectedView.isReadOnly) {
                Logger.warn(
                    "useView::removeWidgetFromView: could not find subscribed view in cache"
                );
            }
            Logger.debug(
                "slices::views::removeWidgetFromView: widget successfully removed"
            );
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(logout.matchFulfilled, (_draft) => {
            return initialState;
        });
    },
});

/**
 * views selectors
 */

export const userAndSharedViewsCacheSelector: (
    state: RootState
) => Record<number, TCachedView> | undefined = createSelector(
    (state: RootState) => state.views.viewsCache,
    (state: RootState) => state.views.sharedViewsCache,
    (viewsCache, sharedViewsCache) => ({
        ...sharedViewsCache,
        ...viewsCache,
    })
);

export const selectedViewSelector: (
    state: RootState
) => TCachedView | undefined = createSelector(
    (state: RootState) => state.views.selectedViewId,
    userAndSharedViewsCacheSelector,
    (selectedViewId, userAndSharedViewsCache) => {
        if (selectedViewId === undefined) {
            return undefined;
        }
        return userAndSharedViewsCache?.[selectedViewId];
    }
);

export const keywordSearchListSelector: (state: RootState) => TKeyword[] =
    createSelector(
        (state: RootState) => state.views.selectedViewId,
        userAndSharedViewsCacheSelector,
        (selectedViewId, userAndSharedViewsCache) => {
            if (selectedViewId === undefined) {
                return [];
            }
            if (userAndSharedViewsCache?.[selectedViewId]) {
                return userAndSharedViewsCache?.[selectedViewId].data.keywords;
            }
            return [];
        }
    );

export const isViewModifiedSelector: (state: RootState) => boolean =
    createSelector(
        (state: RootState) => state.views.selectedViewId,
        (state: RootState) => state.views.subscribedViewsCache,
        (state: RootState) => state.views.sharedViewsCache,
        (selectedViewId, subscribedViewsCache, sharedViewsCache) => {
            if (selectedViewId === undefined) {
                return false;
            }

            const selectedView =
                subscribedViewsCache?.[selectedViewId] ??
                sharedViewsCache?.[selectedViewId];
            if (selectedView === undefined) {
                return false;
            }
            return isViewModified(selectedView);
        }
    );

export const {
    setSelectedViewId,
    setViewsCache,
    removeViewFromCache,
    setSharedViewsCache,
    removeSharedViewFromCache,
    syncView,
    updateViewMeta,
    setViewKeywords,
    addKeywordToViewWidgets,
    removeKeywordsFromViewWidgets,
    removeTagFromViewWidget,
    removeTagFromAllWidgets,
    includeTagInViewWidget,
    addWidgetsToView,
    removeWidgetFromView,
    updateSubscribedViewsCache,
    setSubscribedViewsCache,
} = viewsSlice.actions;
export default viewsSlice.reducer;
