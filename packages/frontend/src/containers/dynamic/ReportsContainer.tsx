import { useState, useEffect, FC } from "react";
import { usePagination, useWidgetHeight } from "src/api/hooks";
import { EWidgetData, useGetDynamicItemsQuery } from "src/api/services";
import { customDataAsItems } from "src/api/utils/itemUtils";
import ReportsModule from "src/components/dynamic-modules/ReportsModule";
import CONFIG from "src/config/config";
import { IModuleContainer, TItem } from "src/types";

const { MAX_PAGE_NUMBER } = CONFIG.WIDGETS.TABLE;
const ReportsContainer: FC<IModuleContainer<TItem[]>> = ({ moduleData }) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { custom_data, endpoint_url, data_type } = moduleData.widget;
    const widgetHeight = useWidgetHeight(moduleData);

    const [currentPage, setCurrentPage] = useState<number | undefined>(
        undefined
    );
    const [items, setItems] = useState(customDataAsItems(custom_data || []));
    const { data, isLoading, isSuccess } = useGetDynamicItemsQuery(
        {
            page: currentPage,
            endpointUrl: endpoint_url || "",
        },
        {
            skip: data_type === EWidgetData.Static,
        }
    );

    const { nextPage, handleNextPage } = usePagination(
        data?.links,
        MAX_PAGE_NUMBER,
        isSuccess
    );

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

    useEffect(() => {
        const newItems = data?.results as TItem[];
        if (!newItems || newItems.length === 0) return;
        setItems((prevItems) => [...prevItems, ...newItems]);
    }, [data?.results]);

    return (
        <ReportsModule
            items={items.sort(
                (a, d) =>
                    new Date(d.reported_at).getTime() -
                    new Date(a.reported_at).getTime()
            )}
            isLoadingItems={isLoading}
            handlePaginate={handleNextPage}
            widgetHeight={widgetHeight}
        />
    );
};

export default ReportsContainer;
