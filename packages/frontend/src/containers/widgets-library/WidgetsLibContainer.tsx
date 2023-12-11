import { FC, useCallback, useState, useRef, useEffect, useMemo } from "react";
import {
    useGlobalSearch,
    usePagination,
    useView,
    useWidgetLib,
} from "src/api/hooks";
import { ETag, EItemsSortBy, TRemoteWidgetMini } from "src/api/services";
import {
    useGetWidgetByIdQuery,
    useGetWidgetsCategoryQuery,
    useGetWidgetsQuery,
} from "src/api/services/views/viewsEndpoints";
import { TUserViewWidget, TWidget, TWidgetMini } from "src/api/types";
import { recomputeWidgetsPos } from "src/api/utils/layoutUtils";
import { EToastRole, toast } from "src/api/utils/toastUtils";
import WidgetLibrary from "src/components/widget-library/WidgetLibrary";
import CONFIG from "src/config/config";
import { v4 as uuidv4 } from "uuid";

const { VIEWS } = CONFIG;
const INITIAL_PAGE = 1;

interface IWidgetLibContainerProps {
    layoutState: TUserViewWidget[][] | undefined;
}
const WidgetsLibContainer: FC<IWidgetLibContainerProps> = ({ layoutState }) => {
    const { selectedView, addWidgetsToCache } = useView();
    const { keywordSearchList } = useGlobalSearch();

    const { showWidgetLib, toggleWidgetLib } = useWidgetLib();

    const [filter, setFilter] = useState<string | undefined>();
    const [selectedCategory, setSelectedCategory] = useState<
        string | undefined
    >();
    const [selectedWidget, setSelectedWidget] = useState<TWidgetMini>();
    const [sortBy, setSortBy] = useState(EItemsSortBy.Name);
    const [widgets, setWidgets] = useState<TRemoteWidgetMini[]>([]);

    // used to track when a new widget has been selected from the library
    const previousResolvedWidgetId = useRef<number | undefined>();

    const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);

    const {
        currentData: currentWidgetsData,
        isFetching,
        isSuccess,
    } = useGetWidgetsQuery(
        {
            sortBy,
            search: filter,
            page: currentPage,
            limit: CONFIG.UI.WIDGETS_LIBRARY.LIMIT,
        },
        { refetchOnMountOrArgChange: true }
    );
    const { data: widgetsCategory } = useGetWidgetsCategoryQuery();

    const { currentData: resolvedWidget } = useGetWidgetByIdQuery(
        { id: selectedWidget?.id ?? 0 },
        {
            skip: selectedWidget === undefined,
        }
    );

    // shallow copy necessary because response is read-only
    const widgetsDataForCurrentPage: TRemoteWidgetMini[] | undefined = useMemo(
        () => [...(currentWidgetsData?.results ?? [])],
        [currentWidgetsData?.results]
    );
    const prevWidgetsDataRef = useRef<TRemoteWidgetMini[]>();

    // if the current response changes, it means the user scrolled down
    // and a request for the next page has completed
    // In this case, we append the new data.
    // When user subscribed/unsubscribed from a view, the response may include
    // items that were already in a previous response, so we need to handle this
    // as well.
    if (
        currentWidgetsData?.results !== undefined &&
        prevWidgetsDataRef.current !== widgetsDataForCurrentPage
    ) {
        setWidgets((prevState) => {
            return [...prevState, ...widgetsDataForCurrentPage];
        });
        prevWidgetsDataRef.current = widgetsDataForCurrentPage;
    }

    const handleSelectWidget = (widget: TWidgetMini) => {
        setSelectedWidget(widget);
    };

    const addWidgetToCurrentLayout = useCallback(() => {
        if (selectedView && layoutState && resolvedWidget) {
            const widget = resolvedWidget;
            const widgetsCount = selectedView.data.widgets.length;
            const widgetCount = selectedView.data.widgets?.filter(
                (cw) => cw.widget.slug === widget.slug
            ).length;
            const maxWidgets =
                selectedView.data.max_widgets ?? VIEWS.MAX_WIDGETS;
            if (widget.max_per_view && widgetCount >= widget.max_per_view) {
                toast(
                    `A maximum number of ${widget.max_per_view} ${widget.name} is allowed per board`,
                    {
                        type: EToastRole.Error,
                        status: "alert",
                    }
                );
                return;
            }
            if (widgetsCount >= maxWidgets) {
                toast(
                    `A maximum of ${String(
                        maxWidgets
                    )} widgets is allowed per board`,
                    {
                        type: EToastRole.Error,
                        status: "alert",
                    }
                );
                return;
            }
            const shortestCol = layoutState
                .map((a) => a.length)
                .indexOf(Math.min(...layoutState.map((a) => a.length)));
            const newWidget: TUserViewWidget = {
                id: 990, // will be replaced on save view - doesn't have to be unique on the frontend
                hash: uuidv4(), // will be replaced on save view - needs to be unique
                name: widget.name,
                widget,
                settings: widget.settings.map(({ setting }, id) => ({
                    setting: {
                        id: Number(id) + 1,
                        slug: setting.slug,
                        name: setting.slug,
                        setting_type: "tags",
                    },
                    tags: keywordSearchList?.map((k) => ({
                        ...k.tag,
                        tag_type: ETag.Global, // this is a new widget which should not persist any tags
                    })),
                    toggle_value: false,
                })),
                sort_order: selectedView.data.widgets.length,
            };
            // clone previous layout state
            const newLayoutState: TUserViewWidget[][] = [[]];
            for (let i = 0; i < layoutState.length; i += 1) {
                newLayoutState[i] = [...layoutState[i]];
            }
            newLayoutState[shortestCol].push(newWidget);
            addWidgetsToCache(recomputeWidgetsPos(newLayoutState));
            scrollTo(0, document.body.scrollHeight);
        }
    }, [
        addWidgetsToCache,
        keywordSearchList,
        layoutState,
        resolvedWidget,
        selectedView,
    ]);

    if (
        resolvedWidget !== undefined &&
        resolvedWidget.id !== previousResolvedWidgetId.current
    ) {
        addWidgetToCurrentLayout();
        previousResolvedWidgetId.current = resolvedWidget.id;
    }

    const handleFilter = (value: string) => {
        const normalizedValue = value.toLowerCase();
        if (isFetching || filter === normalizedValue) return;
        if (widgets.length > 0) setWidgets([]);
        if (currentPage !== INITIAL_PAGE) setCurrentPage(INITIAL_PAGE);
        setFilter(normalizedValue);
    };

    const handleSortBy = (sort: EItemsSortBy): void => {
        if (isFetching || sortBy === sort) return;
        if (widgets.length > 0) setWidgets([]);
        if (currentPage !== INITIAL_PAGE) setCurrentPage(INITIAL_PAGE);
        setSortBy(sort);
    };

    const onCloseWidgetLib = useCallback(() => {
        if (showWidgetLib) {
            toggleWidgetLib();
            setFilter(undefined);
            setSelectedCategory(undefined);
        }
    }, [showWidgetLib, toggleWidgetLib]);

    const { nextPage, handleNextPage } = usePagination(
        currentWidgetsData?.links,
        CONFIG.UI.WIDGETS_LIBRARY.LIMIT,
        isSuccess
    );

    useEffect(() => {
        if (nextPage === undefined) return () => null;
        const timeout = setTimeout(() => {
            setCurrentPage(nextPage);
        }, 350);
        return () => {
            clearTimeout(timeout);
        };
    }, [nextPage]);

    return (
        <WidgetLibrary
            showWidgetLib={showWidgetLib}
            widgets={[...(widgets ?? [])].filter((w) => {
                // filter by category. If no category is selected, show all widgets
                return (
                    !selectedCategory ||
                    w.categories.some((c) => {
                        return c.slug === selectedCategory;
                    })
                );
            })}
            categories={[...(widgetsCategory?.results || [])].sort(
                (a, d) => a.sort_order - d.sort_order
            )}
            cachedWidgets={selectedView?.data.widgets?.map(
                (sw) => sw.widget as TWidget
            )}
            sortBy={sortBy}
            onSortBy={handleSortBy}
            onFilter={handleFilter}
            isLoading={widgets === undefined}
            onCloseWidgetLib={onCloseWidgetLib}
            selectedWidget={selectedWidget}
            selectedCategory={selectedCategory}
            handleSelectWidget={handleSelectWidget}
            handleSelectCategory={setSelectedCategory}
            handlePaginate={handleNextPage}
        />
    );
};
export default WidgetsLibContainer;
