import { FC, useMemo } from "react";
import { useWidgetHeight } from "src/api/hooks";
import { customDataAsItems } from "src/api/utils/itemUtils";
import { Logger } from "src/api/utils/logging";
import Roadmap from "src/components/dynamic-modules/roadmap/RoadmapModule";
import { IModuleContainer, TItem } from "src/types";

const RoadmapContainer: FC<IModuleContainer<TItem[]>> = ({ moduleData }) => {
    const widgetHeight = useWidgetHeight(moduleData);

    const items = useMemo(
        () => customDataAsItems(moduleData.widget.custom_data ?? []),
        [moduleData.widget.custom_data]
    );

    // TODO(v-almonacid): remove this block when format_structure is removed from db model
    const legacyItems = moduleData.widget.format_structure?.data || [];
    if (Array.isArray(legacyItems) && legacyItems.length > 0) {
        Logger.warn(
            `RoadmapContainer: widget ${moduleData.widget.name} contains data in format_structure which has been deprecated`
        );
    }

    return (
        <Roadmap
            items={items}
            widgetHeight={widgetHeight}
            onAdjustWidgetHeight={() => {}}
        />
    );
};

export default RoadmapContainer;
