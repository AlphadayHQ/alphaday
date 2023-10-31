import { FC, useMemo } from "react";
import { useWidgetHeight } from "src/api/hooks";
import { EWidgetData, useGetCustomItemsQuery } from "src/api/services";
import { Logger } from "src/api/utils/logging";
import CustomTableModule from "src/components/custom-modules/CustomTableModule";
import { IModuleContainer } from "src/types";

const CustomTableContainer: FC<IModuleContainer> = ({ moduleData }) => {
    /* eslint-disable @typescript-eslint/naming-convention */
    const { custom_data, custom_meta, endpoint_url, data_type } =
        moduleData.widget;
    /* eslint-enable @typescript-eslint/naming-convention */

    const widgetHeight = useWidgetHeight(moduleData);

    const { data, isLoading } = useGetCustomItemsQuery(
        {
            endpointUrl: endpoint_url || "",
        },
        {
            skip: data_type === EWidgetData.Static,
        }
    );

    const items = useMemo(() => {
        if (data_type === EWidgetData.Static) {
            if (!custom_data || !custom_meta) {
                Logger.error("CustomTableContainer: missing data or meta");
                return [];
            }
            if (custom_meta.layout_type !== "table") {
                Logger.error(
                    "CustomTableContainer: invalid layout type, expected table"
                );
                return [];
            }
            return custom_data;
        }
        return data?.results ?? [];
    }, [custom_data, custom_meta, data?.results, data_type]);

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
        <CustomTableModule
            items={items}
            columns={meta.columns}
            rowProps={meta.row_props}
            isLoadingItems={isLoading}
            handlePaginate={() => ({})}
            widgetHeight={widgetHeight}
        />
    );
};

export default CustomTableContainer;
