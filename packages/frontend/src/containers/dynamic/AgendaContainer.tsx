import { FC, useMemo } from "react";
import { useWidgetHeight } from "src/api/hooks";
import { TAgendaItem } from "src/api/types/agenda";
import { customDataAsItems } from "src/api/utils/itemUtils";
import { Logger } from "src/api/utils/logging";
import AgendaModule from "src/components/dynamic-modules/agenda/AgendaModule";
import { IModuleContainer } from "src/types";

const AgendaContainer: FC<IModuleContainer<TAgendaItem[]>> = ({
    moduleData,
}) => {
    const widgetHeight = useWidgetHeight(moduleData);

    const items = useMemo(
        () => customDataAsItems(moduleData.widget.custom_data ?? []),
        [moduleData.widget.custom_data]
    );

    // TODO(v-almonacid): remove this block when format_structure is removed from db model
    const legacyItems = moduleData.widget.format_structure.data || [];
    if (Array.isArray(legacyItems) && legacyItems.length > 0) {
        Logger.warn(
            `AgendaContainer: widget ${moduleData.widget.name} contains data in format_structure which has been deprecated`
        );
    }

    return (
        <AgendaModule
            widgetHeight={widgetHeight}
            items={items as TAgendaItem[]}
            isLoadingItems={false}
            onAdjustWidgetHeight={() => {}}
        />
    );
};

export default AgendaContainer;
