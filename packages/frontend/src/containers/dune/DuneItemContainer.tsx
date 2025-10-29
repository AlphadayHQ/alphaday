import { FC, useMemo } from "react";
import { useWidgetHeight } from "src/api/hooks";
import { setWidgetHeight } from "src/api/store";
import { useAppDispatch } from "src/api/store/hooks";
import { generateColumnsFromRowData } from "src/api/utils/customDataUtils";
import CustomTableModule from "src/components/custom-modules/CustomTableModule";
import { IModuleContainer } from "src/types";

const DuneItemContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const dispatch = useAppDispatch();

    /* eslint-disable @typescript-eslint/naming-convention */
    const { custom_data } = moduleData.widget;
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

    // Skip validation and use raw data directly
    const items = useMemo(() => {
        return custom_data ?? [];
    }, [custom_data]);

    // Auto-generate columns from the first row of data
    const meta = useMemo(() => {
        return {
            row_props: undefined,
            columns: generateColumnsFromRowData(items),
        };
    }, [items]);

    return (
        <CustomTableModule
            items={items}
            columns={meta.columns}
            rowProps={meta.row_props}
            isLoadingItems={false}
            handlePaginate={() => ({})}
            widgetHeight={widgetHeight}
            setWidgetHeight={handleSetWidgetHeight}
        />
    );
};

export default DuneItemContainer;
