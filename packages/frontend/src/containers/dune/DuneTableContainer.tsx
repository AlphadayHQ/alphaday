import { FC, useMemo } from "react";
import { useWidgetHeight } from "src/api/hooks";
import { EWidgetData, useGetCustomItemsQuery } from "src/api/services";
import { setWidgetHeight } from "src/api/store";
import { useAppDispatch } from "src/api/store/hooks";
import { Logger } from "src/api/utils/logging";
import DuneTableModule from "src/components/dune/DuneTableModule";
import { IModuleContainer } from "src/types";

const DuneTableContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const dispatch = useAppDispatch();

    /* eslint-disable @typescript-eslint/naming-convention */
    const { custom_data, custom_meta, endpoint_url, data_type } =
        moduleData.widget;
    /* eslint-enable @typescript-eslint/naming-convention */

    const widgetHeight = useWidgetHeight(moduleData);
    const handleSetWidgetHeight = (height: number) => {
        dispatch(
            setWidgetHeight({
                widgetHash: moduleData.hash,
                widgetHeight: height,
            })
        );
    };

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

    console.log("items", moduleData.widget.name, items);

    return (
        <DuneTableModule
            items={items}
            columns={meta.columns}
            rowProps={meta.row_props}
            isLoadingItems={isLoading}
            handlePaginate={() => ({})}
            widgetHeight={widgetHeight}
            setWidgetHeight={handleSetWidgetHeight}
        />
    );
};

export default DuneTableContainer;
