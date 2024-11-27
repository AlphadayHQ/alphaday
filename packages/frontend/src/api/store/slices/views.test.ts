import "src/mocks/libraryMocks";
import moment from "moment-with-locales-es6";
import { ETag, TCachedView, TSubscribedView } from "src/api/types";
import { customTableModuleDataMock } from "src/mocks/tables";
import {
    fakeRemoteView,
    fakeSubscribedView,
    fakeSubscribedViewsCacheMock,
    fakeViewsCacheMock,
    subscribedViewsCacheMock,
    viewsCacheMock,
} from "src/mocks/views";
import { RootState } from "../store";
import viewsReducer, {
    setSelectedViewId,
    setViewsCache,
    removeViewFromCache,
    setSharedViewsCache,
    IViewsState,
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
    selectedViewSelector,
    getSelectedViewRefFromDraft,
    updateSubscribedViewsCache,
    setSubscribedViewsCache,
} from "./views";

let initialState: IViewsState;
let viewsCache: Record<number, TCachedView>;
let subscribedViewsCache: Record<number, TSubscribedView>;

beforeEach(() => {
    initialState = {
        selectedViewId: undefined,
        prevSelectedViewId: undefined,
        viewsCache: {},
        sharedViewsCache: {},
        subscribedViewsCache: {},
    };
    viewsCache = { ...viewsCacheMock };
    subscribedViewsCache = { ...subscribedViewsCacheMock };
});

describe("setSelectedViewId", () => {
    it("should set the selected view ID correctly", () => {
        const selectedViewId = 1;
        expect(initialState.selectedViewId).toBeUndefined();
        const newViewState = viewsReducer(
            initialState,
            setSelectedViewId(selectedViewId)
        );
        expect(newViewState.selectedViewId).toStrictEqual(selectedViewId);
    });
});

describe("setViewsCache", () => {
    it("should add new views to the cache", () => {
        const newViews = Array.from({ length: 3 }, (_, i) =>
            fakeViewsCacheMock(i + 10)
        );

        const newViewState = viewsReducer(
            initialState,
            setViewsCache(newViews)
        );
        expect(newViewState.viewsCache).toStrictEqual(newViews);
    });

    it("should update existing views in the cache", () => {
        initialState = {
            ...initialState,
            viewsCache,
        };

        const updatedViews = {
            ...Object.values(viewsCache).map((view, id) => ({
                ...view,
                name: `Updated View ${id + 1}`,
            })),
        };

        const newViewState = viewsReducer(
            initialState,
            setViewsCache(updatedViews)
        );

        expect(newViewState.viewsCache).toStrictEqual(updatedViews);
    });
});

describe("setSubscribedViewsCache", () => {
    it("should add new subscribed views to the cache", () => {
        const newSubscribedViews = Array.from({ length: 3 }, (_, i) =>
            fakeSubscribedViewsCacheMock(i + 10)
        );

        const newViewState = viewsReducer(
            initialState,
            setSubscribedViewsCache(newSubscribedViews)
        );
        expect(newViewState.subscribedViewsCache).toStrictEqual(
            newSubscribedViews
        );
    });

    it("should update existing subscribed views in the cache", () => {
        initialState = {
            ...initialState,
            subscribedViewsCache,
        };

        const updatedSubscribedViews = {
            ...Object.values(subscribedViewsCache).map((view, id) => ({
                ...view,
                name: `Updated View ${id + 1}`,
            })),
        };

        const newViewState = viewsReducer(
            initialState,
            setSubscribedViewsCache(updatedSubscribedViews)
        );

        expect(newViewState.subscribedViewsCache).toStrictEqual(
            updatedSubscribedViews
        );
    });
});

describe("removeViewFromCache", () => {
    it("should remove the specified view from the cache", () => {
        initialState = {
            ...initialState,
            viewsCache,
        };

        const viewIdToRemove = 1;

        const newViewState = viewsReducer(
            initialState,
            removeViewFromCache(viewIdToRemove)
        );

        expect(newViewState.viewsCache).toStrictEqual({
            0: viewsCache[0],
            2: viewsCache[2],
            3: viewsCache[3],
            4: viewsCache[4],
            5: viewsCache[5],
            6: viewsCache[6],
            7: viewsCache[7],
            8: viewsCache[8],
            9: viewsCache[9],
        });
    });

    it("should not remove a non-existent view", () => {
        const nonExistentViewId = 11; // viewsCacheMock only has 10 views

        expect(
            viewsReducer(initialState, removeViewFromCache(nonExistentViewId))
        ).toStrictEqual(initialState);
    });
});

describe("setSharedViewsCache", () => {
    it("should add new shared views to the cache", () => {
        const sharedViewsCache = {}; // Initial cache state

        initialState = {
            ...initialState,
            sharedViewsCache,
        };

        // fake views 10, 11, 12
        const newSharedViews = {
            ...Array.from({ length: 3 }, (_, i) => fakeViewsCacheMock(i + 10)),
        };

        const newSharedViewsState = viewsReducer(
            initialState,
            setSharedViewsCache(newSharedViews)
        );

        expect(newSharedViewsState.sharedViewsCache).toStrictEqual(
            newSharedViews
        );
    });

    it("should update existing shared views in the cache", () => {
        const sharedViewsCache = {
            ...Array.from({ length: 3 }, (_, i) => fakeViewsCacheMock(i + 10)),
        }; // Initial cache state

        initialState = {
            ...initialState,
            sharedViewsCache,
        };

        const updatedSharedViews = {
            ...Object.values(initialState.sharedViewsCache || {}).map(
                (view, id) => ({
                    ...view,
                    name: `Updated View ${id + 1}`,
                })
            ),
        };

        const newViewState = viewsReducer(
            initialState,
            setSharedViewsCache(updatedSharedViews)
        );

        expect(newViewState.sharedViewsCache).toStrictEqual(updatedSharedViews);
    });
});

/**
 * subscribeViews is an array of views
 * subscribedViewsCache is an object of id:view pairs
 */
describe("updateSubscribedViewsCache", () => {
    it("should add new subscribed views to the cache", async () => {
        initialState = {
            ...initialState,
            subscribedViewsCache,
        };

        const newSubscribedViews = [
            ...Array.from({ length: 3 }, (_, i) => fakeSubscribedView(i + 1)),
        ];

        const viewIds = newSubscribedViews.map((view) => view.id);

        // delay the last modified date by 1 second
        // eslint-disable-next-line no-promise-executor-return
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newSubscribedViewsState = viewsReducer(
            initialState,
            updateSubscribedViewsCache(newSubscribedViews)
        );

        // there should be differences since new views is added.
        expect(newSubscribedViewsState.subscribedViewsCache).not.toStrictEqual(
            initialState.subscribedViewsCache
        );

        // expect all new views to be added
        expect(
            viewIds.every(
                (id) =>
                    newSubscribedViewsState.subscribedViewsCache?.[id] !==
                    undefined
            )
        ).toBe(true);

        viewIds.forEach((id) => {
            expect(
                moment(
                    newSubscribedViewsState.subscribedViewsCache?.[id]
                        ?.lastSynced
                ).isAfter(
                    newSubscribedViewsState.subscribedViewsCache?.[id]?.data
                        .updated_at
                )
            ).toBe(true);
        });
    });

    it("should update existing subscribed views in the cache", () => {
        initialState = {
            ...initialState,
            subscribedViewsCache,
        };

        const updatedSubscribedViews = [
            ...Object.values(initialState.subscribedViewsCache || {}).map(
                (view, id) => ({
                    ...view.data,
                    name: `Updated View ${id + 1}`,
                })
            ),
        ];

        const newViewState = viewsReducer(
            initialState,
            updateSubscribedViewsCache(updatedSubscribedViews)
        );

        const newSubscribedViews = [
            ...Object.values(newViewState.subscribedViewsCache || {}).map(
                (view, id) => ({
                    ...view.data,
                    name: `Updated View ${id + 1}`,
                })
            ),
        ];

        expect(newSubscribedViews).toStrictEqual(updatedSubscribedViews);
    });
});

describe("removeSharedViewFromCache", () => {
    it("should remove shared views from the cache", () => {
        const sharedViewsCache = {
            ...Array.from({ length: 3 }, (_, i) => fakeViewsCacheMock(i + 1)),
        }; // Initial cache state

        initialState = {
            ...initialState,
            sharedViewsCache,
        };

        const viewIdToRemove = 1;

        const newViewState = viewsReducer(
            initialState,
            removeSharedViewFromCache(viewIdToRemove)
        );

        expect(newViewState.sharedViewsCache).toStrictEqual({
            0: sharedViewsCache[0],
            2: sharedViewsCache[2],
        });
    });
});

describe("syncView", () => {
    it("should sync view", () => {
        const viewId = 1;
        initialState = {
            ...initialState,
            viewsCache,
            subscribedViewsCache: { ...viewsCache },
            selectedViewId: viewId,
        };

        const updatedView = fakeRemoteView(viewId, {
            name: "Updated View",
        });
        const newViewState = viewsReducer(initialState, syncView(updatedView));
        expect(newViewState.viewsCache).not.toStrictEqual(viewsCache);
    });
});

describe("updateViewMeta", () => {
    it("should update view meta", () => {
        initialState = {
            ...initialState,
            viewsCache,
        };

        const viewId = 1;
        const updatedViewMeta = {
            name: "Updated View",
        };
        const newViewState = viewsReducer(
            initialState,
            updateViewMeta({ id: viewId, meta: updatedViewMeta })
        );
        expect(newViewState.viewsCache).toStrictEqual({
            ...viewsCache,
            [viewId]: {
                ...viewsCache[viewId],
                data: {
                    ...viewsCache[viewId].data,
                    ...updatedViewMeta,
                },
            },
        });
    });
});

describe("selectedViewSelector", () => {
    it("should return selected view", () => {
        const viewId = 1;
        initialState = {
            ...initialState,
            viewsCache,
            selectedViewId: viewId,
        };
        const selectedView = selectedViewSelector({
            views: initialState,
        } as unknown as RootState);
        expect(selectedView).toStrictEqual(viewsCache[viewId]);
    });
});

describe("getSelectedViewRefFromDraft", () => {
    it("should return undefined at first", () => {
        const selectedView = getSelectedViewRefFromDraft(initialState);
        expect(selectedView).toBeUndefined();
    });

    it("should return selected view", () => {
        const viewId = 1;
        initialState = {
            ...initialState,
            viewsCache,
            selectedViewId: viewId,
        };
        const selectedView = getSelectedViewRefFromDraft(initialState);
        expect(selectedView).toStrictEqual(viewsCache[viewId]);
    });
});

describe("setViewKeywords", () => {
    it("should set view keywords", () => {
        const viewId = 1;
        initialState = {
            ...initialState,
            viewsCache,
            subscribedViewsCache: { ...viewsCache },
            selectedViewId: viewId,
        };

        const keywords = [
            {
                id: 1,
                name: "tag1",
                tag: {
                    id: 1,
                    name: "tag1",
                    tagType: ETag.Global,
                    slug: "tag1",
                },
            },
            {
                id: 2,
                name: "tag1",
                tag: {
                    id: 2,
                    name: "tag2",
                    tagType: ETag.Global,
                    slug: "tag2",
                },
            },
        ];
        const newViewState = viewsReducer(
            initialState,
            setViewKeywords(keywords)
        );
        expect(newViewState.viewsCache?.[viewId].data).toStrictEqual({
            ...viewsCache[viewId].data,
            keywords,
        });
    });
});

describe("addKeywordToViewWidgets", () => {
    it("should add keyword to view widgets", () => {
        initialState = {
            ...initialState,
            viewsCache,
            subscribedViewsCache: { ...viewsCache },
            selectedViewId: 1,
        };

        const keyword = {
            id: 1,
            name: "tag1",
            tag: {
                id: 1,
                name: "tag1",
                tagType: ETag.Global,
                slug: "tag1",
            },
        };
        const newViewState = viewsReducer(
            initialState,
            addKeywordToViewWidgets(keyword)
        );

        const selectedView = getSelectedViewRefFromDraft(newViewState);
        const widget = selectedView?.data.widgets[0];
        const widgetTags = widget?.settings.find(Boolean)?.tags;

        expect(widget).toBeDefined();
        expect(widgetTags).toBeDefined();

        if (widget === undefined) return; // typescript guard

        expect(selectedView).toBeDefined();
        expect(selectedView?.lastModified).toBeDefined();
        expect(widgetTags).toStrictEqual([
            { ...keyword.tag, tag_type: keyword.tag.tagType }, // TODO: we should not need to do this
        ]);
    });
});

describe("removeKeywordsFromViewWidgets", () => {
    it("should remove keywords from view widgets", () => {
        const viewId = 1;
        initialState = {
            ...initialState,
            viewsCache,
            selectedViewId: viewId,
        };

        const keywords = [
            {
                id: 1,
                name: "tag1",
                tag: {
                    id: 1,
                    name: "tag1",
                    tagType: ETag.Global,
                    slug: "tag1",
                },
            },
            {
                id: 2,
                name: "tag1",
                tag: {
                    id: 2,
                    name: "tag2",
                    tagType: ETag.Global,
                    slug: "tag2",
                },
            },
        ];
        const newViewState = viewsReducer(
            initialState,
            removeKeywordsFromViewWidgets(keywords)
        );

        expect(newViewState.viewsCache?.[viewId].data).toStrictEqual({
            ...viewsCache[viewId].data,
            keywords: [],
        });
    });
});

describe("removeTagFromViewWidget", () => {
    it("should remove tag from view widget", () => {
        const viewId = 1;
        initialState = {
            ...initialState,
            viewsCache,
            subscribedViewsCache: { ...viewsCache },
            selectedViewId: viewId,
        };

        const selectedView = getSelectedViewRefFromDraft(initialState);
        const widget = selectedView?.data.widgets[0];

        expect(selectedView).toBeDefined();
        expect(widget).toBeDefined();
        expect(selectedView?.lastModified).toBeUndefined();

        if (widget === undefined) return; // typescript guard

        const tagId = 1;
        const newViewState = viewsReducer(
            initialState,
            removeTagFromViewWidget({
                tagId,
                widgetHash: widget.hash,
            })
        );

        const updatedSelectedView = getSelectedViewRefFromDraft(newViewState);
        const updatedWidget = updatedSelectedView?.data.widgets[0];
        const widgetTags = updatedWidget?.settings.find(Boolean)?.tags;

        expect(widgetTags).toStrictEqual([]);
    });
});

describe("includeTagInViewWidget", () => {
    it("should include tag in view widget", () => {
        const viewId = 1;
        initialState = {
            ...initialState,
            viewsCache,
            subscribedViewsCache: { ...viewsCache },
            selectedViewId: viewId,
        };

        const selectedView = getSelectedViewRefFromDraft(initialState);
        const widget = selectedView?.data.widgets[0];

        expect(widget).toBeDefined();

        if (widget === undefined) return; // typescript guard

        const keyword = {
            id: 1,
            name: "tag1",
            tag: {
                id: 1,
                name: "tag1",
                tagType: ETag.Global,
                slug: "tag1",
            },
        };
        const newViewState = viewsReducer(
            initialState,
            includeTagInViewWidget({
                tag: keyword.tag,
                widgetHash: widget.hash,
            })
        );

        const updatedSelectedView = getSelectedViewRefFromDraft(newViewState);
        const updatedWidget = updatedSelectedView?.data.widgets[0];
        const widgetTags = updatedWidget?.settings.find(Boolean)?.tags;

        expect(widgetTags).toBeDefined();

        if (widget === undefined) return; // typescript guard

        expect(widgetTags).toStrictEqual([
            { ...keyword.tag, tag_type: keyword.tag.tagType },
        ]);
    });
});

describe("removeTagFromAllWidgets", () => {
    it("should remove tag from all widgets", () => {
        const viewId = 1;
        initialState = {
            ...initialState,
            viewsCache,
            subscribedViewsCache: { ...viewsCache },
            selectedViewId: viewId,
        };

        const tag = {
            tagId: 1,
            name: "tag1",
            tagType: ETag.Global,
            slug: "tag1",
        };
        const newViewState = viewsReducer(
            initialState,
            removeTagFromAllWidgets(tag)
        );

        const updatedSelectedView = getSelectedViewRefFromDraft(newViewState);

        updatedSelectedView?.data.widgets.forEach((widget) => {
            const widgetTags = widget.settings.find(Boolean)?.tags;
            expect(widgetTags).toStrictEqual([]);
        });

        expect(updatedSelectedView?.lastModified).toBeDefined();
    });
});

describe("addWidgetsToView", () => {
    it("should add widgets to view", () => {
        const viewId = 1;
        initialState = {
            ...initialState,
            viewsCache,
            subscribedViewsCache: { ...viewsCache },
            selectedViewId: viewId,
        };

        const widgets = [...customTableModuleDataMock];
        const newViewState = viewsReducer(
            initialState,
            addWidgetsToView({ widgets })
        );
        expect(newViewState.viewsCache?.[viewId].data).toStrictEqual({
            ...viewsCache[viewId].data,
            widgets: [...viewsCache[viewId].data.widgets, ...widgets],
        });
    });
});

describe("removeWidgetFromView", () => {
    it("should remove widget from view", () => {
        const viewId = 1;
        initialState = {
            ...initialState,
            viewsCache,
            subscribedViewsCache: { ...viewsCache },
            selectedViewId: viewId,
        };

        const selectedView = getSelectedViewRefFromDraft(initialState);
        const widget = selectedView?.data.widgets[0];

        expect(widget).toBeDefined();

        if (widget === undefined) return; // typescript guard

        const newViewState = viewsReducer(
            initialState,
            removeWidgetFromView({ widgetHash: widget.hash })
        );
        expect(newViewState.viewsCache?.[viewId].data).toStrictEqual({
            ...selectedView?.data,
            widgets: selectedView?.data.widgets.slice(1),
        });
    });
});
