import { FC, useMemo, useState, useEffect, useCallback } from "react";
import { usePagination, useWidgetHeight } from "src/api/hooks";
import { useGetCustomItemsQuery } from "src/api/services";
import { setWidgetHeight } from "src/api/store";
import { useAppDispatch } from "src/api/store/hooks";
import { TCustomItem } from "src/api/types";
import { buildUniqueItemList } from "src/api/utils/itemUtils";
import { Logger } from "src/api/utils/logging";
import DuneTableModule from "src/components/dune/DuneTableModule";
import CONFIG from "src/config";
import { IModuleContainer } from "src/types";

const { MAX_PAGE_NUMBER } = CONFIG.WIDGETS.DUNE_TABLE;

const DuneTableContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const dispatch = useAppDispatch();

    /* eslint-disable @typescript-eslint/naming-convention */
    const { custom_data, custom_meta, endpoint_url } = moduleData.widget;
    /* eslint-enable @typescript-eslint/naming-convention */

    const widgetHeight = useWidgetHeight(moduleData);

    const [currentPage, setCurrentPage] = useState<number | undefined>(1);
    const [items, setItems] = useState<TCustomItem[] | undefined>();

    const {
        data: apiData,
        isLoading: isLoadingApi,
        isSuccess,
    } = useGetCustomItemsQuery(
        {
            endpointUrl: endpoint_url || "",
            page: currentPage,
            limit: 20,
        },
        {
            skip: !endpoint_url,
        }
    );

    const {
        nextPage,
        handleNextPage,
    } = usePagination(apiData?.links, MAX_PAGE_NUMBER, isSuccess);

    const handlePaginate = useCallback(() => {
        handleNextPage("next");
    }, [handleNextPage]);

    // Set current page after next page is determined
    useEffect(() => {
        if (nextPage === undefined) {
            return;
        }
        const timeout = setTimeout(() => {
            setCurrentPage(nextPage);
        }, 350);
        return () => {
            clearTimeout(timeout);
        };
    }, [nextPage]);

    // Build unique items list when new data arrives
    useEffect(() => {
        const newItems = apiData?.results;
        if (newItems) {
            setItems((prevItems) => {
                if (prevItems) {
                    return buildUniqueItemList<TCustomItem>([
                        ...prevItems,
                        ...newItems,
                    ]);
                }
                return newItems;
            });
        }
    }, [apiData?.results]);

    const handleSetWidgetHeight = (height: number) => {
        dispatch(
            setWidgetHeight({
                widgetHash: moduleData.hash,
                widgetHeight: height,
            })
        );
    };

    const displayItems = useMemo(() => {
        // Use accumulated items from API when endpoint_url is set
        if (endpoint_url) {
            // Use accumulated items if available, otherwise fall back to current API data
            return items || apiData?.results || [];
        }

        // Use static custom_data
        if (!custom_data || !custom_meta) {
            Logger.error("DuneTableContainer: missing data or meta");
            return [];
        }
        if (custom_meta.layout_type !== "table") {
            Logger.error(
                "DuneTableContainer: invalid layout type, expected table"
            );
            return [];
        }
        return custom_data;
    }, [custom_data, custom_meta, items, endpoint_url, apiData?.results]);

    const meta = useMemo(() => {
        if (custom_meta?.layout_type === "table") {
            return {
                row_props: custom_meta.layout?.row_props,
                columns: custom_meta.layout?.columns ?? [],
            };
        }
        return {
            row_props: undefined,
            columns: [],
        };
    }, [custom_meta]);

    return (
        <DuneTableModule
            items={displayItems}
            columns={meta.columns}
            rowProps={meta.row_props}
            isLoadingItems={isLoadingApi}
            handlePaginate={handlePaginate}
            widgetHeight={widgetHeight}
            setWidgetHeight={handleSetWidgetHeight}
        />
    );
};

export default DuneTableContainer;
