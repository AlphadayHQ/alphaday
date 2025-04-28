import { TRemoteUserView, TRemoteUserViewPreview } from "src/api/services";
import { TCachedView, TSubscribedView, TUserView } from "src/api/types";
import { ELanguageCode } from "src/api/types/language";
import { remoteViewAsCachedView } from "src/api/utils/viewUtils";
import { tableModuleDataMock } from "./tables";

export const fakeRemoteView = (
    viewId: number,
    viewData?: Partial<Omit<TUserView, "keywords">>
): TRemoteUserView => ({
    id: viewId,
    hash: "0x0",
    name: "View 1",
    description: "Mock View",
    icon: "",
    widgets: tableModuleDataMock,
    keywords: [],
    is_subscribed: false,
    is_system_view: false,
    is_smart: false,
    updated_at: new Date().toISOString(),
    sort_order: 0,
    max_widgets: 9,
    language: ELanguageCode.EN,
    ...viewData,
});

export const fakeSubscribedView = (viewId: number): TRemoteUserViewPreview => ({
    id: viewId,
    hash: "ea8d",
    slug: "mock",
    name: "mock",
    description: "A Mock.",
    icon: "",
    sort_order: 0,
    is_system_view: true,
    is_smart: false,
    is_subscribed: false,
    updated_at: new Date().toISOString(),
});

export const fakeSubscribedViewsCacheMock = (
    viewId: number
): TSubscribedView => {
    const data = { ...fakeSubscribedView(viewId) };
    return {
        data,
        lastModified: undefined,
        lastSynced: data.updated_at,
    };
};

export const fakeViewsCacheMock = (
    viewId: number,
    viewData?: Partial<Omit<TUserView, "keywords">>
): TCachedView => remoteViewAsCachedView(fakeRemoteView(viewId, viewData));

export const viewsCacheMock: Record<number, TCachedView> = {
    ...Array.from({ length: 10 }, (_, i) => fakeViewsCacheMock(i)),
};

export const subscribedViewsCacheMock: Record<number, TSubscribedView> = {
    ...Array.from({ length: 10 }, (_, i) => fakeSubscribedViewsCacheMock(i)),
};
