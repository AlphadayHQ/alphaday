import { type FC, useMemo, useState, useEffect, useCallback } from "react";
import { useAuth, usePagination, useWidgetHeight } from "src/api/hooks";
import { useView } from "src/api/hooks/useView";
import {
    useImportDuneMutation,
    useUpdateWidgetSettingsMutation,
    useGetCustomItemsQuery,
} from "src/api/services";
import { setWidgetHeight, updateWidgetCustomDataMeta } from "src/api/store";
import { useAppDispatch } from "src/api/store/hooks";
import type { TCustomItem } from "src/api/types";
import { extractDuneQueryId } from "src/api/utils/duneUtils";
import { buildUniqueItemList } from "src/api/utils/itemUtils";
import { Logger } from "src/api/utils/logging";
import DuneModule from "src/components/dune/DuneModule";
import CONFIG from "src/config";
import { EWidgetSettingsRegistry } from "src/constants";
import type { IModuleContainer } from "src/types";

const { MAX_PAGE_NUMBER } = CONFIG.WIDGETS.DUNE;

const DuneContainer: FC<IModuleContainer> = ({
    moduleData,
    mobileViewWidgetHeight,
}) => {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAuth();
    const { selectedView } = useView();

    const [importDune, { isLoading: isImporting }] = useImportDuneMutation();
    const [updateWidgetSettings] = useUpdateWidgetSettingsMutation();

    /* eslint-disable @typescript-eslint/naming-convention */
    const { custom_meta, custom_data, endpoint_url } = moduleData.widget;
    /* eslint-enable @typescript-eslint/naming-convention */

    // Read widget_json_setting from widget settings
    const widgetJsonSetting = moduleData.settings.find(
        (s) =>
            s.widget_setting.setting.slug === EWidgetSettingsRegistry.WidgetJson
    )?.json_value as
        | {
              widget_name?: string;
              dune_query_url?: string;
              import_time?: string;
          }
        | undefined;

    // State to track Dune query metadata (widget name, URL, import time)
    const [duneMeta, setDuneMeta] = useState<{
        widgetName: string;
        duneQueryURL: string;
        importTime: string;
    } | null>(
        widgetJsonSetting?.widget_name &&
            widgetJsonSetting?.dune_query_url &&
            widgetJsonSetting?.import_time
            ? {
                  widgetName: widgetJsonSetting.widget_name,
                  duneQueryURL: widgetJsonSetting.dune_query_url,
                  importTime: widgetJsonSetting.import_time,
              }
            : null
    );

    const widgetHeight = useWidgetHeight(moduleData);

    const [currentPage, setCurrentPage] = useState<number | undefined>(1);
    const [items, setItems] = useState<TCustomItem[]>([]);

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

    const { nextPage, handleNextPage } = usePagination(
        apiData?.links,
        MAX_PAGE_NUMBER,
        isSuccess
    );

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

    // Build unique items list when new data arrives
    useEffect(() => {
        const newItems = apiData?.results;
        if (newItems && newItems.length > 0) {
            setItems((prevItems) => {
                // For Dune data without IDs, generate unique IDs based on page and index
                const itemsWithIds = newItems.map((item, index) => ({
                    ...item,
                    id: item.id ?? `${currentPage}-${index}`,
                }));

                const combined = buildUniqueItemList<TCustomItem>([
                    ...prevItems,
                    ...itemsWithIds,
                ]);
                return combined;
            });
        }
    }, [apiData?.results, currentPage]);

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
            // If still loading first page, return undefined to show loader
            if (items.length === 0 && isLoadingApi) {
                return undefined;
            }
            // Return items (could be empty array if no results)
            return items;
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
    }, [custom_data, custom_meta, items, endpoint_url, isLoadingApi]);

    // Only show loader on initial load, not when paginating
    const isLoading = isImporting || (isLoadingApi && items.length === 0);

    const handleSetDuneMeta = (data: {
        widgetName: string;
        duneQueryURL: string;
        importTime: string;
    }) => {
        const queryId = extractDuneQueryId(data.duneQueryURL);
        if (queryId) {
            Logger.info("DuneContainer::importDune: Importing Dune query", {
                queryId,
                widgetName: data.widgetName,
            });
            importDune({
                query_id: queryId,
                cached: true,
                widget_name: data.widgetName,
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
                                settings: [
                                    {
                                        setting_slug: "widget_dataset_setting",
                                        selected_dataset: res.data.id,
                                    },
                                    {
                                        setting_slug: "widget_json_setting",
                                        json_value: {
                                            widget_name: data.widgetName,
                                            dune_query_url: data.duneQueryURL,
                                            import_time: data.importTime,
                                        },
                                    },
                                ],
                            })
                                .then(() => {
                                    dispatch(
                                        updateWidgetCustomDataMeta({
                                            widgetHash: moduleData.hash,
                                            custom_data: res.data.data,
                                            custom_meta: res.data.meta,
                                        })
                                    );
                                })
                                .catch((err) =>
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
                        // Update the duneMeta state with the actual data
                        setDuneMeta(data);
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
            widgetHeight={widgetHeight ?? mobileViewWidgetHeight}
            setWidgetHeight={handleSetWidgetHeight}
            onSetDuneMeta={handleSetDuneMeta}
            duneMeta={duneMeta}
        />
    );
};

export default DuneContainer;
