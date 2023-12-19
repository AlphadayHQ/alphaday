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

    // TODO(v-almonacid): remove this block when format_structure is removed from db model
    const legacyData = moduleData.widget.format_structure?.data;
    if (Array.isArray(legacyData) && legacyData.length > 0) {
        Logger.warn(
            `FaqContainer: widget ${moduleData.widget.name} contains data in format_structure which has been deprecated`
        );
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
