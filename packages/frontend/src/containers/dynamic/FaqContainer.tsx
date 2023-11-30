import { FC, useMemo } from "react";
import { useWidgetHeight } from "src/api/hooks";
import { customDataAsItems } from "src/api/utils/itemUtils";
import { Logger } from "src/api/utils/logging";
import FaqModule from "src/components/dynamic-modules/faq/FaqModule";
import { IModuleContainer, TItem } from "src/types";

const FaqContainer: FC<IModuleContainer<TItem[][]>> = ({ moduleData }) => {
    const widgetHeight = useWidgetHeight(moduleData);

    const items = useMemo(
        () => customDataAsItems(moduleData.widget.custom_data ?? []),
        [moduleData.widget.custom_data]
    );

    const data = moduleData.widget.format_structure.data?.[0];
    if (Array.isArray(data) && data.length > 0 && items.length === 0) {
        Logger.warn("FaqContainer: format_structure has been deprecated");
    }

    return (
        <FaqModule
            widgetHeight={widgetHeight}
            items={items}
            onAdjustWidgetHeight={() => {}}
        />
    );
};

export default FaqContainer;
