import queryString from "query-string";
import {
    validateCustomData,
    validateCustomMeta,
} from "src/api/utils/customDataUtils";
import { Logger } from "src/api/utils/logging";
import { TEMPLATES_DICT } from "src/types";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TRemoteUserView,
    TRemoteUserViewWidget,
    TViewsRequest,
    TViewsResponse,
    TViewByIdRequest,
    TViewByIdResponse,
    TSaveViewAsRequest,
    TSaveViewAsResponse,
    TSaveViewRequest,
    TSaveViewResponse,
    TDeleteViewRequest,
    TDeleteViewResponse,
    TWidgetsRequest,
    TWidgetsResponse,
    TWidgetByIdRequest,
    TWidgetByIdResponse,
    TViewByHashOrSlugRequest,
    TViewByHashOrSlugResponse,
    TWidgetsCategoryResponse,
    TWidgetsCategoryRequest,
    TViewCategoriesResponse,
    TViewCategoriesRequest,
    TSubscribedViewsResponse,
    TSubscribedViewsRequest,
    TSubscribeViewRequest,
    TSubscribeViewResponse,
    TSaveViewMetaResponse,
    TSaveViewMetaRequest,
    TViewForWalletRequest,
    TViewForWalletResponse,
    TRemoteRawUserView,
    TViewByIdRawResponse,
    TViewByHashOrSlugRawResponse,
    TViewForWalletRawResponse,
} from "./types";

const { VIEWS } = CONFIG.API.DEFAULT.ROUTES;

const viewCheck = (
    view: Readonly<TRemoteRawUserView>
): Readonly<TRemoteUserView> => {
    const viewWidgets = [...view.widgets];
    const filteredWidgets: TRemoteUserViewWidget[] = [];
    viewWidgets.forEach((viewWidget) => {
        const widgetSlug = viewWidget.widget.template.slug;
        if (!(widgetSlug in TEMPLATES_DICT)) {
            Logger.warn(
                `viewsEndpoints::viewCheck: unknown widget template ${viewWidget.widget.template.slug} found in view ${view.name}`
            );
        } else {
            const dataValidationResult = validateCustomData(
                viewWidget.widget.custom_data
            );
            const metaValidationResult = validateCustomMeta(
                viewWidget.widget.custom_meta
            );
            if (
                dataValidationResult.errorCode ||
                metaValidationResult.errorCode
            ) {
                Logger.warn(
                    `viewsEndpoints::viewCheck: data validation failed for widget ${widgetSlug}`,
                    dataValidationResult.errorCode ??
                        metaValidationResult.errorCode
                );
            }
            // recall: if data (meta) validation failed, data (meta) will be undefined
            const validWidget = {
                ...viewWidget,
                widget: {
                    ...viewWidget.widget,
                    custom_data: dataValidationResult.items,
                    custom_meta: metaValidationResult.meta,
                },
            };
            filteredWidgets.push(validWidget);
        }
    });
    return {
        ...view,
        widgets: filteredWidgets,
    };
};

const viewsApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getViews: builder.query<TViewsResponse, TViewsRequest>({
            query: (req) => {
                const { sortBy, ...rest } = req || {};
                const params = queryString.stringify({
                    ...rest,
                    sort_by: sortBy,
                });
                Logger.debug(
                    "getViews: querying",
                    `${VIEWS.BASE}${VIEWS.AVAILABLE_VIEWS}?${params}`
                );
                return `${VIEWS.BASE}${VIEWS.AVAILABLE_VIEWS}?${params}`;
            },
            providesTags: ["Views", "Lang"],
        }),
        getSubscribedViews: builder.query<
            TSubscribedViewsResponse,
            TSubscribedViewsRequest
        >({
            query: () => {
                Logger.debug(
                    "getSubscribedViews: querying",
                    `${VIEWS.BASE}${VIEWS.SUBSCRIBED_VIEWS}`
                );
                return `${VIEWS.BASE}${VIEWS.SUBSCRIBED_VIEWS}`;
            },
            providesTags: ["SubscribedViews", "Lang"],
        }),
        getViewById: builder.query<TViewByIdResponse, TViewByIdRequest>({
            query: (req) => {
                const path = `${VIEWS.BASE}${VIEWS.VIEW_BY_ID(req.id)}`;
                Logger.debug("getViewById: querying", path);
                return path;
            },
            providesTags: ["Lang"],
            transformResponse: (r: TViewByIdRawResponse): TViewByIdResponse =>
                viewCheck(r),
        }),
        getViewByHash: builder.query<
            TViewByHashOrSlugResponse,
            TViewByHashOrSlugRequest
        >({
            query: (req) => {
                const params = queryString.stringify(req);
                const path = `${VIEWS.BASE}${VIEWS.RESOLVE}?${params}`;
                Logger.debug("getViewByHash: querying", path);
                return path;
            },
            transformResponse: (
                r: TViewByHashOrSlugRawResponse
            ): TViewByHashOrSlugResponse => viewCheck(r),
            providesTags: ["CurrentView", "Lang"],
        }),
        getViewForWallet: builder.query<
            TViewForWalletResponse,
            TViewForWalletRequest
        >({
            query: () => {
                const path = `${VIEWS.BASE}${VIEWS.WALLET_VIEW}`;
                Logger.debug("getViewForWallet: querying", path);
                return path;
            },
            transformResponse: (
                r: TViewForWalletRawResponse
            ): TViewForWalletResponse => viewCheck(r),
            providesTags: ["CurrentView", "Lang"],
        }),
        getViewCategories: builder.query<
            TViewCategoriesResponse,
            TViewCategoriesRequest
        >({
            query: () => {
                const path = `${VIEWS.BASE}${VIEWS.VIEWS_CATEGORIES}`;
                Logger.debug("getViewCategories: querying", path);
                return path;
            },
            providesTags: ["Lang"],
        }),
        subscribeView: builder.mutation<
            TSubscribeViewResponse,
            TSubscribeViewRequest
        >({
            query: (req) => ({
                url: `${VIEWS.BASE}${VIEWS.SUBSCRIBE(req.id)}`,
                method: "POST",
            }),
            invalidatesTags: ["SubscribedViews", "Views"],
        }),
        unsubscribeView: builder.mutation<
            TSubscribeViewResponse,
            TSubscribeViewRequest
        >({
            query: (req) => ({
                url: `${VIEWS.BASE}${VIEWS.UNSUBSCRIBE(req.id)}`,
                method: "POST",
                body: {},
            }),
            invalidatesTags: ["SubscribedViews", "Views"],
        }),
        saveViewAs: builder.mutation<TSaveViewAsResponse, TSaveViewAsRequest>({
            query: (req) => ({
                url: `${VIEWS.BASE}${VIEWS.AVAILABLE_VIEWS}`,
                method: "POST",
                body: req,
            }),
            invalidatesTags: ["SubscribedViews", "Views"],
        }),
        saveView: builder.mutation<TSaveViewResponse, TSaveViewRequest>({
            query: (req) => ({
                url: `${VIEWS.BASE}${VIEWS.VIEW_BY_ID(req.id)}`,
                method: "PUT",
                body: req.body,
            }),
            invalidatesTags: ["SubscribedViews", "Views", "CurrentView"],
        }),
        saveViewMeta: builder.mutation<
            TSaveViewMetaResponse,
            TSaveViewMetaRequest
        >({
            query: (req) => ({
                url: `${VIEWS.BASE}${VIEWS.VIEW_BY_ID(req.id)}`,
                method: "PATCH",
                body: req.body,
            }),
            invalidatesTags: ["SubscribedViews", "Views", "CurrentView"],
        }),
        deleteView: builder.mutation<TDeleteViewResponse, TDeleteViewRequest>({
            query: (req) => ({
                url: `${VIEWS.BASE}${VIEWS.VIEW_BY_ID(req.id)}`,
                method: "DELETE",
                body: {},
            }),
            invalidatesTags: ["SubscribedViews", "Views"],
        }),
        getWidgets: builder.query<TWidgetsResponse, TWidgetsRequest>({
            query: (req) => {
                const { sortBy, ...rest } = req ?? {};
                const params = queryString.stringify({
                    ...rest,
                    sort_by: sortBy,
                });
                const path = `${VIEWS.BASE}${VIEWS.WIDGETS}?${params}`;
                Logger.debug("getWidgets: querying", path);
                return path;
            },
            transformResponse: (r: TWidgetsResponse): TWidgetsResponse => {
                return {
                    ...r,
                    results: [...r.results].filter((widget) => {
                        if (!widget.template) {
                            Logger.warn(
                                "viewsEndpoints::getWidgets: widget with no template found:",
                                widget.slug
                            );
                            return false;
                        }
                        if (!(widget.template.slug in TEMPLATES_DICT)) {
                            Logger.warn(
                                `viewsEndpoints::getWidgets: could not find template ${widget.template.slug} of widget ${widget.name}`
                            );
                            return false;
                        }
                        return true;
                    }),
                };
            },
        }),
        getWidgetsCategory: builder.query<
            TWidgetsCategoryResponse,
            TWidgetsCategoryRequest
        >({
            query: (req) => {
                const params = req ? queryString.stringify(req) : "";
                const path = `${VIEWS.BASE}${String(
                    VIEWS.WIDGET_CATEGORIES
                )}?${params}`;
                Logger.debug("getWidgetsCategory: querying", path);
                return path;
            },
        }),
        getWidgetById: builder.query<TWidgetByIdResponse, TWidgetByIdRequest>({
            query: (req) => {
                const path = `${VIEWS.BASE}${VIEWS.WIDGET_BY_ID(req.id)}`;
                Logger.debug("getWidgetById: querying", path);
                return path;
            },
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetViewsQuery,
    useGetSubscribedViewsQuery,
    useGetWidgetsQuery,
    useGetWidgetByIdQuery,
    useGetViewCategoriesQuery,
    useSubscribeViewMutation,
    useUnsubscribeViewMutation,
    useSaveViewMutation,
    useSaveViewAsMutation,
    useSaveViewMetaMutation,
    useDeleteViewMutation,
    useGetViewByHashQuery,
    useGetWidgetsCategoryQuery,
    useGetViewForWalletQuery,
} = viewsApi;
