import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePagination, useView } from "src/api/hooks";
import {
    EItemsSortBy,
    TRemoteWidgetMini,
    useGetWidgetsCategoryQuery,
    useGetWidgetsQuery,
} from "src/api/services";
import { TWidget, TWidgetMini } from "src/api/types";
import { debounce } from "src/api/utils/helpers";
import { Logger } from "src/api/utils/logging";
import { getSortOptionValue } from "src/api/utils/sortOptions";
import CONFIG from "src/config/config";
import MobileWidgetsList from "src/mobile-components/MobileWidgetsList";

const INITIAL_PAGE = 1;

const WidgetsContainer: FC = () => {
    const { selectedView } = useView();
    const [selectedCategory, setSelectedCategory] = useState<
        string | undefined
    >();
    const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);
    const [sortBy, setSortBy] = useState(EItemsSortBy.Name);
    const [filter, setFilter] = useState<string | undefined>();
    const [selectedWidget, setSelectedWidget] = useState<TWidgetMini>();

    const { data: categories } = useGetWidgetsCategoryQuery();

    const {
        currentData: widgetsDataResponse,
        isSuccess,
        isFetching,
    } = useGetWidgetsQuery({
        limit: CONFIG.UI.WIDGETS_LIBRARY.LIMIT,
        page: currentPage,
        sortBy,
        search: filter,
    });

    const [allWidgets, setAllWidgets] = useState<TRemoteWidgetMini[]>([]);

    // shallow copy necessary because response is read-only
    const widgetsDataForCurrentPage = useMemo(
        () => [...(widgetsDataResponse?.results ?? [])],
        [widgetsDataResponse?.results]
    );
    const prevWidgetsDataRef = useRef<TRemoteWidgetMini[]>();

    // if the current response changes, it means the user scrolled down
    // and a request for the next page has completed
    // When user subscribed/unsubscribed from a widget, the response may include
    // items that were already in a previous response, so we need to handle this
    // as well.
    if (
        widgetsDataResponse?.results !== undefined &&
        prevWidgetsDataRef.current !== widgetsDataForCurrentPage
    ) {
        setAllWidgets((prevState) => {
            const updatedWidgetArray = [...prevState];
            widgetsDataForCurrentPage.forEach((updatedWidget) => {
                const existingWidgetIdx = prevState.findIndex(
                    (existingWidget) => existingWidget.id === updatedWidget.id
                );
                if (existingWidgetIdx !== -1) {
                    updatedWidgetArray[existingWidgetIdx] = {
                        ...updatedWidgetArray[existingWidgetIdx],
                        ...updatedWidget,
                    };
                } else {
                    updatedWidgetArray.push(updatedWidget);
                }
            });
            return updatedWidgetArray;
        });
        prevWidgetsDataRef.current = widgetsDataForCurrentPage;
    }

    const handleSelectWidget = useCallback(
        (widgetId: number) => {
            setSelectedWidget(
                allWidgets.find((widget) => widget.id === widgetId)
            );
            Logger.debug(
                "WidgetsContainer::handleSelectWidget called on widget:",
                widgetId
            );
            // For now, just log the selection
            // In the future, this could open a widget detail modal or add to a board
        },
        [allWidgets]
    );

    const handleSortBy = (sortValue: string): void => {
        const sort = getSortOptionValue(sortValue);
        if (isFetching || sort === null || sortBy === sort) return;
        if (allWidgets.length > 0) setAllWidgets([]);
        if (currentPage !== INITIAL_PAGE) setCurrentPage(INITIAL_PAGE);
        setSortBy(sort);
    };

    const handleCategorySelect = (newCategory: string | undefined): void => {
        if (isFetching || newCategory === selectedCategory) return;
        if (allWidgets.length > 0) setAllWidgets([]);
        if (currentPage !== INITIAL_PAGE) setCurrentPage(INITIAL_PAGE);
        setSelectedCategory(newCategory);
    };

    const handleFilter = debounce((value: string) => {
        const normalizedValue = value.toLowerCase();
        if (filter === normalizedValue) return;
        if (allWidgets.length > 0) setAllWidgets([]);
        if (currentPage !== INITIAL_PAGE) setCurrentPage(INITIAL_PAGE);
        setFilter(normalizedValue);
    }, 300);

    const { nextPage, handleNextPage } = usePagination(
        widgetsDataResponse?.links,
        CONFIG.UI.WIDGETS_LIBRARY.LIMIT,
        isSuccess
    );

    if (
        resolvedWidget !== undefined &&
        resolvedWidget.id !== previousResolvedWidgetId.current
    ) {
        addWidgetToCurrentLayout();
        previousResolvedWidgetId.current = resolvedWidget.id;
    }

    // set current page 350ms after next page is set.
    // RTK should cache requests, so we don't need to be too careful about rerenders.
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
        <MobileWidgetsList
            selectedCategory={selectedCategory}
            widgets={allWidgets.filter((w) => {
                // filter by category. If no category is selected, show all widgets
                return (
                    !selectedCategory ||
                    w.categories.some((c) => {
                        return c.slug === selectedCategory;
                    })
                );
            })}
            categories={categories?.results}
            onSelectWidget={handleSelectWidget}
            onCategorySelect={handleCategorySelect}
            sortBy={sortBy}
            onSortBy={handleSortBy}
            handlePaginate={handleNextPage}
            onFilter={handleFilter}
            cachedWidgets={selectedView?.data.widgets?.map(
                (sw) => sw.widget as TWidget
            )}
            selectedWidget={selectedWidget}
        />
    );
};

export default WidgetsContainer;
