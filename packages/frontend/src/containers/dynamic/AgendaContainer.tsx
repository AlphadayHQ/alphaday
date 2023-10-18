import { FC, useMemo } from "react";
import { useWidgetHeight } from "src/api/hooks";
import { TAgendaItem } from "src/api/types/agenda";
import AgendaModule from "src/components/dynamic-modules/agenda/AgendaModule";
import { v4 as uuidV4 } from "uuid";
import { IModuleContainer } from "src/types";

const AgendaContainer: FC<IModuleContainer<TAgendaItem[]>> = ({
    moduleData,
}) => {
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
        <AgendaModule
            widgetHeight={widgetHeight}
            items={uniqueItems}
            isLoadingItems={false}
            onAdjustWidgetHeight={() => {}}
        />
    );
};

export default AgendaContainer;
