import moment from "moment";
import {
    TRemoteUserView,
    TRemoteUserViewMeta,
    TRemoteUserViewDraft,
} from "src/api/services";
import {
    TCachedView,
    TCachedViewMeta,
    TUserView,
    TUserViewPreview,
} from "src/api/types";
import CONFIG from "src/config/config";
import { ETemplateNameRegistry } from "src/constants";
import { TTemplateSlug } from "src/types";
import { isHash } from "./helpers";
import { Logger } from "./logging";

/**
 * Checks whether a *custom* view has been recently modified
 * @param view A custom view in cache
 * @returns true if the view has been modified and the changes haven't been persisted in the BE
 */
export const isViewModified = (view: TCachedViewMeta): boolean => {
    if (view.lastModified === undefined) return false;
    const lastModified = moment(view.lastModified);
    const lastSaved = moment(view.data.updated_at);
    return lastModified.isAfter(lastSaved);
};

/**
 * @param cachedView A view in local cache
 * @param remoteViewMeta Metadata for the same view given by the BE
 * @returns true if the local view is not up-to-date wrt the BE
 */
export const isViewStale = (
    cachedView: TCachedViewMeta,
    remoteViewMeta: TUserViewPreview
): boolean => {
    const lastUpdateObserved = moment(cachedView.data.updated_at);
    const lastUpdate = moment(remoteViewMeta.updated_at);
    if (lastUpdate.isAfter(lastUpdateObserved)) {
        Logger.debug(
            "viewUtils::isViewStale::lastUpdateObserved",
            lastUpdateObserved
        );
        Logger.debug("viewUtils::isViewStale::lastUpdate", lastUpdate);
    }
    return lastUpdate.isAfter(lastUpdateObserved);
};

export const mapRemoteView = (remoteView: TRemoteUserView): TUserView => ({
    ...remoteView,
    keywords: remoteView.keywords.map((kw) => ({
        ...kw,
        tag: {
            ...kw.tag,
            tagType: kw.tag.tag_type,
        },
    })),
});

export const remoteViewAsCachedView: (
    remoteView: TRemoteUserView
) => TCachedView = (remoteView) => ({
    lastModified: undefined,
    lastSynced: new Date().toISOString(),
    data: mapRemoteView(remoteView),
});

/**
 * @param hashOrSlug The hash or slug to build the relative url from
 * @returns "/" if hashOrSlug is undefined. Otherwise "/b/<hashOrSlug>/"
 */
export const buildViewPathFromHashOrSlug = (
    hashOrSlug: string | undefined
): string => {
    if (hashOrSlug === undefined) return "/";
    return `${CONFIG.ROUTING.ROUTES.VIEW_BASE}${hashOrSlug}/`;
};

/**
 * @param view the view object to build the relative url path from
 * @returns "/" if hashOrSlug is undefined. Otherwise "/b/<view.hash ?? view.slug>/"
 */
export const buildViewPath = (
    view: TRemoteUserViewMeta | undefined
): string => {
    if (view === undefined) return "/";
    return buildViewPathFromHashOrSlug(view.slug ?? view.hash);
};

export const buildViewUrl = (hashOrSlug: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}${buildViewPathFromHashOrSlug(hashOrSlug)}`;
};

export const buildViewDraft = (
    viewData: TUserView,
    viewName?: string,
    sortOrder?: number
): TRemoteUserViewDraft => {
    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        id,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        hash: viewHash,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        slug: viewSlug,
        keywords,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        icon: viewIcon,
        ...restViewData
    } = viewData;
    return {
        ...restViewData,
        icon: null,
        sort_order: sortOrder || restViewData.sort_order,
        name: viewName !== undefined ? viewName : restViewData.name,
        widgets: restViewData.widgets.map((widget) => {
            const { hash, ...restWidgetData } = widget;
            return {
                ...restWidgetData,
                // omit hash field for new widgets
                // recall: new widgets from widget library use a
                // temporal unique identifier whose length != 32
                ...(isHash(hash) && { hash }),
                widget: {
                    slug: widget.widget.slug,
                    settings: widget.widget.settings,
                },
            };
        }),
        keywords: keywords.map((keyword) => ({
            id: keyword.id,
        })),
    };
};

/**
 * This function is used to get the widget name from the template slug.
 *
 * @param templateSlug
 */
export const getWidgetName = (
    templateSlug: TTemplateSlug
): Exclude<keyof typeof CONFIG.WIDGETS, "COMMON"> | undefined => {
    const strippedSlug = templateSlug.replace("_template", "").toUpperCase();

    const [, foundEntry] =
        Object.entries(ETemplateNameRegistry).find(
            ([, entry]) => entry === strippedSlug
        ) ?? [];

    return foundEntry;
};
