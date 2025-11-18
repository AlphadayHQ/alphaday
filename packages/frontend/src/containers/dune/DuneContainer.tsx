import { FC, useMemo, useState, useEffect, useCallback } from "react";
import { useAuth, usePagination, useWidgetHeight } from "src/api/hooks";
import { useView } from "src/api/hooks/useView";
import {
    useImportDuneMutation,
    useUpdateWidgetSettingsMutation,
    useGetCustomItemsQuery,
} from "src/api/services";
import { setWidgetHeight, updateWidgetCustomDataMeta } from "src/api/store";
import { useAppDispatch } from "src/api/store/hooks";
import { TCustomItem } from "src/api/types";
import { extractDuneQueryId } from "src/api/utils/duneUtils";
import { buildUniqueItemList } from "src/api/utils/itemUtils";
import { Logger } from "src/api/utils/logging";
import DuneModule from "src/components/dune/DuneModule";
import CONFIG from "src/config";
import { IModuleContainer } from "src/types";

const { MAX_PAGE_NUMBER } = CONFIG.WIDGETS.DUNE;

const DuneContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAuth();
    const { selectedView } = useView();

    const [importDune, { isLoading: isImporting }] = useImportDuneMutation();
    const [updateWidgetSettings] = useUpdateWidgetSettingsMutation();

    /* eslint-disable @typescript-eslint/naming-convention */
    const { custom_meta, custom_data, endpoint_url } = moduleData.widget;
    /* eslint-enable @typescript-eslint/naming-convention */

    const widgetHeight = useWidgetHeight(moduleData);

    const [currentPage, setCurrentPage] = useState<number | undefined>(
        undefined
    );
    const [items, setItems] = useState<TCustomItem[] | undefined>();

    const {
        data: apiData,
        isLoading: isLoadingApi,
        isSuccess,
    } = useGetCustomItemsQuery(
        {
            endpointUrl: endpoint_url || "",
            page: currentPage,
        },
        {
            skip: !endpoint_url,
        }
    );

    const {
        nextPage,
        handleNextPage,
        reset: resetPagination,
    } = usePagination(apiData?.links, MAX_PAGE_NUMBER, isSuccess);

    const handlePaginate = useCallback(() => {
        handleNextPage("next");
    }, [handleNextPage]);

    // Set current page after next page is determined
    useEffect(() => {
        if (nextPage === undefined) {
            return () => null;
        }
        const timeout = setTimeout(() => {
            setCurrentPage(nextPage);
        }, 350);
        return () => {
            clearTimeout(timeout);
        };
    }, [nextPage]);

    // Reset pagination when endpoint changes
    useEffect(() => {
        if (endpoint_url) {
            setItems(undefined);
            setCurrentPage(undefined);
            resetPagination();
        }
    }, [endpoint_url, resetPagination]);

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

    const displayItems = useMemo(() => {
        // Use accumulated items from API when endpoint_url is set
        if (endpoint_url) {
            // Use accumulated items if available, otherwise fall back to current API data
            return items || apiData?.results || [];
        }

        // Use static custom_data
        if (!custom_data || !custom_meta) {
            Logger.error("DuneContainer: missing data or meta");
            return undefined;
        }
        if (custom_meta.layout_type !== "table") {
            Logger.error("DuneContainer: invalid layout type, expected table");
            return undefined;
        }
        if (!Array.isArray(custom_data)) {
            Logger.error(
                "DuneContainer: custom_data is not an array",
                custom_data
            );
            return undefined;
        }
        return custom_data;
    }, [custom_data, custom_meta, items, endpoint_url, apiData?.results]);

    const isLoading = isImporting || isLoadingApi;

    const handleSetEndpointUrl = (url: string) => {
        const queryId = extractDuneQueryId(url);
        if (queryId) {
            Logger.info("DuneContainer::importDune: Importing Dune query", {
                queryId,
            });
            importDune({
                query_id: queryId,
                cached: true,
            })
                .then((res) => {
                    if ("data" in res && res.data) {
                        if (isAuthenticated && !selectedView?.isReadOnly) {
                            Logger.info(
                                "DuneContainer::updateWidgetSettings: Setting widget dataset",
                                {
                                    widgetHash: moduleData.hash,
                                    datasetId: res.data.id,
                                }
                            );
                            updateWidgetSettings({
                                widget_hash: moduleData.hash,
                                setting_slug: "widget_dataset_setting",
                                selected_dataset: res.data.id,
                            }).catch((err) =>
                                Logger.error(
                                    "DuneContainer::updateWidgetSettings: Failed to update widget settings",
                                    err
                                )
                            );
                        } else {
                            Logger.info(
                                "DuneContainer::updateWidgetCustomDataMeta: Setting widget custom data and meta",
                                {
                                    widgetHash: moduleData.hash,
                                }
                            );
                            dispatch(
                                updateWidgetCustomDataMeta({
                                    widgetHash: moduleData.hash,
                                    custom_data: res.data.data,
                                    custom_meta: res.data.meta,
                                })
                            );
                        }
                    }
                })
                .catch((err) =>
                    Logger.error(
                        "DuneContainer::importDune: Failed to import Dune query",
                        err
                    )
                );
        }
    };

    return (
        <DuneModule
            items={displayItems}
            columns={meta.columns}
            rowProps={meta.row_props}
            isLoadingItems={isLoading}
            handlePaginate={handlePaginate}
            widgetHeight={widgetHeight}
            setWidgetHeight={handleSetWidgetHeight}
            onSetEndpointUrl={handleSetEndpointUrl}
        />
    );
};

export default DuneContainer;
