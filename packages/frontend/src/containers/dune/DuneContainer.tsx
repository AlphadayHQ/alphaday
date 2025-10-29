import { FC, useMemo, useState, useEffect } from "react";
import { useWidgetHeight } from "src/api/hooks";
import { useImportDuneMutation } from "src/api/services";
import { setWidgetHeight } from "src/api/store";
import { useAppDispatch } from "src/api/store/hooks";
import { extractDuneQueryId } from "src/api/utils/duneUtils";
import DuneModule from "src/components/dune/DuneModule";
import { IModuleContainer } from "src/types";

const DuneContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const dispatch = useAppDispatch();

    const [endpointUrl, setEndpointUrl] = useState<string>("");
    const [importDune, { data, isLoading }] = useImportDuneMutation();

    /* eslint-disable @typescript-eslint/naming-convention */
    const { custom_meta, custom_data } = moduleData.widget;
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

    useEffect(() => {
        if (endpointUrl !== "") {
            const queryId = extractDuneQueryId(endpointUrl);
            if (queryId) {
                importDune({
                    query_id: queryId,
                    cached: true,
                });
            }
        }
    }, [endpointUrl, importDune]);

    const items = useMemo(() => {
        if (endpointUrl === "") {
            return custom_data;
        }
        return data?.results ?? [];
    }, [custom_data, data?.results, endpointUrl]);

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

    const handleSetEndpointUrl = (url: string) => {
        setEndpointUrl(url);
    };

    return (
        <DuneModule
            items={items}
            columns={meta.columns}
            rowProps={meta.row_props}
            isLoadingItems={isLoading}
            handlePaginate={() => ({})}
            widgetHeight={widgetHeight}
            setWidgetHeight={handleSetWidgetHeight}
            onSetEndpointUrl={handleSetEndpointUrl}
        />
    );
};

export default DuneContainer;
