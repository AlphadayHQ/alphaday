import { FC, useMemo } from "react";
import { useWidgetHeight } from "src/api/hooks";
import Roadmap from "src/components/dynamic-modules/roadmap/RoadmapModule";
import { v4 as uuidV4 } from "uuid";
import { IModuleContainer, TItem } from "src/types";

const RoadmapContainer: FC<IModuleContainer<TItem[]>> = ({ moduleData }) => {
    const widgetHeight = useWidgetHeight(moduleData);

    const items = useMemo(
        () => moduleData.widget.format_structure.data || [],
        [moduleData.widget.format_structure.data]
    );

    // Add unique id to each item if id is not present, generate a uuid
    const uniqueItems = useMemo(
        () => items.map((item) => ({ ...item, id: item.id || uuidV4() })),
        [items]
    );

    return (
        <Roadmap
            items={uniqueItems}
            widgetHeight={widgetHeight}
            onAdjustWidgetHeight={() => {}}
        />
    );
};

export default RoadmapContainer;
